import fetch from 'node-fetch';
import User from "../models/user.js";

async function getAvailableCurrencies() {
  try {
    const res = await fetch('https://api.frankfurter.app/currencies');
    const data = await res.json();
    return data; // ex : { USD: "United States Dollar", EUR: "Euro", ... }
  } catch (error) {
    console.error("Erreur récupération devises :", error);
    return { EUR: "Euro", USD: "United States Dollar" }; // fallback minimal
  }
}

const settingsController = {
  settings: async (req, res) => {
    if (!req.session.user) {
      console.log("Session utilisateur dans settings :", req.session.user);
      console.error("Erreur : utilisateur non connecté.");
      return res.status(401).render("error", { message: "Accès interdit. Veuillez vous connecter." });
    }
  
    const availableCurrencies = await getAvailableCurrencies();

    res.render("profile/settings", { 
      title: "Paramètres généraux", 
      user: req.session.user, 
      successMessage: req.session.successMessage || null,
      availableCurrencies  // ← ici !
    });
  
    req.session.successMessage = null;
  },

  updateSettings: async (req, res) => {
    console.log("Requête reçue avec body :", req.body);
    try {
      const { 'interface-langue': language, devise: currency, convertir_montants } = req.body;
      const userId = req.session.user.id;
  
      const validLanguages = ["fr", "en", "es"];
  
      // Récupérer dynamiquement les devises valides
      const availableCurrencies = await getAvailableCurrencies();
      const validCurrencies = Object.keys(availableCurrencies).map(c => c.toLowerCase());
  
      console.log("Langue reçue :", language);
      console.log("Devise reçue :", currency);
      console.log("Convertir montants reçu :", convertir_montants);
  
      if (!validLanguages.includes(language) || !validCurrencies.includes(currency)) {
        console.error("Validation échouée : données invalides.");
        return res.status(400).render("error", { message: "Données invalides." });
      }
  
      const convertirMontantsValue = convertir_montants === "on";
  
      // Mise à jour dans la base de données
      await User.update(
        { language, currency, convertir_montants: convertirMontantsValue },
        { where: { id_user: userId } }
      );
  
      req.session.user = {
        ...req.session.user,
        language,
        currency,
        convertir_montants: convertirMontantsValue,
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