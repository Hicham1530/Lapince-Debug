import express from "express";
import { ensureAuthenticated } from "./middlewares/authMiddleware.js";

// Importer les contrôleurs
import authControllers from "./controllers/authControllers.js";
import dashboardControllers from "./controllers/dashboardControllers.js";
import profileController from "./controllers/profileControllers.js";
import mainControllers from "./controllers/mainControllers.js";
import settingsController from "./controllers/settingsControllers.js";
import alert from "./models/alert.js";

const router = express.Router();

// Routes générales
router.get("/", mainControllers.home);
router.get("/about", mainControllers.about);
router.get("/contact", mainControllers.contact);
router.get("/legal-mentions", mainControllers.legalMentions);
router.get("/policy", mainControllers.policy);

// Routes principales
router.get("/auth/login", authControllers.login);
router.post("/auth/login", authControllers.loginUser);
router.get("/auth/signup", authControllers.signup);
router.post("/auth/signup", authControllers.signupUser);
router.get("/auth/reset-password", authControllers.resetPassword);
router.get("/auth/logout", authControllers.logoutUser);

// Routes Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {res.redirect("/dashboard/overview");});
router.get("/dashboard/overview", dashboardControllers.overview);
router.get("/dashboard/expenses", dashboardControllers.expenses);
router.get("/dashboard/incomes", dashboardControllers.incomes);





// Routes Profile
router.use("/profile", ensureAuthenticated); // Middleware pour vérifier si l'utilisateur est connecté


router.get("/profile/settings", profileController.settings);
router.post("/settings", ensureAuthenticated, settingsController.updateSettings); // Met à jour les paramètres de l'utilisateur
router.get("/profile/email", profileController.email);
router.post("/profile/email", profileController.updateEmail); // Traitement du changement d'email
router.get("/profile/password", profileController.password);
router.post("/update-password", profileController.updatePassword); // Mise à jour du mot de passe
router.get("/profile/profile", profileController.showProfile);
router.post("/profile/update", profileController.updateProfile);


// Gestion des mouvements (revenus et dépenses)
router.get('/dashboard/incomes', ensureAuthenticated, dashboardControllers.incomes);

router.get('/dashboard/expenses', ensureAuthenticated, dashboardControllers.expenses);

router.post('/dashboard/incomes/add', ensureAuthenticated, dashboardControllers.addIncome);
router.post('/dashboard/expenses/add', ensureAuthenticated, dashboardControllers.addExpense);





export default router;