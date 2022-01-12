const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const commentsCtrl = require("../controllers/comments");

// Publier un commentaire //
router.post("/comments", auth, commentsCtrl.createComment);

// Afficher tous les commentaires
router.get("/comments/:id", auth, commentsCtrl.getAllComments);

// Masquer un commentaire
router.patch("/comments/:id", commentsCtrl.maskComment);

// Supprimer un commentaire
router.delete("/comments/:id", auth, commentsCtrl.deleteComment);

module.exports = router;
