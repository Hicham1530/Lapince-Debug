import Mouvement from '../models/mouvement.js'; // Modèle pour la table 'mouvement'
import alert from '../models/alert.js'; // Modèle pour la table 'alert'
import User from '../models/user.js'; // Modèle pour la table 'user'
import dayjs from 'dayjs';

const dashboardController = {
  // Vue d'ensemble
  overview: (req, res) => {
    const successMessage = req.session.successMessage || null;
    req.session.successMessage = null;

    res.render("dashboard/overview", {
      title: "Vue globale",
      successMessage,
      user: req.session.user,
    });
  },

  // Gestion des dépenses
  expenses: async (req, res) => {
    try {
      const userId = req.session.user?.id;

      if (!userId) {
        return res.status(401).render("error", { message: "Utilisateur non connecté." });
      }

      // Récupérer les revenus de l'utilisateur
      const revenus = await Mouvement.findAll({
        where: { id_user: userId, transaction_type: 'debit' },
      });

      // Calcul du total des revenus
      const totalRevenus = revenus.reduce((sum, mouvement) => sum + parseFloat(mouvement.amount), 0);

      // Obtenir l'année et le mois actuels
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();

      // Liste des mois
      const months = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ];

      // Obtenir le jour de la semaine pour le premier jour du mois
      const firstDayOfMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`).day(); // Dimanche = 0
      const daysInMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`).daysInMonth();

      // Calculer les jours à afficher du mois précédent
      const prevMonthDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

      // Générer le calendrier
      const calendar = [];
      for (let i = 0; i < prevMonthDays; i++) {
        calendar.push({
          date: null,
          isOtherMonth: true,
          isToday: false,
        });
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = dayjs(`${currentYear}-${currentMonth + 1}-${day}`);
        calendar.push({
          date: date.format('YYYY-MM-DD'),
          isToday: date.isSame(dayjs(), 'day'),
          isOtherMonth: false,
        });
      }

      const categories = ["toto1", "toto2", "toto3", "toto4", "toto5"];

/*
      
      <div class="expenses-category-list">
        <div class="expenses-category-items">Abonnement</div>
        <div class="expenses-category-items">Achat & Shopping</div>
        <div class="expenses-category-items">Alimentation & Restau</div>
        <div class="expenses-category-items">Auto & Transports</div>
        <div class="expenses-category-items">Retraits, Chq, et vir.</div>
        <div class="expenses-category-items">Epargne & Investissements</div>
        <div class="expenses-category-items">Loisirs et Sortie</div>
        <div class="expenses-category-items">Depense pro</div>
        <div class="expenses-category-items">Logement</div>
        <div class="expenses-category-items">Banque</div>
        <div class="expenses-category-items">Santé</div>
        <div class="expenses-category-items">Scolarité</div>
        <div class="expenses-category-items">Divers</div>
        <div class="expenses-category-items">Famille & Enfants</div>
        <div class="expenses-category-items">Impôts & taxes</div>
        <div class="expenses-category-items">Voyages</div>
      </div>
*/
      res.render("dashboard/expenses", {
        user: req.session.user,
        revenus,
        totalRevenus,
        currentYear,
        currentMonth,
        months,
        calendar,
        categories, // Ajouter les catégories ici
      });

    } catch (error) {
      console.error("Erreur lors de l'affichage des depenses :", error);
      res.status(500).render("error", { message: "Erreur interne lors de l'affichage des depenses." });
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
      const revenus = await Mouvement.findAll({
        where: { id_user: userId, transaction_type: 'credit' },
      });

      // Calcul du total des revenus
      const totalRevenus = revenus.reduce((sum, mouvement) => sum + parseFloat(mouvement.amount), 0);

      // Obtenir l'année et le mois actuels
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();

      // Liste des mois
      const months = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ];

      // Obtenir le jour de la semaine pour le premier jour du mois
      const firstDayOfMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`).day(); // Dimanche = 0
      const daysInMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`).daysInMonth();

      // Calculer les jours à afficher du mois précédent
      const prevMonthDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

      // Générer le calendrier
      const calendar = [];
      for (let i = 0; i < prevMonthDays; i++) {
        calendar.push({
          date: null,
          isOtherMonth: true,
          isToday: false,
        });
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = dayjs(`${currentYear}-${currentMonth + 1}-${day}`);
        calendar.push({
          date: date.format('YYYY-MM-DD'),
          isToday: date.isSame(dayjs(), 'day'),
          isOtherMonth: false,
        });
      }

      const categories = ["Salaire", "Virement", "Revenus Locatifs", "Abonnement", "Alimentation", "Achat"];

      res.render("dashboard/incomes", {
        user: req.session.user,
        revenus,
        totalRevenus,
        currentYear,
        currentMonth,
        months,
        calendar,
        categories, // Ajouter les catégories ici
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
        return res.status(401).render("error", { message: "Utilisateur non connecté." });
      }

      if (!category || !amount || !date) {
        return res.status(400).render("error", { message: "Tous les champs sont obligatoires." });
      }

      await Mouvement.create({
        category,
        amount,
        date,
        description: description || null,
        transaction_type: 'credit',
        id_user: userId,
      });

      req.session.successMessage = "Revenu ajouté avec succès !";
      res.redirect("/dashboard/incomes");
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un revenu :", error);
      res.status(500).render("error", { message: "Erreur interne lors de l'ajout d'un revenu." });
    }
  },

  // Ajouter une dépense
  addExpense: async (req, res) => {
    try {
      const { category, amount, date, description } = req.body;
      const userId = req.session.user?.id;

      if (!userId) {
        return res.status(401).render("error", { message: "Utilisateur non connecté." });
      }

      if (!category || !amount || !date) {
        return res.status(400).render("error", { message: "Tous les champs sont obligatoires." });
      }

      await Mouvement.create({
        category,
        amount,
        date,
        description: description || null,
        transaction_type: 'debit',
        id_user: userId,
      });

      req.session.successMessage = "Dépense ajoutée avec succès !";
      res.redirect("/dashboard/expenses");
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une dépense :", error);
      res.status(500).render("error", { message: "Erreur interne lors de l'ajout d'une dépense." });
    }
  },
};

export default dashboardController;


