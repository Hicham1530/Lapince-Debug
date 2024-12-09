import express from "express";  // On importe express

// Importer les contrôleurs
import authController from "./controllers/authControllers.js";   // On importe le contrôleur Auth
import dashboardController from "./controllers/dashboardControllers.js"; // On importe le contrôleur Dashboard
import profileController from "./controllers/profileControllers.js"; // On importe le contrôleur Profile
import mainController from "./controllers/mainControllers.js"; // On importe le contrôleur Main


const router = express.Router(); // On créé un router express


// Routes générales
router.get("/", mainController.home);   // Page d'accueil
router.get("/about", mainController.about); // Page à propos
router.get("/contact", mainController.contact); // Page contact


// Routes principales 
router.get("/auth/signup", authController.signup);      // Page d'inscription
router.get("/auth/login", authController.login);    // Page de connexion
router.get("/auth/reset-password", authController.resetPassword);   // Réinitialisation
// Routes Dashboard
router.get("/dashboard/overview", dashboardController.overview);    // Page tableau de bord
router.get("/dashboard/expenses", dashboardController.expenses);    // Page dépenses
router.get("/dashboard/income", dashboardController.income);        // Page revenus
// Routes Profile
router.get("/profile/settings", profileController.settings);    // Page paramètres
router.get("/profile/email", profileController.email);      // Page email
router.get("/profile/password", profileController.password);        // Page mot de passe





export default router;