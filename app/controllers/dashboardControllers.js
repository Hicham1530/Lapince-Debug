import Mouvement from '../models/mouvement.js'; // Modèle pour la table 'mouvement'
import alert from '../models/alert.js'; // Modèle pour la table 'alert'
import user from '../models/user.js'; // Modèle pour la table 'user'
import dayjs from 'dayjs';
import { validationResult } from "express-validator";

// Contrôleur principal
const dashboardController = {
  overview: async (req, res) => {
    try {
      const userId = req.session.user?.id;
  
      if (!userId) {
        return res.status(401).render("error", { message: "Utilisateur non connecté." });
      }
  
      // Récupérer les revenus et dépenses de l'utilisateur
      const revenus = await Mouvement.findAll({
        where: { id_user: userId, transaction_type: "credit" },
      });
  
      const depenses = await Mouvement.findAll({
        where: { id_user: userId, transaction_type: "debit" },
      });
  
      // Calcul des totaux
      const totalRevenus = revenus.reduce((sum, mouvement) => sum + parseFloat(mouvement.amount), 0);
      const totalDepenses = depenses.reduce((sum, mouvement) => sum + parseFloat(mouvement.amount), 0);
      const soldeTotal = totalRevenus - totalDepenses;
  
      // Calcul du pourcentage basé sur le salaire
      const pourcentageRevenus =
        totalRevenus > 0 ? Math.max((1 - totalDepenses / totalRevenus) * 100, 0).toFixed(2) : 0;
  
      console.log("Pourcentage restant du salaire :", pourcentageRevenus);
  
      // Rendre la vue avec les données nécessaires
      res.render("dashboard/overview", {
        user: req.session.user,
        totalRevenus,
        totalDepenses,
        soldeTotal, // Assurez-vous de passer soldeTotal ici
        pourcentageRevenus,
      });
    } catch (error) {
      console.error("Erreur dans overview :", error);
      res.status(500).render("error", { message: "Erreur interne." });
    }
  },
  // Gestion des dépenses
  expenses: async (req, res) => {
    try {
      const userId = req.session.user?.id;

      if (!userId) {
        return res.status(401).render("error", { message: "Utilisateur non connecté." });
      }

      // Récupérer les revenus et les dépenses de l'utilisateur
      const revenus = await Mouvement.findAll({ where: { id_user: userId, transaction_type: "credit" } });
      const depenses = await Mouvement.findAll({ where: { id_user: userId, transaction_type: "debit" } });

      // Calculs des totaux
      const totalRevenus = revenus.reduce((sum, mouvement) => sum + parseFloat(mouvement.amount), 0);
      const totalDepenses = depenses.reduce((sum, mouvement) => sum + parseFloat(mouvement.amount), 0);
      const soldeTotal = totalRevenus - totalDepenses;

      // Obtenir l'année et le mois actuels
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();

      // Liste des mois
      const months = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ];

      // Générer le calendrier
      const firstDayOfMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`).day();
      const daysInMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`).daysInMonth();
      const prevMonthDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

      const calendar = [];
      for (let i = 0; i < prevMonthDays; i++) {
        calendar.push({ date: null, isOtherMonth: true, isToday: false });
      }
      for (let day = 1; day <= daysInMonth; day++) {
        const date = dayjs(`${currentYear}-${currentMonth + 1}-${day}`);
        calendar.push({
          date: date.format('YYYY-MM-DD'),
          isToday: date.isSame(dayjs(), 'day'),
          isOtherMonth: false,
        });
      }

      // Liste des catégories pour les dépenses
      const categories = [
        "Abonnement", "Achat & Shopping", "Alimentation & Restau",
        "Auto & Transports", "Retraits, Chq, et vir.", "Epargne & Investissements",
        "Loisirs et Sortie", "Depense pro", "Logement", "Banque", "Santé",
        "Scolarité", "Divers", "Famille & Enfants", "Impôts & taxes",
        "Voyages", "Autres dépenses"
      ];

      // Log pour le débogage
      console.log({ totalRevenus, totalDepenses, soldeTotal });

      // Rendre la vue
      res.render("dashboard/expenses", {
        user: req.session.user,
        revenus,
        depenses,
        totalRevenus,
        totalDepenses,
        soldeTotal,
        currentYear,
        currentMonth,
        months,
        calendar,
        categories,
      });
    } catch (error) {
      console.error("Erreur lors de l'affichage des dépenses :", error);
      res.status(500).render("error", { message: "Erreur interne lors de l'affichage des dépenses." });
    }
  },

  // Gestion des revenus
  incomes: async (req, res) => {
    try {
      const userId = req.session.user?.id;

      if (!userId) {
        return res.status(401).render("error", { message: "Utilisateur non connecté." });
      }

      // Récupérer les revenus de l'utilisateur
      const revenus = await Mouvement.findAll({ where: { id_user: userId, transaction_type: "credit" } });
      const totalRevenus = revenus.reduce((sum, mouvement) => sum + parseFloat(mouvement.amount), 0);

      // Récupérer les dépenses de l'utilisateur
      const depenses = await Mouvement.findAll({ where: { id_user: userId, transaction_type: "debit" } });
      const totalDepenses = depenses.reduce((sum, mouvement) => sum + parseFloat(mouvement.amount), 0);

      // Calcul du solde total
      const soldeTotal = totalRevenus - totalDepenses;

      // Obtenir l'année et le mois actuels
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();

      // Liste des mois
      const months = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ];

      // Générer le calendrier
      const firstDayOfMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`).day();
      const daysInMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`).daysInMonth();
      const prevMonthDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

      const calendar = [];
      for (let i = 0; i < prevMonthDays; i++) {
        calendar.push({ date: null, isOtherMonth: true, isToday: false });
      }
      for (let day = 1; day <= daysInMonth; day++) {
        const date = dayjs(`${currentYear}-${currentMonth + 1}-${day}`);
        calendar.push({
          date: date.format('YYYY-MM-DD'),
          isToday: date.isSame(dayjs(), 'day'),
          isOtherMonth: false,
        });
      }

      // Liste des catégories pour les revenus
      const categories = [
        "Salaire", "Virement", "Revenus Locatifs", "Revenus freelancing",
        "Investissements", "Dividendes", "Bonus", "Primes",
        "Remboursements", "Pensions", "Allocations", "Subventions",
        "Gains de loterie", "Revente d'objets", "Gains d'entrepreneuriat",
        "Héritage", "Autres revenus"
      ];

      // Rendre la vue
      res.render("dashboard/incomes", {
        user: req.session.user,
        revenus,
        totalRevenus,
        soldeTotal,
        currentYear,
        currentMonth,
        months,
        calendar,
        categories,
      });
    } catch (error) {
      console.error("Erreur lors de l'affichage des revenus :", error);
      res.status(500).render("error", { message: "Erreur interne lors de l'affichage des revenus." });
    }
  },

  // Ajouter un revenu
  addIncome: async (req, res) => {
    try {
      const { category, amount, date, description } = req.body;
      const userId = req.session.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: "Utilisateur non connecté." });
      }

      const income = await Mouvement.create({
        category,
        amount,
        date,
        description,
        transaction_type: 'credit',
        id_user: userId,
      });

      res.json({ success: true, message: "Revenu ajouté avec succès." });
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un revenu :", error);
      res.status(500).json({ success: false, message: "Erreur interne." });
    }
  },

  // Ajouter une dépense
  addExpense: async (req, res) => {
    try {
      const { category, amount, date, description } = req.body;
      const userId = req.session.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: "Utilisateur non connecté." });
      }

      const expense = await Mouvement.create({
        category,
        amount,
        date,
        description,
        transaction_type: 'debit',
        id_user: userId,
      });

      res.json({ success: true, message: "Dépense ajoutée avec succès." });
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une dépense :", error);
      res.status(500).json({ success: false, message: "Erreur interne." });
    }
  },
};

console.log("DashboardControllers chargé !");
export default dashboardController;