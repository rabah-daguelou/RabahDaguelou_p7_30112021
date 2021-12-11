const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql2");

const sharp = require("sharp");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const router = express.Router();

const auth= require ('../middlewares/auth');
const commentsCtrl= require ('../controllers/comments')


// Publier un commentaire //
router.post("/comments", commentsCtrl.createComment);

// Afficher tous les commentaires
router.get("/comments/:id", commentsCtrl.getAllComments);

// Masquer un commentaire
router.patch("/comments/:id", commentsCtrl.maskComment)



module.exports = router;