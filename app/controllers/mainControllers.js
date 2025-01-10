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
  legalMentions: (req, res) => {
    res.render("legal-mentions", { title: "Mentions légales" });
  },
  policy: (req, res) => {
    res.render("policy", { title: "Politique de confidentialité" });
  },
};

export default mainController;