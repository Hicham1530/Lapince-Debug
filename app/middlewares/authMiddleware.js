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
import Mouvement from '../models/mouvement.js'; 

// Middleware pour calculer le solde total
export  async function soldeMiddleware(req, res, next) {
  if (req.session.user?.id) {
    const userId = req.session.user.id;
    const revenus = await Mouvement.findAll({ where: { id_user: userId, transaction_type: 'credit' } });
    const depenses = await Mouvement.findAll({ where: { id_user: userId, transaction_type: 'debit' } });

    const totalRevenus  = revenus.reduce((acc, m) => acc + parseFloat(m.amount), 0);
    const totalDepenses = depenses.reduce((acc, m) => acc + parseFloat(m.amount), 0);
    res.locals.soldeTotal = totalRevenus - totalDepenses;
  } else {
    res.locals.soldeTotal = 0;
  }
  next();
}