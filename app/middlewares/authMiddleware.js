export const ensureAuthenticated = (req, res, next) => {
  console.log("Middleware : Vérification de l'authentification");
  console.log("Utilisateur connecté :", req.session.user);

  console.log("État de la session :", req.session);

  if (req.session && req.session.isLogged) {
    console.log("Utilisateur connecté :", req.session.user);
    return next();
  }

  console.log("Utilisateur non connecté. Redirection vers /auth/login.");
  res.redirect("/auth/login");
};


// app/middlewares/soldeMiddleware.js
import Mouvement from '../models/mouvement.js'; // Assurez-vous que le chemin est correct

// Middleware pour calculer le solde total
export async function soldeMiddleware(req, res, next) {
  try {
    const userId = req.session.user?.id;
    if (userId) {
      const mouvements = await Mouvement.findAll({ where: { id_user: userId } });
      const totalRevenus = mouvements
        .filter(m => m.transaction_type === 'credit')
        .reduce((sum, m) => sum + parseFloat(m.amount), 0);
      const totalDepenses = mouvements
        .filter(m => m.transaction_type === 'debit')
        .reduce((sum, m) => sum + parseFloat(m.amount), 0);
      res.locals.soldeTotal = totalRevenus - totalDepenses;
    } else {
      res.locals.soldeTotal = 0;
    }
  } catch (err) {
    console.error("Erreur dans soldeMiddleware :", err);
    res.locals.soldeTotal = 0;
  }
  next();
}