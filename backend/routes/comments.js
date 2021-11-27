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
router.get("/comments/:id", commentsCtrl.getAllComments);


module.exports = router;