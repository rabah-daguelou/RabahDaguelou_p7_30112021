const express    = require("express");
const router     = express.Router();
const auth       = require("../middlewares/auth");
const postsCtrl  = require("../controllers/posts");
const multer     = require("../middlewares/multer_config");

// Publier un post //
router.post("/posts", auth, multer, postsCtrl.createPost);

// Afficher tous les posts
router.get("/posts", auth, postsCtrl.getAllPosts);

// Afficher les posts d'un utilisateur
router.get("/posts/:id", auth, postsCtrl.getAllMyPosts);

// Supprimer un post
router.delete("/posts/:id", auth, postsCtrl.deletePost);

// Modifier un post
router.put("/posts/:id", auth, multer, postsCtrl.updatePost);

// Partager un post
router.post("/posts/share", auth, postsCtrl.sharePost);

module.exports = router;
