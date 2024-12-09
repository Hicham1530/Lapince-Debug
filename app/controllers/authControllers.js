const authController = {
    signup: (req, res) => {
      res.render("auth/signup", { title: "Inscription" });
    },
    login: (req, res) => {
      res.render("auth/login", { title: "Connexion" });
    },
    resetPassword: (req, res) => {
      res.render("auth/reset-password", { title: "Réinitialisation du mot de passe" });
    },
  };
  
  export default authController;