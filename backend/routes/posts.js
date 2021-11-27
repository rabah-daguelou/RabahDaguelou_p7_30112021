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
const postsCtrl= require ('../controllers/posts')
const multer= require ('../middlewares/multer_config')

// Publier un post //
router.post("/posts", multer, postsCtrl.createPost);
// Afficher tous les posts
router.get("/posts", auth, postsCtrl.getAllPosts);
// Afficher les posts d'un utilisateur
router.get("/posts/:id", postsCtrl.getAllMyPosts);
// Supprimer un post
router.delete("/posts/:id", postsCtrl.deletePost);
// Modifier un post
router.put("/posts/:id", multer, postsCtrl.updatePost);

module.exports = router;