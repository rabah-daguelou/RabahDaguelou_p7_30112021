const express       = require("express");
const bcrypt        = require("bcrypt");
const mysql         = require("mysql2");
const multer        = require("multer");
const cors          = require("cors");
const fs            = require("fs");
const jwt           = require("jsonwebtoken");
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

//  1/---------- S'inscrire
exports.signup = (req, res, next) => {
  console.log(req.body);

  // Hacher le mot de passe
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = {
      email: req.body.email,
      password: hash,
      name: req.body.name,
    };

    db.query(
      "SELECT * FROM Users WHERE email = ? ",
      req.body.email,
      function (err, data) {
        if (err) {
          console.log("Erreur Bdd !");
        } else {
          if (parseInt(data.length) > 0) {
            res.status(200).json({
              type: "error",
              message: "Cette adresse mail est déjà utilisée !",
            });
      // Enregistrer le nouveau user dans la Bdd
          } else {
            db.query("INSERT INTO Users SET ?", [user], (err, results) => {
              if (err) {
                throw err;
              } else {
                res.status(200).json(results.data);
              }
            });
          }
        }
      }
    );
  });
};
//--2/ --------- Se connecter

exports.login = (req, res) => {
  db.query(
    "SELECT * FROM users WHERE email=?",
    [req.body.email],

    function (err, data) {
      if (err) {
        res.status(500).json({ error: " Erreur serveur Bdd!" });
      } else {
        // Si l'utilisateur n'est pas trouvé dans la base de données
        if (data.length < 1) {
          res
            .status(200)
            .json({ type: "error", message: "Utilisateur introuvable!" });
        } else {
          // Si l'utilisateur est trouvé dans la base de données
          // Comparer le mot de passe
          bcrypt.compare(req.body.password, data[0].password).then((valid) => {
            if (!valid) {
              res.status(200).json({
                type: "error",
                message: "Ce mot de passe est incorrect !",
                passwordForgot:true
              });
              // Si le mot de passe est valide, on renvoie un token au backend
            } else {
              res.status(200).json({
                userId: data[0].userId,
                isAdmin: data[0].isAdmin,
                name: data[0].name,
                profil_picture: data[0].profil_picture,

                token: jwt.sign(
                  { userId: data[0].userId },
                  process.env.secretToken,
                  { expiresIn: "1h" }
                ),
              });
            }
          });
        }
      }
    }
  );
};

///--3/ --------- Afficher l'utilisateur connecté
exports.getUserConnected = (req, res) => {
  let sql = `SELECT * FROM users WHERE userId=${req.params.id}`;
  db.query(sql, (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Erreur de connexion à la base de donnée:", results });
    } else {
      res.status(200).json(results);
    }
  });
};

// -- 4/--- Afficher tous les utilisateurs
exports.getAllUsers = (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      res.status(401).json(err);
    } else {
      res.status(200).json(results);
    }
  });
};

// --5/---- Afficher le profil d'un utilisateur
exports.getOneUser = (req, res) => {
  let userId = req.params.id;
  db.query("SELECT * FROM Users where userId=?", [userId], (err, results) => {
    if (err) {
      res.status(500).json(results);
    } else {
      res.status(200).json(results);
    }
  });
};

//----------- Supprimer le profil d'un utilisateur ----

// Première solution
// Supression du compte, de la photo du profil,
// des publications et des commentaires du user
/*
exports.deleteOneUser = (req, res) => {
  console.log(req.params.id);

  let id = req.params.id;
  // Supprimer la photo du user du dossier images
  db.query(
    "SELECT profil_picture FROM users WHERE userId=?",
    [id],
    (err, results) => {
      if (err){
        console.log ("Erreur Bdd:", err)
      } else {
      console.log("Ancienne profil_picture:", results[0].profil_picture);
      let profil_picture = results[0].profil_picture;

      if (profil_picture != "icon.png") {
        fs.unlink("./images/" + profil_picture, (err) => {
          if (err) {
            console.log("L'image n'est pas supprimée: " + err);
          } else {
            console.log("L'image est supprimée avec succès!");
          }
        });
      }
    }
      //   Supprimer le user de la bdd
      db.query("DELETE FROM users WHERE userId=?", [id], (err, results) => {
        // res.json(results);
        console.log(" User supprimé! ");
      });
      // Supprimer les publications du user supprimé

      let sql = `DELETE FROM posts WHERE userId=${id}`;

      db.query(sql, (err, results) => {
        if (err){
          console.log( " Les publications n'ont pas été supprimées!", err)
        //  res.status(401).json({message:" Les publications n'ont pas été supprimées!"}) 
        }else {
          console.log (" Les publications ont été supprimées avec succès!")
          //res.status(200).json({message:" Les publications ont été supprimées avec succès!"}) 
        }
        
      });
      // Supprimer les commentaires du user supprimé
      let sql2 = `DELETE FROM comments WHERE userId=${id}`;
      db.query(sql2, (err, results) => {
        if (err){
          console.log (" Les commentaires n'ont pas été supprimés!")
          res.status(401).json({message:" Les commentaires n'ont pas été supprimés!"}) 
        } else {
          console.log (" Les commentaires ont été supprimés avec succès!")
          res.status(200).json({message:" Les commentaires ont été supprimés avec succès!"}) 
        }
        
      });
    }
  );
};
*/
// Deuxième solution pour la suppression d'un compte user

exports.deleteOneUser = (req, res) => {
  let id = req.params.id;

  // Remplacer la photo du user dans la table users par le logo
  let sql1 = `UPDATE users SET profil_picture="icon.png" WHERE userId=${id}`;

  db.query(sql1, (err, results) => {
    if (err) {
      throw err;
    }
  });

  // Remplacer la photo du user dans la table posts par le logo
  let sql5 = `UPDATE posts SET profil_picture="icon.png" WHERE userId=${id}`;

  db.query(sql5, (err, results) => {
    if (err) {
      throw err;
    }
  });

  // Remplacer la photo du user dans la table comments par le logo
  let sql6 = `UPDATE comments SET profil_picture="icon.png" WHERE userId=${id}`;

  db.query(sql6, (err, results) => {
    if (err) {
      throw err;
    }
  });

  // Suppression de l'ancienne photo du user dans le dossier image
  db.query(
    "SELECT profil_picture FROM users WHERE userId=?",
    [id],
    (err, results) => {
      if (err) {
        throw err;
      } else {
        console.log("Ancienne profil_picture:", results[0].profil_picture);
        let profil_picture = results[0].profil_picture;
        if (profil_picture != "icon.png") {
          fs.unlink("./images/" + profil_picture, (err) => {
            if (err) {
              throw err
            } else {
              res.status(200).json(res);
            }
          });
        }
      }
    }
  );

  // Modifier l'email dans la bdd ( grouopomaniaid@groupomania.fr)
  let sql = `UPDATE users SET email='groupomania${id}@groupomania.fr' WHERE userId=${id}`;
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
  });

  // Modifier le pseudo dans la bdd ( grouopomaniaid)
  let sql2 = `UPDATE users SET name='Groupomania${id}' WHERE userId=${id}`;
  db.query(sql2, (err, results) => {
    if (err) {
      throw err;
    }
  });

  // Modifier userDeleted dans la table users
  let sqll = `UPDATE users SET isDeleted='1' WHERE userId=${id}`;
  db.query(sqll, (err, results) => {
    if (err) {
      throw err;
    }
  });

  // Modifier le user_send dans la table posts
  let sql3 = `UPDATE posts SET user_send='Groupomania${id}' WHERE userId=${id}`;
  db.query(sql3, (err, results) => {
    if (err) {
      throw err;
    }
  });
 
  // Modifier le user_send dans la table comments
  let sql4 = `UPDATE comments SET user_send='Groupomania${id}' WHERE userId=${id}`;
  db.query(sql4, (err, results) => {
    if (err) {
      throw err;
    }
  });
  res.status(201).json({
    message:
      "Toutes les modifications ont été apportées sur la suppression du compte",
  });
};

//-- 6/ -------- Modifier la photo du profil
exports.modifyProfilPicture = (req, res) => {
  let image = req.file.filename;
  let id = req.params.id;
  res.status(200).json({ image: image });

  // A- Chercher la photo à modifier dans la bdd
  db.query(
    "SELECT profil_picture FROM users WHERE userId=?",
    [id],
    (err, results) => {
      if (err) {
        throw err;
      } else {
        let profil_picture = results[0].profil_picture;

// B- Supprimer l'ancienne profil_picture du dossier images
         if (profil_picture != "icon.png") {
        fs.unlink("./images/" + profil_picture, (err) => {
          if (err) {
            throw err;
          }
        });
      }
      }
    }
  );
// C- Mettre à jour la photo du profil dans la table users
  let sql1 = `UPDATE users SET profil_picture="${image}" WHERE userId=${id}`;
  
  db.query(sql1, (err, results) => {
    if (err) {
      throw err;
    }
  });

// D- Mettre à jour profil_picture dans la table posts
  let sql2 = `UPDATE posts SET profil_picture="${image}" WHERE userId=${id}`;

  db.query(sql2, (err, results) => {
    if (err) {
      throw err;
    }
  });

// E- Mettre à jour shared_userProfil_picture dans la table posts
  let sql5 = `UPDATE posts SET shared_userProfil_picture="${image}" WHERE userId=${id}`;

  db.query(sql5, (err, results) => {
    if (err) {
      throw err;
    }
  });

// F- Mettre à jour la photo du profil dans la table comments
  let sql3 = `UPDATE comments SET profil_picture="${image}" WHERE userId=${id}`;

  db.query(sql3, (err, results) => {
    if (err) {
      throw err;
    }
  });
};

//-- 7/ --- Modifier l'email

exports.updateEmail = (req, res, next) => {
  let email = req.body.email;
  let id = req.params.id;

  let sql = `UPDATE users SET email="${email}" WHERE userId=${id}`;
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    } else {
      res
        .status(201)
        .json({ message: "Votre email a été modifié avec succès!" });
    }
  });
};

// 8/---  Modifier le mot de passe  //////
exports.updatePassword = (req, res, next) => {
  
  //A- Hacher le nouveau mot de passe
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const newPassword = hash;
    
  //B- Vérifier l'ancien mot de passe dans la bdd
    let sql = `SELECT password FROM users WHERE userId=${req.params.id}`;
    db.query(sql, (err, results) => {
      if (err) {
        throw err;
      } else {
        // si pas de mot de passe correspondant
        if (!results) {
          console.log("User introuvable dans la bdd !");
        } else {
          // Si mot de passe trouvé
          bcrypt
            .compare(req.body.password1, results[0].password)
            .then((valid) => {
              // Si l'ancien mot de passe invalide
              if (!valid) {
                res.status(200).json({
                  type: "error",
                  message: "L'ancien mot de passe est incorrect !",
                });
    // Si l'ancien mot de passe est valide
// C- Modifier le mot de passe dans la bdd
              } else {
                let sql = `UPDATE users SET password='${newPassword}' WHERE userId=${req.params.id}`;
                db.query(sql, (err, results) => {
                  if (err) {
                    console.log("Erreur BDD:", err);
                  } else {
                    res.status(201).json({
                      message: " Votre mot de passe a été modifié avec succès!",
                    });
                  }
                });
              }
            });
        }
      }
    });
  });
};

// 9/------- Modifier le pseudo
exports.updateName = (req, res, next) => {
  
  // A- Modifier le pseudo dans la table users
  let sql = `UPDATE users SET name='${req.body.name}' WHERE userId=${req.params.id}`;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(200).json({
        type: "error",
        message: " Erreur Bdd !",
      });
    } else {
      res.status(201).json({
        message: " Votre pseudo a été modifié avec succès!",
      });
    }
  });

  // B- Modifier le pseudo dans la table posts
  let sql2 = `UPDATE posts SET user_send='${req.body.name}' WHERE userId=${req.params.id}`;
  db.query(sql2, (err, results) => {
    if (err) {
      throw err;
    }
  });

  // C- Modifier le pseudo dans la table comments
  let sql3 = `UPDATE comments SET user_send='${req.body.name}' WHERE userId=${req.params.id}`;
  db.query(sql3, (err, results) => {
    if (err) {
      throw err;
    }
  });
};

////////////////////////////
