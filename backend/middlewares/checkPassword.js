module.exports = (req, res, next) => {
  const passwordTrue = (password) => {
    let regex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    let regexTrue = regex.test(password);
    regexTrue
      ? next()
      : res.status(200).json({
          type: "error",
          message:
            "Votre mot de passe est invalide! Au moins 8 caractères, une majuscule, un chiffre !",
        });
  };
  passwordTrue(req.body.password);
};
