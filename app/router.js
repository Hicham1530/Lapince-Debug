import express from "express";
import { ensureAuthenticated } from "./middlewares/authMiddleware.js";
import authControllers from "./controllers/authControllers.js";
import dashboardControllers from "./controllers/dashboardControllers.js";
import profileController from "./controllers/profileControllers.js";
import mainControllers from "./controllers/mainControllers.js";
import settingsController from "./controllers/settingsControllers.js";
import contactController from "./controllers/contactControllers.js";
import { ensureAdmin } from './middlewares/adminMiddleware.js';
import adminController from './controllers/adminControllers.js';


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
router.get("/profile/settings", settingsController.settings);
router.post("/profile/settings", settingsController.updateSettings);
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
router.post('/dashboard/expenses/add', dashboardControllers.addExpense);

router.post('/dashboard/incomes/delete', dashboardControllers.deleteIncome);
router.post('/dashboard/expenses/delete', dashboardControllers.deleteExpense);

router.get('/dashboard/expenses/total', dashboardControllers.getTotalExpenses);



router.post("/contact", contactController.sendMessage);


// Routes Admin
router.get('/admin', ensureAdmin, adminController.adminHome);
router.get('/admin/users', ensureAdmin, adminController.adminUserlist);
router.get('/admin/users/:id', ensureAdmin, adminController.userTransactions);

router.post('/admin/users/:id/delete', ensureAdmin, adminController.deleteUser);
router.post('/admin/transactions/:id/delete', ensureAdmin, adminController.deleteTransaction);

router.get('/admin/transactions/:id/edit', ensureAdmin, adminController.editTransactionForm);
router.post('/admin/transactions/:id/edit', ensureAdmin, adminController.updateTransaction);


// router.get("/auth/login", authControllers.login);
// router.post("/auth/login", authControllers.loginUser);

export default router;