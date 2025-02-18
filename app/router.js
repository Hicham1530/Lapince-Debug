import express from "express";
import { ensureAuthenticated } from "./middlewares/authMiddleware.js";
import authControllers from "./controllers/authControllers.js";
import dashboardControllers from "./controllers/dashboardControllers.js";
import profileController from "./controllers/profileControllers.js";
import mainControllers from "./controllers/mainControllers.js";
import settingsController from "./controllers/settingsControllers.js";

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

// Routes protégées (avec middleware)
router.use("/dashboard", ensureAuthenticated);
router.get("/dashboard/overview", dashboardControllers.overview);
router.get("/dashboard/expenses", dashboardControllers.expenses);
router.get("/dashboard/incomes", dashboardControllers.incomes);

// Routes Profile
router.use("/profile", ensureAuthenticated);
router.get("/profile/settings", profileController.settings);
router.post("/settings", settingsController.updateSettings);
router.get("/profile/email", profileController.email);
router.post("/profile/email", profileController.updateEmail);
router.get("/profile/password", profileController.password);
router.post("/update-password", profileController.updatePassword);
router.get("/profile/profile", profileController.showProfile);
router.post("/profile/update", profileController.updateProfile);

// Routes de réinitialisation du mot de passe
// Routes publiques (sans middleware)
router.get("/auth/forgot-password", authControllers.forgotPassword);
router.post("/auth/forgot-password", authControllers.resetPasswordRequest);

router.get("/auth/reset-password/:token", authControllers.resetPasswordPage);
router.post("/auth/reset-password/:token", authControllers.resetPasswordAction);


router.post('/dashboard/incomes/add', dashboardControllers.addIncome);

export default router;