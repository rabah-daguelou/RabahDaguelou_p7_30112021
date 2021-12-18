const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = (req, res, next) => {
  console.log ("req.headers.authorization:", req.headers.authorization )
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.secretToken);
    const userId = decodedToken.userId;
    
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Utilisateur invalide';
    } else {
      console.log ("Requête authentifiée !")
      next();
    }
  } catch {
    console.log("Votre requête n'est pas authentifiée! Merci de vous reconnecter.")
    res.status(200).json({
      message:"Vous êtes déconnectés! Merci de vous reconnecter."
    });
    
  }
};