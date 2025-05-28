import { Op, literal } from 'sequelize';
import User from '../models/user.js';
import Mouvement from '../models/mouvement.js';

const adminController = {
  adminHome: async (req, res) => {
    try {
      const { mois, annee } = req.query;

      let revenusWhere = { transaction_type: 'credit' };
      let depensesWhere = { transaction_type: 'debit' };

      if (mois && annee) {
        revenusWhere = {
          ...revenusWhere,
          [Op.and]: [
            literal(`EXTRACT(MONTH FROM "date") = ${mois}`),
            literal(`EXTRACT(YEAR FROM "date") = ${annee}`)
          ]
        };
        depensesWhere = {
          ...depensesWhere,
          [Op.and]: [
            literal(`EXTRACT(MONTH FROM "date") = ${mois}`),
            literal(`EXTRACT(YEAR FROM "date") = ${annee}`)
          ]
        };
      }

      const totalRevenus = await Mouvement.sum('amount', { where: revenusWhere }) || 0;
      const totalDepenses = await Mouvement.sum('amount', { where: depensesWhere }) || 0;
      const soldeTotal = totalRevenus - totalDepenses;

      res.render('admin/adminHome', {
        user: req.session.user,
        totalRevenus,
        totalDepenses,
        soldeTotal
      });
    } catch (error) {
      console.error('Erreur calcul des totaux filtrés :', error);
      res.status(500).send('Erreur serveur');
    }
  },

  adminUserlist: async (req, res) => {
    try {
      const { mois, annee } = req.query;

      const users = await User.findAll();

      const usersWithTotals = await Promise.all(users.map(async (user) => {
        const totalRevenus = await Mouvement.sum('amount', { where: { id_user: user.id_user, transaction_type: 'credit' } }) || 0;
        const totalDepenses = await Mouvement.sum('amount', { where: { id_user: user.id_user, transaction_type: 'debit' } }) || 0;
        const soldeTotal = totalRevenus - totalDepenses;
      
        const totalTransactions = await Mouvement.count({ where: { id_user: user.id_user } });
        const status = totalTransactions > 0 ? 'Actif' : 'Inactif';
      
        return { ...user.get(), totalRevenus, totalDepenses, soldeTotal, status };
      }));

      res.render('admin/adminUserlist', {
        users: usersWithTotals,
        user: req.session.user
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs filtrés :', error);
      res.status(500).send('Erreur serveur');
    }
  },
  userTransactions: async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send('Utilisateur non trouvé');
      }

      const transactions = await Mouvement.findAll({
        where: { id_user: userId },
        order: [['date', 'DESC']]
      });

      const totalRevenus = await Mouvement.sum('amount', {
        where: { id_user: userId, transaction_type: 'credit' }
      }) || 0;
      
      const totalDepenses = await Mouvement.sum('amount', {
        where: { id_user: userId, transaction_type: 'debit' }
      }) || 0;
      
      const soldeTotal = totalRevenus - totalDepenses;
      
      res.render('admin/adminUserTransactions', {
        user: req.session.user,
        viewedUser: user,
        transactions,
        soldeTotal
      });
    } catch (error) {
      console.error('Erreur récupération des transactions utilisateur :', error);
      res.status(500).send('Erreur serveur');
    }
  },

  // Supprime une transaction
  deleteTransaction: async (req, res) => {
    const transactionId = req.params.id;
    try {
      const transaction = await Mouvement.findByPk(transactionId);
      if (!transaction) {
        return res.status(404).send('Transaction non trouvée');
      }
      await transaction.destroy();
      res.redirect('back'); // revient à la page précédente
    } catch (error) {
      console.error('Erreur suppression transaction :', error);
      res.status(500).send('Erreur serveur');
    }
  },
 /// Supprime un utilisateur et ses mouvements associés

  deleteUser: async (req, res) => {
    const userId = req.params.id;
    try {
      await Mouvement.destroy({ where: { id_user: userId } }); // supprime d’abord ses mouvements
      await User.destroy({ where: { id_user: userId } });      // puis le compte utilisateur
      res.redirect('/admin/users');
    } catch (error) {
      console.error('Erreur suppression utilisateur :', error);
      res.status(500).send('Erreur serveur');
    }
  },
  // Affiche le formulaire de modification d une transaction
// Complète ta fonction editTransactionForm :
editTransactionForm: async (req, res) => {
  const transactionId = req.params.id;
  try {
    const transaction = await Mouvement.findByPk(transactionId);
    if (!transaction) {
      return res.status(404).send('Transaction non trouvée');
    }

    const formattedDate = new Date(transaction.date).toISOString().slice(0, 10);

    // Calcule le solde de l’utilisateur concerné
    const userId = transaction.id_user;

    const totalRevenus = await Mouvement.sum('amount', {
      where: { id_user: userId, transaction_type: 'credit' }
    }) || 0;

    const totalDepenses = await Mouvement.sum('amount', {
      where: { id_user: userId, transaction_type: 'debit' }
    }) || 0;

    const soldeTotal = totalRevenus - totalDepenses;

    // Envoie le solde à la vue
    res.render('admin/editTransaction', {
      user: req.session.user,
      transaction,
      formattedDate,
      soldeTotal // <- très important
    });
  } catch (error) {
    console.error('Erreur affichage modification :', error);
    res.status(500).send('Erreur serveur');
  }
},

 // Met à jour une transaction
updateTransaction: async (req, res) => {
  const transactionId = req.params.id;
  const { amount, category, description, date, transaction_type } = req.body;

  try {
    const transaction = await Mouvement.findByPk(transactionId);
    if (!transaction) {
      return res.status(404).send('Transaction non trouvée');
    }

    transaction.amount = amount;
    transaction.category = category;
    transaction.description = description;
    transaction.date = new Date(transaction.date);
    transaction.transaction_type = transaction_type;

    await transaction.save();

    res.redirect(`/admin/users/${transaction.id_user}`);
  } catch (error) {
    console.error('Erreur mise à jour transaction :', error);
    res.status(500).send('Erreur serveur');
  }
},
  
};

export default adminController;