const express    = require("express");
const bodyParser = require("body-parser");
const app        = express();
const mysql      = require("mysql2");
const sharp      = require('sharp');
const path       = require ('path');
const cors       = require ('cors');
const fs         = require ('fs')

const router = express.Router();

const usersCtrl= require ('../controllers/users')
const checkEmail=require ('../middlewares/checkEmail')
const checkPassword=require ('../middlewares/checkPassword')
const checkName=require ('../middlewares/checkName')
const auth= require('../middlewares/auth')

const multer= require ('../middlewares/multer_config')

// s'inscrire
router.post("/signup", checkEmail, checkPassword, checkName, usersCtrl.signup );
// se connecter
router.post("/login", usersCtrl.login);

// Afficher l'utilisateur connecté
router.get("/users/userConnected/:id", auth, usersCtrl.getUserConnected)

// Afficher la liste des salariés
router.get("/users", auth, usersCtrl.getAllUsers);

// Afficher le profil d'un utilisateur
router.get("/users:id", auth, usersCtrl.getOneUser);

// Modifier la photo du profil
router.patch('/users/photo/:id', auth, multer, usersCtrl.modifyProfilPicture);

// Modifier l'Email
router.patch('/users/email/:id', auth, checkEmail, usersCtrl.updateEmail);

// Modifier le nom d'un utilisateur
router.patch("/users/name:id", auth, usersCtrl.updateName);

// Modifier le mot de passe 
router.put ('/users/password/:id', auth, checkPassword, usersCtrl.updatePassword)

// Supprimer un utilisateur
router.delete("/users:id", auth, usersCtrl.deleteOneUser);



// Get All my Publications
//router.get("/users/posts/:id", usersCtrl.getAllMyPublications);

module.exports = router;