import validator from 'validator'; // Pour valider les données des utilisateurs
import bcrypt from 'bcrypt'; // Pour chiffrer les mots de passe
import User from '../models/user.js'; // Importer le modèle User
import alert from '../models/alert.js'; // Modèle pour la table 'alerte'
import nodemailer from 'nodemailer'; // Pour envoyer des emails
import crypto from "crypto"; // Pour générer des tokens
import { sendEmail } from "../../utils/mailer.js"; // Importer la fonction sendEmail
import { Op } from 'sequelize';
import jwt from "jsonwebtoken";

const authController = {
  // Pages existantes
  signup: (req, res) => {
    res.render("auth/signup", { title: "Inscription" });
  },
  login: (req, res) => {
    res.render("auth/login", { title: "Connexion" });
  },
  resetPassword: (req, res) => {
    const token = req.params.token || null; // Récupère le token depuis les paramètres ou null si absent
    res.render("auth/reset-password", {
      title: "Réinitialisation du mot de passe",
      testVar: "Variable test", // Ajoutez testVar ici
      error: req.session.errors || null, // Passe une erreur s'il y en a
      token, // Passe le token s'il est défini, sinon null
    });
  },
  forgotPassword: (req, res) => {
    res.render("auth/forgot-password", { title: "Réinitialisation du mot de passe" });
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



 //Demande de réinitialisation
 const forgotPassword = async (req, res) => {
  console.log("Accès à la page /auth/forgot-password");
  console.log("Session actuelle :", req.session);
  
  const { email } = req.body;

if (!email) {
  req.session.errors = "Veuillez fournir un email.";
  return res.render("auth/forgot-password", { 
    title: "Réinitialisation du mot de passe",
    error: req.session.errors, // Affiche l'erreur sur la page
  });
  
}
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.session.errors = "Aucun utilisateur trouvé avec cet email.";
      return res.render("auth/forgot-password", {
        title: "Réinitialisation du mot de passe",
        error: req.session.errors, // Affiche l'erreur sur la page
      });
    }


    // Générer un token unique
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Valable 1 heure
    await user.save();

    // Lien de réinitialisation
    const resetLink = `http://localhost:3000/auth/reset-password/${token}`;

    // Envoi de l'e-mail
    await sendEmail({
      to: user.email,
      subject: "Réinitialisation de votre mot de passe",
      html: `<p>Cliquez ici pour réinitialiser votre mot de passe : <a href="${resetLink}">${resetLink}</a></p>`,
    });

    req.session.successMessage = "Email envoyé pour réinitialisation.";
    res.redirect("/auth/login");
  } catch (error) {
    console.error("Erreur dans forgotPassword :", error);
    res.status(500).render("error", { message: "Erreur lors de la demande de réinitialisation." });
  }
};
   // Affichage de la page de réinitialisation
   const resetPasswordPage = async (req, res) => {
    const { token } = req.params;
    console.log("Accès à la page de réinitialisation avec token :", token);
  
    try {
      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: { [Op.gt]: Date.now() }, // Vérifie si le token est valide
        },
      });
    
      if (!user) {
        req.session.errors = "Lien invalide ou expiré.";
        console.log("Réinitialisation échouée : Lien invalide ou expiré");
        return res.redirect("/auth/forgot-password");
      }
    
      console.log("Utilisateur trouvé pour réinitialisation :", user.email);
    
    // Afficher la page avec le formulaire de réinitialisation
    res.render("auth/reset-password", {
      title: "Réinitialisation du mot de passe",
      token, // Passe le token à la vue
      error: null, // Pas d'erreur initialement
    });
  } catch (error) {
    console.error("Erreur dans resetPasswordPage :", error);
    res.status(500).render("error", { message: "Erreur lors de la vérification du lien." });
  }
};



// Réinitialisation du mot de passe

const resetPasswordAction = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  // Vérification des mots de passe
  if (!password || !confirmPassword) {
    req.session.errors = "Les champs de mot de passe sont obligatoires.";
    return res.redirect(`/auth/reset-password/${token}`);
  }
  if (password !== confirmPassword) {
    req.session.errors = "Les mots de passe ne correspondent pas.";
    return res.redirect(`/auth/reset-password/${token}`);
  }

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() }, // Vérifie si le token est encore valide
      },
    });

    if (!user) {
      req.session.errors = "Lien invalide ou expiré.";
      return res.redirect("/auth/forgot-password");
    }
    // Mise à jour du mot de passe et suppression du token
    user.password = await bcrypt.hash(password, 10); // Hash le nouveau mot de passe
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    req.session.successMessage = "Mot de passe réinitialisé avec succès.";
    res.redirect("/auth/login");
  } catch (error) {
    console.error("Erreur dans resetPasswordAction :", error);
    res.status(500).render("error", { message: "Erreur lors de la réinitialisation." });
  }
};

const resetPasswordRequest = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.session.errors = "Aucun utilisateur trouvé avec cet email.";
      return res.redirect("/auth/reset-password");
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await user.save();

    const resetLink = `http://localhost:3000/auth/reset-password/${token}`;

    await sendEmail({
      to: user.email,
      subject: "Réinitialisation de mot de passe",
      html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe : <a href="${resetLink}">${resetLink}</a></p>`,
    });

    req.session.successMessage = "Un email de réinitialisation a été envoyé.";
    res.redirect("/auth/login");
  } catch (error) {
    console.error("Erreur dans resetPasswordRequest :", error);
    req.session.errors = "Une erreur est survenue. Veuillez réessayer.";
    res.redirect("/auth/reset-password");
  }
};




export default { ...authController, resetPasswordAction, resetPasswordPage, forgotPassword, resetPasswordRequest  };






