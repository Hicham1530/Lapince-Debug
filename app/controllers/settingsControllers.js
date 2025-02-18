

import User from "../models/user.js";

const settingsController = {
  settings: (req, res) => {
    if (!req.session.user) {
      console.log("Session utilisateur dans settings :", req.session.user);
      console.error("Erreur : utilisateur non connecté.");
      return res.status(401).render("error", { message: "Accès interdit. Veuillez vous connecter." });
    }
  
    res.render("profile/settings", { 
      title: "Paramètres généraux", 
      user: req.session.user, 
      successMessage: req.session.successMessage || null, // Ajoute successMessage

    });
      // Réinitialise successMessage après le rendu
  req.session.successMessage = null;
  },

  updateSettings: async (req, res) => {
    console.log("Requête reçue avec body :", req.body);
    try {
      const { 'interface-langue': language, devise: currency } = req.body;
      const userId = req.session.user.id;
  
      const validLanguages = ["fr", "en", "es"];
      const validCurrencies = ["eur", "usd", "mad"];
  
      // Logs pour débogage
      console.log("Langue reçue :", language);
      console.log("Devise reçue :", currency);
      console.log("Langues valides :", validLanguages);
      console.log("Devises valides :", validCurrencies);
  
      if (!validLanguages.includes(language) || !validCurrencies.includes(currency)) {
        console.error("Validation échouée : données invalides.");
        return res.status(400).render("error", { message: "Données invalides." });
      }
  
      // Mise à jour dans la base de données
      await User.update(
        { language, currency },
        { where: { id_user: userId } }
      );
  
      console.log("Avant mise à jour de la session :", req.session.user);
  
      req.session.user = {
        ...req.session.user,
        language,
        currency,
      };
  
      console.log("Après mise à jour de la session :", req.session.user);
  

      req.session.successMessage = "Vos paramètres ont été mis à jour avec succès.";
      res.redirect("/profile/settings");
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres :", error);
      res.status(500).render("error", { message: "Erreur interne." });
    }
  },
};

export default settingsController;