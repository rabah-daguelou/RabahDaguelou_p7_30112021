const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const jwt = require("jsonwebtoken");
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

// Publier un post ///

exports.createPost = (req, res, next) => {
  console.log(" req.body:", req.body);
 
  // Si uniquement texte
  if (!req.file) {
    const post = {
      post: req.body.post,
      user_send: req.body.user_send,
      userId: req.body.userId,
      profil_picture: req.body.profil_picture,
    };
    console.log(post);

    db.query("INSERT INTO Posts SET ?", [post], (err, results) => {
      if (err) {
        console.log("Erreur Bdd:", err);
        // results(err, null);
      } else {
        res.json(results);
        console.log("Post enregistré en Bdd !");
        // results(null, results);
      }
    });
  }

  // Si texte + image
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
        console.log("Erreur Bdd", err);
      } else {
        res.json(results);
        console.log("Post enregistré dans la Bdd");
      }
    });
  }
};

///////// Afficher tous les posts //////

exports.getAllPosts = (req, res, next) => {
  // db.query("SELECT * FROM posts ORDER BY date_send DESC", (err, results) => {
  db.query(
    "SELECT *, DATE_FORMAT (date_send, '%d/%m/%Y à %H:%i:%s') as DATETIME_FR FROM posts ORDER BY date_send DESC",
    (err, results) => {
      res.json(results);
      if (err) {
        console.log("Erreur Bdd !");
      } else {
        console.log(" Toutes les publicatiions seront affichées avec succès !");
      }
    }
  );
};

///////// Afficher mes posts ( sur le profil de l'utilisateur)//////

exports.getAllMyPosts = (req, res, next) => {
  let userId = req.params.id;
  console.log("userId:", userId);
  db.query(
    "SELECT * FROM posts WHERE userId=" + userId + " ORDER BY date_send DESC ",
    (err, results) => {
      if (err) {
        console.log("Erreur Bdd !");
      } else {
        res.json(results);
        //  console.log ( " Mes publications:", results);
      }
    }
  );
};

///////// Supprimer un post ///////////
exports.deletePost = (req, res, next) => {
  console.log(" Token:", req.headers);
  console.log("postId à supprimer:", req.params.id);
  db.query(
    "SELECT image FROM posts WHERE postId=?",
    [req.params.id],
    (err, results) => {
      res.json(results);
      console.log(results);

      // Supprimer l'image du dossier si le post a une image
     // if (results !== []) {
      if (results[0].image && results[0].shared==0) {

        let image = results[0].image;
        fs.unlink("./images/" + image, (err) => {
          if (err) {
            console.log("L'image n'est pas supprimée: " + err);
          } else {
            console.log("L'image est supprimée avec succès!");
          }
        });
      }
      //

      db.query(
        "DELETE FROM posts WHERE postId=?",
        [req.params.id],
        (err, results) => {
          console.log(" Le post a été supprimé de la Bdd ! ");
        }
      );
    }
  );
};

///// ------- Modifier un post -------- ////////

exports.updatePost = (req, res, next) => {
  //1------  Si photo + texte
  if (req.file && req.body.textModified) {
    let image = req.file.filename;
    let post = req.body.textModified;
    let postId = req.params.id;
    let sql = `UPDATE posts SET post="${post}", image="${image}" WHERE postId=${postId}`;
    console.log("image:", image);
    console.log("texte:", post);
    console.log("postId:", postId);

/*    

db.query(
      `SELECT image FROM posts WHERE postId=${postId}`,
      (err, results) => {
        //res.json(results);
        if (err) {
          console.log("Erreur Bdd:", err);
        } else {
          console.log("Ancienne photo: ", results[0].image);
          const imageToDelete= results[0].image
        }
    });/* Ajout
*/



// Chercher l'ancienne photo du post de la Bdd et
    // Supprimer le fichier dans images
/*   
    db.query(
      `SELECT image FROM posts WHERE postId=${postId}`,
      (err, results) => {
        //res.json(results);
        if (err) {
          console.log("Erreur Bdd:", err);
        } else {
          console.log("Ancienne photo: ", results);
          fs.unlink("./images/" + results[0].image, (err) => {
            if (err) {
              console.log("L'image n'est pas supprimée: " + err);
            } else {
              console.log("L'image est supprimée avec succès!");
            }
          });
        }
      }
    );
*/
    // Modifier le post dans la Bdd
    db.query(sql, (err, results) => {
      if (err) {
        console.log("Erreur Bdd:", err);
      } else {
        console.log(" Post modifié dans la Bdd aevc succès !", results);
      }
    });

/* Ajout ---- 
fs.unlink("./images/" + imageToDelete, (err) => {
            if (err) {
              console.log("L'image n'est pas supprimée: " + err);
            } else {
              console.log("L'image est supprimée avec succès!");
            }
          });

*/
/* ----  Fin ajout ------- */

    // 2--- Modifier uniquement la photo
  } else if (req.file && !req.body.textModified) {
    let image = req.file.filename;
    let postId = req.params.id;
    let sql = `UPDATE posts SET image="${image}" WHERE postId=${postId}`;

    // Chercher la photo du post de la Bdd et
    // Supprimer le fichier dans images
/*
    db.query(
      `SELECT image FROM posts WHERE postId=${postId}`,
      (err, results) => {
        res.json(results);
        if (err) {
          console.log("Erreur Bdd:", err);
        } else {
          console.log("résultats: ", results);
          fs.unlink("./images/" + results[0].image, (err) => {
            if (err) {
              console.log("L'image n'est pas supprimée: " + err);
            } else {
              console.log("L'image est supprimée avec succès!");
            }
          });
        }
      }
    );
*/
    // Modifier la photo dans la Bdd
    db.query(sql, (err, results) => {
      if (err) {
        console.log("Erreur Bdd:", err);
      } else {
        console.log(" Photo modifiée dans la Bdd aevc succès !");
      }
    });
  
    // 3---- Modifier uniquement le texte
  } else {
    let post = req.body.textModified;
    let postId = req.params.id;
    let sql = `UPDATE posts SET post="${post}" WHERE postId=${postId}`;

    // Modifier le texte dans la Bdd
    db.query(sql, (err, results) => {
      if (err) {
        console.log("Erreur Bdd:", err);
      } else {
        console.log(" Texte modifié dans la Bdd aevc succès !");
      }
    });
  }
};

// Partager un post 

exports.sharePost=(req, res,next) => {
   
  delete req.body.publication1.date_send
  delete req.body.publication1.postId
  req.body.publication1.shared_number+=1
  
  req.body.publication1.shared_date=req.body.publication1.DATETIME_FR
  delete req.body.publication1.DATETIME_FR
  req.body.publication1.commentNumber=0
  const post= {...req.body.publication1 ,...req.body.publication2 }
  console.log ("date de publication:", post.shared_date)
  //console.log ("nouvelle publication:", post)
 db.query ("insert into posts set ?", [post], (err, results)=> {
    if (err) {
      console.log ( "Erreur Bdd:", err)
    } else {
      console.log ("Post partagé avec succès!")
    }
  })
  
};
