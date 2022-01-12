const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const fs = require("fs");
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

//1/ ---- Aimer un post ----------//
exports.likePost = (req, res, next) => {
  const postId = req.body.postId;
  const userId = req.body.userId;

  // chercher dans la table likes_deslikes si le user a déjà liké ou desliké le post
  let sql =
    "SELECT * FROM likes_deslikes WHERE postId=" +
    postId +
    " AND userId=" +
    userId;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ message: "Erreur Base de donnée!" });
    } else {
      //1/   Si le user n'a jamais liké /desliké le post. Il n'existe pas dans la bdd pour le postId
      if (results.length == 0) {
        //a/ Enregistrer le user avec le post dans la table likes_deslikes avec user_status=1
        sql =
          " INSERT INTO likes_deslikes SET postId= " +
          postId +
          ", userId= " +
          userId +
          ", user_status=1";
        db.query(sql, (err, results) => {
          if (err) {
            throw err;
          }
        });

        //b/ Incrémenter le nombre de likes du post dans la bdd posts
        sql =
          "UPDATE posts SET likes_number=likes_number+1 WHERE postId=" + postId;
        db.query(sql, (err, results) => {
          if (err) {
            res.status(501).json({ message: "Erreur Base de donnée!" });
          } else {
            res.status(201).json({ status: 1 });
          }
        });
      }

      //2/    // Si le user existe déjà dans la table likes-deslikes
      else {
        //A/  Si le userId n'a ni liké ni desliké le postId (status:0)
        if (results[0].user_status == 0) {
          // a/Incrémeter le status de userId (1)
          sql =
            "UPDATE likes_deslikes SET user_status=1 WHERE userId=" +
            userId +
            " AND postId=" +
            postId;
          db.query(sql, (err, results) => {
            if (err) {
              throw err;
            }
          });

          // b/ Incrémenter le nombre de likes dans la table posts
          sql =
            "UPDATE posts SET likes_number=likes_number+1 WHERE postId=" +
            postId;
          db.query(sql, (err, results) => {
            if (err) {
              res.status(501).json({ message: "Erreur Base de donnée!" });
            } else {
              res
                .status(201)
                .json({
                  message:
                    "Le nombre de likes est incrémenté dans la table posts",
                });
            }
          }); // -------- Fin cas user_status = 0

          // B/   Si le userId a déjà liké le postId (user_status=1)
        } else if (results[0].user_status == 1) {
          // a/ Remettre le user_status dans la table likes_deslikes à 0
          sql =
            "UPDATE likes_deslikes SET user_status=0 WHERE userId=" +
            userId +
            " AND postId=" +
            postId;
          db.query(sql, (err, results) => {
            if (err) {
              throw err;
            }
          });

          // b/ Décrémenter le nombre de likes pour le postId dans la table posts
          sql =
            "UPDATE posts SET likes_number=likes_number-1 WHERE postId=" +
            postId;
          db.query(sql, (err, results) => {
            if (err) {
              res.status(501).json({ message: "Erreur Base de donnée!" });
            } else {
              res.status(201).json({
                message:
                  "Le nombre de likes est décrémenté dans la table posts pour le post " +
                  postId,
              });
            }
          });

          // C/    Si le userId a déjà desliké le postId (user_status=-1)
        } else {
          //a/ ---- Mettre user_status à 1 ---- //
          sql =
            "UPDATE likes_deslikes SET user_status=1 WHERE userId=" +
            userId +
            " AND postId=" +
            postId;
          db.query(sql, (err, results) => {
            if (err) {
              throw err;
            }
          });

          //b/ ------Décrémenter le nombre de deslikes dans la table posts
          sql =
            "UPDATE posts SET deslikes_number=deslikes_number-1 WHERE postId=" +
            postId;
          db.query(sql, (err, results) => {
            if (err) {
              throw err;
            }
          });
          //Incrémenter le nombre de likes du post dans la bdd posts
          sql =
            "UPDATE posts SET likes_number=likes_number+1 WHERE postId=" +
            postId;
          db.query(sql, (err, results) => {
            if (err) {
              res.status(502).json({ message: "Erreur Base de donnée!" });
            } else {
              res.status(202).json({
                message:
                  "Le nombre de likes est incrémenté dans posts pour le post: " +
                  postId,
              });
            }
          });
        }
      }
    }
  });
};

// 2/ ---- Desliker un post ----------//

exports.deslikePost = (req, res, next) => {
  const postId = req.body.postId;
  const userId = req.body.userId;

  // chercher dans la table likes_deslikes si le user a déjà liké ou desliké le post
  let sql =
    "SELECT * FROM likes_deslikes WHERE postId=" +
    postId +
    " AND userId=" +
    userId;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ message: "Erreur Base de donnée!" });
    } else {
      //1/ Si le user n'a jamais liké /desliké le post. Il n'existe pas dans la bdd pour le postId
      if (results.length == 0) {
        //a/ Enregistrer le user dans la table likes_deslikes avec user_status=-1
        sql =
          " INSERT INTO likes_deslikes SET postId= " +
          postId +
          ", userId= " +
          userId +
          ", user_status=-1";
        db.query(sql, (err, results) => {
          if (err) {
            throw err;
          }
        });

        //b/ Incrémenter le nombre de deslikes du post dans la bdd posts
        sql =
          "UPDATE posts SET deslikes_number=deslikes_number+1 WHERE postId=" +
          postId;
        db.query(sql, (err, results) => {
          if (err) {
            res.status(501).json({ message: "Erreur Base de donnée!" });
          } else {
            res.status(201).json({
              message:
                "Le user:" +
                userId +
                "est enregistré dans la base de donnée likes_deslikes avec un status -1 pour le post:" +
                postId,
            });
          }
        });
      }

      //2/  // Si le user existe déjà dans la table likes-deslikes
      else {
        // A/   Si le userId n'a ni liké ni desliké le postId (status:0)
        if (results[0].user_status == 0) {
          // a/ Mettre le status de userId (-1)
          sql =
            "UPDATE likes_deslikes SET user_status=-1 WHERE userId=" +
            userId +
            " AND postId=" +
            postId;
          db.query(sql, (err, results) => {
            if (err) {
              throw err;
            }
          });

          // b/ Incrémenter le nombre de deslikes dans la table posts
          sql =
            "UPDATE posts SET deslikes_number=deslikes_number+1 WHERE postId=" +
            postId;
          db.query(sql, (err, results) => {
            if (err) {
              res.status(501).json({ message: "Erreur Base de donnée!" });
            } else {
              res.status(201).json({
                message:
                  "Le nombre de deslikes est incrémenté dans la table posts",
              });
            }
          });

          // -------- Fin cas user_status = 0

          // -------- Début user_status = 1 ------------//
          // B/    Si le userId a déjà liké le postId (user_status=1)
        } else if (results[0].user_status == 1) {
          // a/ Mettre le user_status à -1
          sql =
            "UPDATE likes_deslikes SET user_status=-1 WHERE userId=" +
            userId +
            " AND postId=" +
            postId;
          db.query(sql, (err, results) => {
            if (err) {
              throw err;
            }
          });

          // b/ Décrémenter le nombre de likes pour le postId dans la table posts
          sql =
            "UPDATE posts SET likes_number=likes_number-1 WHERE postId=" +
            postId;
          db.query(sql, (err, results) => {
            if (err) {
              throw err;
            }
          });

          // c/ Incrémenter le nombre de deslikes dans la table posts
          sql =
            "UPDATE posts SET deslikes_number=deslikes_number+1 WHERE postId=" +
            postId;
          db.query(sql, (err, results) => {
            if (err) {
              res.status(502).json({ message: "Erreur Base de donnée!" });
            } else {
              res.status(202).json({
                message:
                  "Le nombre de deslikes est incrémenté dans la table posts",
              });
            }
          });

          // C/ Si le userId a déjà desliké le postId (user_status=-1)
        } else {
          //a/ ---- Remettre le user_status à 0 ---- //
          sql =
            "UPDATE likes_deslikes SET user_status=0 WHERE userId=" +
            userId +
            " AND postId=" +
            postId;
          db.query(sql, (err, results) => {
            if (err) {
              throw err;
            }
          });

          //b/ -------Décrémenter le nombre de deslikes dans la table posts
          sql =
            "UPDATE posts SET deslikes_number=deslikes_number-1 WHERE postId=" +
            postId;
          db.query(sql, (err, results) => {
            if (err) {
              res.status(501).json({ message: "Erreur Base de donnée!" });
            } else {
              res.status(201).json({
                message:
                  "Le nombre de deslikes est décrémenté dans la table posts",
              });
            }
          });
        }
      }
    }
  });
};
