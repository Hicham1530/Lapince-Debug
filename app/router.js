import express from "express";  // On importe express

// Importer les contrôleurs
import authControllers from "./controllers/authControllers.js";   // On importe le contrôleur Auth
import dashboardControllers from "./controllers/dashboardControllers.js"; // On importe le contrôleur Dashboard
import profileControllers from "./controllers/profileControllers.js"; // On importe le contrôleur Profile
import mainControllers from "./controllers/mainControllers.js"; // On importe le contrôleur Main


const router = express.Router(); // On créé un router express


// Routes générales
router.get("/", mainControllers.home);   // Page d'accueil // On dit à notre router que si on est sur la route /, on appelle la méthode home du mainControllers
router.get("/about", mainControllers.about); // Page à propos
router.get("/contact", mainControllers.contact); // Page contact


// Routes principales 
router.get("/auth/signup", authControllers.signup);      // Page d'inscription
router.get("/auth/login", authControllers.login);    // Page de connexion
router.get("/auth/reset-password", authControllers.resetPassword);   // Réinitialisation
// Routes Dashboard
router.get("/dashboard/overview", dashboardControllers.overview);    // Page tableau de bord
router.get("/dashboard/expenses", dashboardControllers.expenses);    // Page dépenses
router.get("/dashboard/income", dashboardControllers.income);        // Page revenus
// Routes Profile
router.get("/profile/settings", profileControllers.settings);    // Page paramètres
router.get("/profile/email", profileControllers.email);      // Page email
router.get("/profile/password", profileControllers.password);        // Page mot de passe





export default router;