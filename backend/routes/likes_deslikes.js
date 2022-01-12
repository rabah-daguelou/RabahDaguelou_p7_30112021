const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const likes_deslikesCtrl = require("../controllers/likes_deslikes");

// Liker un post //
router.post("/like/:id", auth, likes_deslikesCtrl.likePost);

// Desliker un post //
router.post("/deslike/:id", auth, likes_deslikesCtrl.deslikePost);

module.exports = router;
