const express       = require("express");
const mysql         = require("mysql2");
const multer        = require("multer");
const sharp         = require("sharp");
const cors          = require("cors");
const fs            = require("fs");
const { isContext } = require("vm");

require("dotenv").config();

//// Se connecter à la base de données

const db = mysql.createConnection({
  host: "localhost",
  user: "Rabah",
  password: "Rd-2311-1974",
  database: "groupomania",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connecté à la base de donnée Mysql ! ");
});

//- 1/------- Publier un post ///

exports.createPost = (req, res, next) => {
    
//-A-  Si uniquement texte
  if (!req.file) {
    const post = {
      post: req.body.post,
      user_send: req.body.user_send,
      userId: req.body.userId,
      profil_picture: req.body.profil_picture,
    };
    db.query("INSERT INTO Posts SET ?", [post], (err, results) => {
      if (err) {
        res.status(400).json({message:"Erreur de bdd:", err})
      } else {
        db.query(
          "SELECT *, DATE_FORMAT (date_send, '%d/%m/%Y à %H:%i:%s') as DATETIME_FR FROM posts ORDER BY date_send DESC",
          (err, results) => {
            
            if (err) {
              res.status(500).json({message:"Erreur dans la base de données"}, results);
            } else {
              res.status(200).json(results);
            }
          }
        );
   //  res.status(201).json({message:"Post créé avec succès"})
      }
    });
  }

  //-B-  Si texte + image
  else {
    let image = req.file.filename;
    const post = {
      post: req.body.post,
      user_send: req.body.user_send,
      image: image,
      userId: req.body.userId,
      profil_picture: req.body.profil_picture,
    };
    db.query("INSERT INTO Posts SET ?", [post], (err, results) => {
      if (err) {
        res.status(400).json({message:"Erreur de bdd:", err})
      } else { 
        db.query(
          "SELECT *, DATE_FORMAT (date_send, '%d/%m/%Y à %H:%i:%s') as DATETIME_FR FROM posts ORDER BY date_send DESC",
          (err, results) => {
            
            if (err) {
              res.status(500).json({message:"Erreur dans la base de données"}, results);
            } else {
              res.status(200).json(results);
            }
          }
        );
      }
    });
   
  }
}; // -------> Fin publier un post

//--2/---- Afficher tous les posts //////

exports.getAllPosts = (req, res, next) => {
  db.query(
    "SELECT *, DATE_FORMAT (date_send, '%d/%m/%Y à %H:%i:%s') as DATETIME_FR FROM posts ORDER BY date_send DESC",
    (err, results) => {
      
      if (err) {
        res.status(500).json({message:"Erreur dans la base de données!"}, results);
      } else {
        res.status(200).json(results);
      }
    }
  );
}; //---------------> Fin afficher tous les posts

//--3/---- Afficher mes posts ( sur le profil de l'utilisateur)//////

exports.getAllMyPosts = (req, res) => {
  let userId = req.params.id;

  db.query(
    "SELECT *, DATE_FORMAT (date_send, '%d/%m/%Y à %H:%i:%s') as DATETIME_FR FROM posts WHERE userId=" +
      userId +
      " OR shared_userId=" +
      userId +
      " ORDER BY date_send DESC",
    (err, results) => {
      if (err) {
        throw err;
      } else {
        res.status(200).json(results);
      }
    }
  );
}; // ------------> Fin afficher mes posts

//-4/----- Supprimer un post ///////////
exports.deletePost = (req, res, next) => {
  db.query(
    "SELECT * FROM posts WHERE postId=?",
    [req.params.id],
    (err, results) => {
      if (err) {
        throw err;
      } else {
     
// A-  Supprimer l'image du dossier si le post a une image
        if (results[0].image && results[0].shared == 0) {
          let image = results[0].image;
          fs.unlink("./images/" + image, (err) => {
            if (err) {
              throw err;
            } 
          });
        }else {
          console.log ("Pas d'image à supprimer")
        }
// B/-  Supprimer le post de la Bdd
        db.query(
          "DELETE FROM posts WHERE postId=?",
          [req.params.id],
          (err, results) => {
            if (err) {
              throw err;
            }
          }
        );
      res.status(200).json({ message: "Publication supprimée avec succès !"});
      }
    }
  );
}; //----------- Fin supprimer un post

//  5/- ------- Modifier un post -------- ////////
exports.updatePost = (req, res, next) => {
  
  //A-  Si photo + texte
  if (req.file && req.body.textModified) {
    const image = req.file.filename;
    const post = req.body.textModified;
    const postId = req.params.id;

    // Chercher l'ancienne image de la bdd
    db.query(`SELECT * FROM posts WHERE postId=${postId}`, (err, results) => {
      if (err) {
        throw err;
      } else {
        if (results[0].image) {
         
      
    // Modifier la publication ( texte + photo) dans la Bdd
        let sql1 = `UPDATE posts SET post="${post}", image="${image}" WHERE postId=${postId}`;
        db.query(sql1, (err, results) => {
          if (err) {
            throw err;
          }
        });

        // si le post n'est pas partagé,
        // on supprime le fichier dans le dossier image

        if (results[0].shared_number == 0) {
          const imageToDelete = results[0].image;
          fs.unlink("./images/" + imageToDelete, (err) => {
            if (err) {
              throw err;
            }
          });
        }
      }
      }
    });
  
    // B- Si modifier uniquement la photo
  } else if (req.file && !req.body.textModified) {
    const image = req.file.filename;
    const postId = req.params.id;

    // Chercher l'ancienne image de la bdd
    db.query(`SELECT * FROM posts WHERE postId=${postId}`, (err, results) => {
      if (err) {
        throw err;
      } else {
        if (results[0].image) {
          
        // si le post n'est pas partagé,
        // on supprime le fichier dans le dossier image
        if (results[0].shared_number == 0) {
          const imageToDelete = results[0].image;
          fs.unlink("./images/" + imageToDelete, (err) => {
            if (err) {
              throw err;
            }
          });
        } 
      }
      }
    });

    // Modifier la photo dans la Bdd
    let sql2 = `UPDATE posts SET image="${image}" WHERE postId=${postId}`;
    db.query(sql2, (err, results) => {
      if (err) {
        throw err;
      }
    });

// C/--- Modifier uniquement le texte
  } else {
    let post = req.body.textModified;
    let postId = req.params.id;
    let sql3 = `UPDATE posts SET post="${post}" WHERE postId=${postId}`;

    // Modifier le texte dans la Bdd
    db.query(sql3, (err, results) => {
      if (err) {
        throw err;
      }
    });
    
  }
// D/ Envoyer le nouveau tableau des publications
db.query(
  "SELECT *, DATE_FORMAT (date_send, '%d/%m/%Y à %H:%i:%s') as DATETIME_FR FROM posts ORDER BY date_send DESC",
  (err, results) => {
    
    if (err) {
      res.status(500).json({message:"Erreur dans la base de données"}, results);
    } else {
      res.status(200).json(results);
    }
  }
);
//
}; //----- Fin modifier un post

//--6/----------- Partager un post

exports.sharePost = (req, res) => {
  delete req.body.publication1.date_send;
  delete req.body.publication1.postId;

  // Incrémenter le nombre de partage
  req.body.publication1.shared_number += 1;
  req.body.publication1.shared_date = req.body.publication1.DATETIME_FR;
  delete req.body.publication1.DATETIME_FR;
  const post = { ...req.body.publication1, ...req.body.publication2 };
 
  // Remettre le compteur des commentaire à 0
  Object.defineProperty(post, "commentNumber", {
    value: 0,
  }),
  
  // Ajouter la publication partagée dans la bdd
  db.query("insert into posts set ?", [post], (err, results) => {
    if (err) {
      throw err;
    }
  });
}; //---------- Fin partager un post
