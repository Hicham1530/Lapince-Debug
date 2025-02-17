const profileController = {
  settings: (req, res) => {
    res.render("profile/settings", { title: "Paramètres généraux" });
  },
  email: (req, res) => {
    res.render("profile/email", { title: "Modification de l'email" });
  },
  password: (req, res) => {
    res.render("profile/password", { title: "Changement de mot de passe" });
  },
  profile: (req, res) => {
    res.render("profile/profile", { title: "Gestion de profile" });
  },
};

export default profileController;