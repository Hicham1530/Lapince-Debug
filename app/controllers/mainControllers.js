const mainController = {
  home: (req, res) => {
    res.render("home", { title: "Bienvenue" });
  },
  about: (req, res) => {
    res.render("about", { title: "À propos" });
  },
  contact: (req, res) => {
    res.render("contact", { title: "Contactez-nous" });
  },
};

export default mainController;