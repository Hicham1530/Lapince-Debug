// app/middlewares/soldeMiddleware.js

import Mouvement from '../models/mouvement.js'; // J'importe le modèle Mouvement pour d'autres middlewares (non utilisé ici directement)

// Middleware pour vérifier si l'utilisateur est authentifié
export const ensureAuthenticated = (req, res, next) => {
  // Affiche dans la console que le middleware d'authentification est appelé
  console.log("Middleware : Vérification de l'authentification");

  // Affiche les données de l'utilisateur dans la session (si présent)
  console.log("Utilisateur connecté :", req.session.user);

  // Affiche l’état complet de la session pour le debug
  console.log("État de la session :", req.session);

  // Vérifie si l'utilisateur est connecté (présence du flag isLogged)
  if (req.session && req.session.isLogged) {
    console.log("Utilisateur connecté :", req.session.user);
    return next(); // Autorise l'accès à la suite (route protégée)
  }

  // Si l'utilisateur n'est pas connecté, redirige vers la page de login
  console.log("Utilisateur non connecté. Redirection vers /auth/login.");
  res.redirect("/auth/login");
};


// Middleware pour calculer le solde total d’un utilisateur
export async function soldeMiddleware(req, res, next) {
  try {
    const userId = req.session.user?.id;
    if (userId) {
      //  Je récupère tous les mouvements (transactions) de l'utilisateur
      const mouvements = await Mouvement.findAll({ where: { id_user: userId } });

      //  Je filtre les crédits (revenus), puis j’additionne les montants
      const totalRevenus = mouvements
        .filter(m => m.transaction_type === 'credit')
        .reduce((sum, m) => sum + parseFloat(m.amount), 0);

      //  Je filtre les débits (dépenses), puis j’additionne les montants
      const totalDepenses = mouvements
        .filter(m => m.transaction_type === 'debit')
        .reduce((sum, m) => sum + parseFloat(m.amount), 0);

      //  Je calcule le solde (revenus - dépenses)
      // et je le stocke dans res.locals pour l’utiliser dans mes vues
      res.locals.soldeTotal = totalRevenus - totalDepenses;
    } else {
      res.locals.soldeTotal = 0; // Aucun utilisateur connecté
    }
  } catch (err) {
    console.error("Erreur dans soldeMiddleware :", err);
    res.locals.soldeTotal = 0;
  }
  next(); // Je passe au middleware ou à la route suivante
}
