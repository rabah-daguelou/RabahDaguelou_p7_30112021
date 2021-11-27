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
const likes_deslikesCtrl= require ('../controllers/likes_deslikes')


// Liker un post //
router.post("/like/:id", likes_deslikesCtrl.likePost);

// Desliker un post //
router.post("/deslike/:id", likes_deslikesCtrl.deslikePost);




module.exports = router;