const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const { isContext } = require("vm");
const { brotliDecompress } = require("zlib");

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

// 1/---- Publier un commentaire ///

exports.createComment = (req, res, next) => {
  let commenter = {
    comment: req.body.comment,
    postId: req.body.postId,
    userId: req.body.userId,
    user_send: req.body.user_send,
    profil_picture: req.body.profil_picture,
  };
  db.query("INSERT INTO comments SET ?", [commenter], (err, results) => {
    if (err) {
      throw err;
    } else {
      // -- Incrémenter le nombre de commentaires au postId
      let sql =
        " UPDATE posts SET commentNumber=commentNumber+1 WHERE postId=" +
        req.body.postId;
      db.query(sql, (err, results) => {
        if (err) {
          throw err;
        }
        res.status(201).json({ message: "Commentaire ajouté avec succès!" });
      });
    }
  });
};

// 2/------ Afficher tous les commentaires d'un post ----//
exports.getAllComments = (req, res, next) => {
  let postId = req.params.id;
  let sql =
    "SELECT *, DATE_FORMAT (date_send, '%d/%m/%Y à %H:%i:%s') as DATETIME_FR FROM comments WHERE postId=" +
    postId +
    " ORDER BY date_send DESC";
  // let sql="SELECT * FROM comments WHERE postId="+postId+" ORDER BY date_send DESC"
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    } else {
      res.json(results);
    }
  });
};

// 3/ ----- Masquer un commentaire

exports.maskComment = (req, res) => {
  let sql = " UPDATE comments SET masked=1 WHERE commentId=" + req.params.id;
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    } else {
      res.status(201).json({ message: " Commentaire masqué dans la Bdd " });
    }
  });
};

// 4/------- Supprimer un commentaire

exports.deleteComment = (req, res) => {
  //A-- Récupérer commentId et postId dans les paramètres
  const commentId = req.params.id.split(" ")[0];
  const postId = req.params.id.split(" ")[1];

  let sql1 = `DELETE FROM comments WHERE commentId=${commentId}`;
  let sql2 = `UPDATE posts SET commentNumber=commentNumber-1 WHERE postId=${postId}`;

  //B-- Supprimer le commentaire dans la table comments
  db.query(sql1, (err, results) => {
    if (err) {
      throw err;
    }
  });

  //C-- Décrémenter le nombre de commentaire pour la publication dans la table posts
  db.query(sql2, (err, results) => {
    if (err) {
      throw err;
    }
  });
  res.status(200).json({ message: " Commentaire supprimé de la Bdd" });
};
