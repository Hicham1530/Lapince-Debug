import validator from 'validator'; // Pour valider les données des utilisateurs
import bcrypt from 'bcrypt'; // Pour chiffrer les mots de passe
import User from '../models/user.js'; // Importer le modèle User
import alert from '../models/alert.js'; // Modèle pour la table 'alerte'

const authController = {
  // Pages existantes
  signup: (req, res) => {
    res.render("auth/signup", { title: "Inscription" });
  },
  login: (req, res) => {
    res.render("auth/login", { title: "Connexion" });
  },
  resetPassword: (req, res) => {
    res.render("auth/reset-password", { title: "Réinitialisation du mot de passe" });
  },

  // Afficher le formulaire de connexion
  showLoginForm: (req, res) => {
    res.render('login'); // Une vue simple pour tester
  },
  
  // Afficher le formulaire d'inscription ----------------------------------------------

  signupUser: async (req, res) => {
    try {
      console.log("Requête POST reçue à /auth/signup");
      console.log("Données reçues :", req.body);
      const { first_name, last_name, email, password, confirmPassword } = req.body;
  
      // Validation des données
      if (!first_name || !last_name || !email || !password || !confirmPassword) {
        return res.status(400).render('error', { message: 'Tous les champs sont obligatoires.' });
      }
  
      if (!validator.isEmail(email)) {
        return res.status(400).render('error', { message: 'Email invalide.' });
      }
  
      if (password !== confirmPassword) {
        return res.status(400).render('error', { message: 'Les mots de passe ne correspondent pas.' });
      }
  
      // Vérification de l'existence de l'utilisateur
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).render('error', { message: 'Cet email est déjà utilisé.' });
      }
  
      // Chiffrer le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Créer l'utilisateur
      await User.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        genre: null,         // Champ vide par défaut
        date_of_birth: null, // Champ vide par défaut
        adresse: null,       // Champ vide par défaut
        code_postal: null,   // Champ vide par défaut
        pays: null,          // Champ vide par défaut
        user_type: "utilisateur", // Défini par défaut
      });
  
      // Ajouter un message de succès et rediriger vers la connexion
      req.session.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
      res.redirect('/auth/login');
    } catch (error) {
      console.error('Erreur lors de l’inscription :', error);
      res.status(500).render('error', { message: 'Erreur interne.' });
      
    }
  },



  // Connexion de l'utilisateur ----------------------------------------------

  loginUser: async (req, res) => {
    console.log("Requête POST reçue à /auth/login");
    console.log("Données reçues :", req.body);

    const username = validator.escape(req.body.email);
    const password = req.body.password;

    

    try {
      const user = await User.findOne({ where: { email: username } });
      console.log("Données utilisateur après récupération de la base :", user.toJSON());

      if (user) {
        console.log("Données utilisateur après récupération de la base :", user.toJSON());
    } else {
        console.log("Aucun utilisateur trouvé :", username);
        return res.status(401).render('error', { message: 'Utilisateur non trouvé.' });
    }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log("Mot de passe incorrect pour :", username);
        return res.status(401).render('error', { message: 'Mot de passe incorrect.' });
      }

      console.log("Connexion réussie pour :", username);

      // Initialiser la session avec les données complètes de l'utilisateur :Pour garantir que la session utilisateur est toujours synchronisée avec la base de données lors de chaque nouvelle connexion.
      const updatedUser = await User.findByPk(user.id_user);
      console.log("Données utilisateur récupérées après connexion :", updatedUser.toJSON());
     
      req.session.isLogged = true;
      req.session.user = {
        id: updatedUser.id_user,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        date_of_birth: updatedUser.date_of_birth,
        pays: updatedUser.pays,
        language: updatedUser.language,
        currency: updatedUser.currency,
        genre: updatedUser.genre,
        user_type: updatedUser.user_type,
      };
      console.log("Session après connexion :", req.session);

      req.session.successMessage = 'Connexion réussie.';

    // Sauvegarder explicitement la session avant la redirection
    req.session.save((err) => {
      if (err) {
        console.error("Erreur lors de la sauvegarde de la session :", err);
        return res.status(500).render("error", { message: "Erreur interne lors de la sauvegarde de la session." });
      }
      res.redirect('/dashboard/overview');
    });
  } catch (error) {
    console.error("Erreur dans loginUser :", error);
    res.status(500).render('error', { message: 'Erreur interne.' });
  }
},

  // Déconnexion de l'utilisateur--------------------------------------------------------------
  logoutUser: (req, res) => {
    req.session.destroy(); // Supprimer la session
    res.redirect('/auth/login'); // Rediriger vers la page de connexion
  }
};

export default authController;