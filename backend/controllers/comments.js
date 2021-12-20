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

// Publier un commentaire ///

exports.createComment=(req,res,next)=>{
  let commenter= {
    comment:req.body.comment,
    postId:req.body.postId,
    userId:req.body.userId,
    user_send:req.body.user_send,
    profil_picture:req.body.profil_picture
  }
  console.log ("ici")
   console.log( "profil_picture:", commenter.profil_picture)
  db.query("INSERT INTO comments SET ?", [commenter], (err, results)=> {
    res.json(results);
    if (err){
      console.log ( "Erreur BDD:", err)
    } else {
      console.log ( "Résultats:", results)
      
      // -- Incrémenter le nombre de commentaires au postId 
    let sql=" UPDATE posts SET commentNumber=commentNumber+1 WHERE postId=" + req.body.postId;
    db.query(sql, (err, results)=> {
         
      if (err){
        console.log ( "Erreur BDD:", err)
      } else { 
        
        console.log ( "Nombre de commentaires mis à jour !", results)
      }
      })
    }
  
  }) 

}
//------ Afficher tous les commentaires d'un post ----//
exports.getAllComments=(req, res, next)=> {
  console.log ("postId:", req.params.id)
  let postId=req.params.id
  let sql= "SELECT *, DATE_FORMAT (date_send, '%d/%m/%Y à %H:%i:%s') as DATETIME_FR FROM comments WHERE postId=" +postId+ " ORDER BY date_send DESC"
// let sql="SELECT * FROM comments WHERE postId="+postId+" ORDER BY date_send DESC"
  db.query(sql, (err, results) => {
    if (err){
      console.log (" Erreur BDD:", err) 
    } else {
        res.json(results);
         console.log ( " Tout les commentaires du post N°: ",postId, results)
    }     
    });
   
};

// ----- Masquer un commentaire 

exports.maskComment=(req, res, next)=>{
  console.log ( "Commentaire à masquer:", req.params.id)
  let sql=" UPDATE comments SET masked=1 WHERE commentId=" + req.params.id
  db.query(sql, (err, results )=>{
    if (err) {
      console.log("Erreur Bdd", err)
    } else {
      console.log ( " Commentaire masqué dans la Bdd ")
      res.status(201).json ({ message: " Commentaire masqué dans la Bdd "
        })
    }
  })

}

// Supprimer un commentaire

exports.deleteComment=(req, res, next) => {
  
  // Récupérer commentId et postId dans les paramètres
  
  const commentId= req.params.id.split(' ')[0];
  const postId= req.params.id.split(' ')[1];
  let sql1=`DELETE FROM comments WHERE commentId=${commentId}`;
  let sql2=`UPDATE posts SET commentNumber=commentNumber-1 WHERE postId=${postId}`
  
  // Supprimer le commentaire dans la table comments
  db.query(sql1,(err, results)=>{
    if (err){
      console.log ( "Erreur Bdd:", err)
    } else {
      console.log (" Commentaire supprimé de la Bdd")
      res.status(200).json({ message: " Commentaire supprimé de la Bdd"})
    }
  })

  // Décrémenter le nombre de commentaire pour la publication dans la table posts
  db.query(sql2,(err, results)=>{
    if (err){
      console.log ( "Erreur Bdd:", err)
    } else {
      console.log (" Le nombre de commentaires est décrémenté pour le post", postId)
     // res.status(201).json({ message: " Le nombre de commentaires est décrémenté pour le post", postId })
    }
  })
};