export const ensureAuthenticated = (req, res, next) => {
  console.log("Middleware : Vérification de la session...");
  console.log("Session actuelle :", req.session);

  if (req.session && req.session.isLogged) {
    console.log("Utilisateur connecté :", req.session.user);
    return next();
  }

  console.log("Utilisateur non connecté. Redirection vers /auth/login.");
  res.redirect("/auth/login");
};
