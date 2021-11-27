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

// ---- Aimer un post ----------//

exports.likePost = (req, res, next) => {
  const postId = req.body.postId;
  const userId = req.body.userId;

  console.log ("Le user:", userId, "veut liker le post", postId);
// chercher dans la table likes_deslikes si le user a déjà liké ou desliké le post
  let sql = "SELECT * FROM likes_deslikes WHERE postId=" + postId + " AND userId=" + userId;
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Erreur Bdd", err);
      res.status(500).json({ message: "Erreur Base de donnée!" });
    } else {
  
//1/   Si le user n'a jamais liké /desliké le post. Il n'existe pas dans la bdd pour le postId          
        if (results.length == 0) {
          console.log("Le user ", userId, "n'a ni liké ni desliké le post ", postId );
      //a/ Enregistrer le user avec le post dans la table likes_deslikes avec user_status=1
        sql = " INSERT INTO likes_deslikes SET postId= " + postId + ", userId= " + userId + ", user_status=1";
        db.query(sql, (err, results) => {
          if (err) {
            console.log("Erreur Bdd", err);
          //  res.status(500).json({ message: "Erreur Base de donnée!" });
          } else {
            console.log( " Le user:", userId, "est enregistré dans la base de donnée likes_deslikes avec un status 1 pour le post:", postId );
           //res.status(200).json({ message: "Le user:"+ userId+ "est enregistré dans la base de donnée likes_deslikes avec un status 1 pour le post:" + postId });
          };
        });
      //b/ Incrémenter le nombre de likes du post dans la bdd posts
          sql = "UPDATE posts SET likes_number=likes_number+1 WHERE postId=" + postId;
          db.query(sql, (err, results) => {
            if (err) {
              console.log("Erreur Bdd", err);
              res.status(501).json({ message: "Erreur Base de donnée!" });
            } else {
              console.log( "Le nombre de likes est incrémenté dans posts pour le post: ", postId);
              res.status(201).json({ status: 1 });
          };
          });
         
        } 

//2/    // Si le user existe déjà dans la table likes-deslikes     
        else {
          console.log("Le user ", userId, "existe dans la table likes_deslikes pour le postId: ", postId );
          console.log ("status:", results[0].user_status)

    //A/  Si le userId n'a ni liké ni desliké le postId (status:0)  
          if (results[0].user_status==0){
            console.log( "Le user: ", userId, " n'a ni liké ni desliké le post: ", postId );
            // a/Incrémeter le status de userId (1)
            sql= "UPDATE likes_deslikes SET user_status=1 WHERE userId="+userId+" AND postId="+ postId;
            db.query(sql, (err, results) => {
              if (err) {
                console.log("Erreur Bdd", err);
               // res.status(500).json({ message: "Erreur Base de donnée!" });
              } else {
                console.log ("Le status de userId est passé à 1 (liké !) pour le post: ", postId);
               // res.status(200).json({ message: "Le status de userId est passé à 1 (liké !) pour le post: " });
              };
            });

            // b/ Incrémenter le nombre de likes dans la table posts
            sql= "UPDATE posts SET likes_number=likes_number+1 WHERE postId="+ postId;
            db.query(sql, (err, results) => {
              if (err) {
                console.log("Erreur Bdd", err);
                res.status(501).json({ message: "Erreur Base de donnée!" });
              } else {
                console.log ("Le nombre de likes est incrémenté dans la table posts pour le post ", postId);
                res.status(201).json({ message: "Le nombre de likes est incrémenté dans la table posts" });  
             };
            });
                                                                                      
            // -------- Fin cas user_status = 0  ------------- //

   // B/   Si le userId a déjà liké le postId (user_status=1)
          } else if (results[0].user_status==1){
            console.log( "Le user: ", userId, " a déjà liké le post: ", postId );
           
            // a/ Remettre le user_status dans la table likes_deslikes à 0
            sql= "UPDATE likes_deslikes SET user_status=0 WHERE userId="+userId+" AND postId="+ postId;
            db.query(sql, (err, results) => {
              if (err) {
                console.log("Erreur Bdd", err);
               // res.status(500).json({ message: "Erreur Base de donnée!" });
              } else {
                console.log ("Le status de userId: ", userId, " est passé à 0 (ni liké ni desliké !) pour le post: ", postId);
               // res.status(200).json({ message: "Le nombre de deslikes est décrémenté dans la table posts" });
              };
            });

            // b/ Décrémenter le nombre de likes pour le postId dans la table posts
            sql= "UPDATE posts SET likes_number=likes_number-1 WHERE postId="+postId;
            db.query(sql, (err, results) => {
              if (err) {
                console.log("Erreur Bdd", err);
                res.status(501).json({ message: "Erreur Base de donnée!" });
              } else {
                console.log ("Le nombre de likes est décrémenté dans la table posts pour le post ", postId);
                res.status(201).json({ message: "Le nombre de likes est décrémenté dans la table posts pour le post "+ postId});
              };
            });
            
            
   // C/    Si le userId a déjà desliké le postId (user_status=-1)
          } else {
            console.log( "Le user: ", userId, " a déjà desliké le post: ", postId );  
            
            //a/ ---- Mettre user_status à 1 ---- //
            sql= "UPDATE likes_deslikes SET user_status=1 WHERE userId="+userId+" AND postId="+ postId;
            db.query(sql, (err, results) => {
              if (err) {
                console.log("Erreur Bdd", err);
              //  res.status(500).json({ message: "Erreur Base de donnée!" });
              } else {
                console.log ("Le status de userId est passé à 1 ( like  !) pour le post");
              //  res.status(200).json({ message: "Le status de userId est passé à 1 (liké !) pour le post: " });
              };
            });

            //b/ ------Décrémenter le nombre de deslikes dans la table posts
            sql= "UPDATE posts SET deslikes_number=deslikes_number-1 WHERE postId="+ postId;
            db.query(sql, (err, results) => {
              if (err) {
                console.log("Erreur Bdd", err);
              //  res.status(501).json({ message: "Erreur Base de donnée!" });
              } else {
                console.log ("Le nombre de deslikes est décrémenté dans la table posts pour le post ", postId);
              //  res.status(201).json({ message: "Le nombre de deslikes est décrémenté dans la table posts" });
              };
            });
            //Incrémenter le nombre de likes du post dans la bdd posts
          sql = "UPDATE posts SET likes_number=likes_number+1 WHERE postId=" + postId;
          db.query(sql, (err, results) => {
            if (err) {
              console.log("Erreur Bdd", err);
              res.status(502).json({ message: "Erreur Base de donnée!" });
            } else {
              console.log( "Le nombre de likes est incrémenté dans posts pour le post: ", postId);
              res.status(202).json({ message: "Le nombre de likes est incrémenté dans posts pour le post: "+ postId});
            };
          });
         
          }
        }
    }
  });
};


// ---- Desliker un post ----------//

exports.deslikePost = (req, res, next) => {
  const postId = req.body.postId;
  const userId = req.body.userId;
  console.log ("Le user:", userId, "veut desliker le post", postId);

  // chercher dans la table likes_deslikes si le user a déjà liké ou desliké le post
  let sql = "SELECT * FROM likes_deslikes WHERE postId=" + postId + " AND userId=" + userId;
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Erreur Bdd", err);
      res.status(500).json({ message: "Erreur Base de donnée!" });
    } else {
  
  //1/ Si le user n'a jamais liké /desliké le post. Il n'existe pas dans la bdd pour le postId          
        if (results.length == 0) {
          console.log("Le user ", userId, "n'a ni liké ni desliké le post ", postId );
      //a/ Enregistrer le user dans la table likes_deslikes avec user_status=-1
          sql = " INSERT INTO likes_deslikes SET postId= " + postId + ", userId= " + userId + ", user_status=-1";
          db.query(sql, (err, results) => {
            if (err) {
            console.log("Erreur Bdd", err);
          //  res.status(500).json({ message: "Erreur Base de donnée!" });
          } else {
            console.log( " Le user:", userId, "est enregistré dans la base de donnée likes_deslikes avec un status -1 pour le post:", postId );
          //  res.status(200).json({ message: " Le user:"+ userId + "est enregistré dans la base de donnée likes_deslikes avec un status -1 pour le post:" + postId });  
          };
        });
              
      //b/ Incrémenter le nombre de deslikes du post dans la bdd posts
          sql = "UPDATE posts SET deslikes_number=deslikes_number+1 WHERE postId=" + postId;
          db.query(sql, (err, results) => {
            if (err) {
              console.log("Erreur Bdd", err);
              res.status(501).json({ message: "Erreur Base de donnée!" });
            } else {
              console.log( "Le nombre de deslikes est incrémenté dans posts pour le post: ", postId);
              res.status(201).json({ message: "Le user:"+ userId+ "est enregistré dans la base de donnée likes_deslikes avec un status -1 pour le post:" + postId });  
            };
          }); 
        
        } 
         
        //2/  // Si le user existe déjà dans la table likes-deslikes     
        else {
          console.log("Le user ", userId, "existe dans la table likes_deslikes pour le postId: ", postId );
          console.log ("status:", results[0].user_status)

  // A/   Si le userId n'a ni liké ni desliké le postId (status:0)  
          if (results[0].user_status==0){
            console.log( "Le user: ", userId, " n'a ni liké ni desliké le post: ", postId );
          // a/ Mettre le status de userId (-1)
            sql= "UPDATE likes_deslikes SET user_status=-1 WHERE userId="+userId+" AND postId="+ postId;
            db.query(sql, (err, results) => {
              if (err) {
                console.log("Erreur Bdd", err);
              //  res.status(500).json({ message: "Erreur Base de donnée!" });
              } else {
                console.log ("Le status de userId est passé à -1 (desliké !) pour le post");
              //  res.status(200).json({ message: "Le status de userId est passé à -1 (desliké !) pour le post: " });
              };
            });

          // b/ Incrémenter le nombre de deslikes dans la table posts
            sql= "UPDATE posts SET deslikes_number=deslikes_number+1 WHERE postId="+ postId;
            db.query(sql, (err, results) => {
              if (err) {
                console.log("Erreur Bdd", err);
                res.status(501).json({ message: "Erreur Base de donnée!" });
              } else {
                console.log ("Le nombre de deslikes est incrémenté dans la table posts pour le post ", postId);
                res.status(201).json({ message: "Le nombre de deslikes est incrémenté dans la table posts" });                                                                              
              }; 
              
            });

           
            // -------- Fin cas user_status = 0  ------------- //
            
            // -------- Début user_status = 1 ------------//
 // B/    Si le userId a déjà liké le postId (user_status=1)
          } else if (results[0].user_status==1){
            console.log( "Le user: ", userId, " a déjà liké le post: ", postId );
            
      // a/ Mettre le user_status à -1
            sql= "UPDATE likes_deslikes SET user_status=-1 WHERE userId="+userId+" AND postId="+ postId;
            db.query(sql, (err, results) => {
              if (err) {
                console.log("Erreur Bdd", err);
                //res.status(500).json({ message: "Erreur Base de donnée!" });
              } else {
                console.log ("Le status de userId: ", userId, " est passé à -1 ( desliké !) pour le post: ", postId);
                //res.status(200).json({ message: "Le status de userId: " +userId+ " est passé à -1 ( desliké !) pour le post: "+ postId});
              };
            });

      // b/ Décrémenter le nombre de likes pour le postId dans la table posts
            sql= "UPDATE posts SET likes_number=likes_number-1 WHERE postId="+postId;
            db.query(sql, (err, results) => {
              if (err) {
                console.log("Erreur Bdd", err);
                //res.status(501).json({ message: "Erreur Base de donnée!" });
              } else {
                console.log ("Le nombre de likes est décrémenté dans la table posts pour le post ", postId);
                //res.status(201).json({ message: "Le nombre de likes est décrémenté dans la table posts pour le post "+ postId});
              };
            });

      // c/ Incrémenter le nombre de deslikes dans la table posts
            sql= "UPDATE posts SET deslikes_number=deslikes_number+1 WHERE postId="+ postId;
            db.query(sql, (err, results) => {
              if (err) {
                console.log("Erreur Bdd", err);
                res.status(502).json({ message: "Erreur Base de donnée!" });
              } else {
                console.log ("Le nombre de deslikes est incrémenté dans la table posts pour le post ", postId);
                res.status(202).json({ message: "Le nombre de deslikes est incrémenté dans la table posts" });
            };
            }); 
            
  // C/ Si le userId a déjà desliké le postId (user_status=-1)
          } else {
            console.log( "Le user: ", userId, " a déjà desliké le post: ", postId );  
            
            //a/ ---- Remettre le user_status à 0 ---- //
            sql= "UPDATE likes_deslikes SET user_status=0 WHERE userId="+userId+" AND postId="+ postId;
            db.query(sql, (err, results) => {
              if (err) {
                console.log("Erreur Bdd", err);
              //  res.status(500).json({ message: "Erreur Base de donnée!" });
              } else {
                console.log ("Le status de userId est passé à 0 (Ni like ni deslike !) pour le post");
              // res.status(200).json({ message: "Le status de userId est passé à 0 (ni liké ni desliké !) pour le post: " });
              };
            });

            //b/ -------Décrémenter le nombre de deslikes dans la table posts
            sql= "UPDATE posts SET deslikes_number=deslikes_number-1 WHERE postId="+ postId;
            db.query(sql, (err, results) => {
              if (err) {
                console.log("Erreur Bdd", err);
                res.status(501).json({ message: "Erreur Base de donnée!" });
              } else {
                console.log ("Le nombre de deslikes est décrémenté dans la table posts pour le post ", postId);
                res.status(201).json({ message: "Le nombre de deslikes est décrémenté dans la table posts" });
              };
            });
            
          }
        }
    }
  });
};



