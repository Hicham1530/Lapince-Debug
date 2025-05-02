import validator from 'validator'; // Pour valider les données des utilisateurs
import bcrypt from 'bcrypt'; // Pour chiffrer les mots de passe
import User from '../models/user.js'; // Importer le modèle User
import crypto from "crypto"; // Pour générer des tokens
import { sendEmail } from "../../utils/mailer.js"; // Importer la fonction sendEmail
import { Op } from 'sequelize';

const authController = {
  // Pages existantes
  signup: (req, res) => {
    // Récupère et transmet les messages flash
    const errorMessage   = req.session.errors   || null;
    const successMessage = req.session.successMessage || null;
  
    // Réinitialise-les pour qu’ils n’apparaissent qu’une fois
    req.session.errors        = null;
    req.session.successMessage = null;
  
    // Rend la vue en passant errorMessage et successMessage
    res.render("auth/signup", {
      title: "Inscription",
      errorMessage,
      successMessage
    });
  },
  login: (req, res) => {
    res.render("auth/login", {
      title: "Connexion",
      successMessage: req.session.successMessage || null, // Passe le message de succès
      errorMessage: req.session.errors || null, // Passe les erreurs
    });
  
    // Réinitialise les messages après affichage
    req.session.successMessage = null;
    req.session.errors = null;
  },
  resetPassword: (req, res) => {
    const token = req.params.token || null;
    res.render("auth/forgot-password", {
      title: "Réinitialisation du mot de passe",
      errorMessage: req.session.errors || null,
      successMessage: req.session.successMessage || null,
    });
    req.session.errors = null;
    req.session.successMessage = null;
  },
  forgotPassword: (req, res) => {
    // Assure que le message d'erreur ou de succès n'est défini que s'il existe déjà dans la session
    const errorMessage = req.session.errors || null;
    const successMessage = req.session.successMessage || null;
  
    res.render("auth/forgot-password", {
      title: "Réinitialisation du mot de passe",
      errorMessage, // Passe l'erreur uniquement si elle existe
      successMessage, // Passe le succès uniquement si défini
    });
  
    // Réinitialise les messages après affichage
    req.session.errors = null;
    req.session.successMessage = null;
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
      // Vérification des règles de sécurité du mot de passe 2 caractères, avec des lettres majuscules, minuscules, des chiffres et des symboles.


      if (!validator.isStrongPassword(password, {
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1, // Force au moins un symbole
      })) {
        return res.status(400).render('error', { message: 'Le mot de passe doit contenir au moins 12 caractères, avec des lettres majuscules, minuscules, des chiffres et des symboles.' });

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
        return res.status(401).render('error', { message: 'Le mot de passe saisi est erroné. Si vous l’avez oublié, cliquez sur « Mot de passe oublié ».' });
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
    res.status(500).render('error', { message: 'Erreur : Aucun compte n’est associé à cet e-mail' });
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
    req.session.errors = "Veuillez fournir un email valide.";
    return res.render("auth/forgot-password", {
      title: "Réinitialisation du mot de passe",
      errorMessage: req.session.errors,
      successMessage: null,
    });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.session.errors = "Aucun utilisateur trouvé avec cet email.";
      return res.render("auth/forgot-password", {
        title: "Réinitialisation du mot de passe",
        errorMessage: req.session.errors,
        successMessage: null,
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

    req.session.successMessage = "Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte mail.";
    res.render("auth/forgot-password", {
      title: "Réinitialisation du mot de passe",
      errorMessage: null,
      successMessage: req.session.successMessage, // Passe le message de succès à la vue
    });
  } catch (error) {
    console.error("Erreur dans forgotPassword :", error);
    res.status(500).render("error", { message: "Erreur lors de la demande de réinitialisation." });
  }
};


   // Affichage de la page de réinitialisation
   const resetPasswordPage = async (req, res) => {
    const { token } = req.params;
  
    try {
      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: { [Op.gt]: Date.now() },
        },
      });
  
      if (!user) {
        req.session.errors = "Lien invalide ou expiré.";
        return res.redirect("/auth/forgot-password");
      }
  
      res.render("auth/reset-password", {
        title: "Réinitialisation du mot de passe",
        token,
        errorMessage: req.session.errors || null, // Affiche un message d'erreur s'il existe
        successMessage: req.session.successMessage || null, // Affiche un message de succès
      });
      req.session.errors = null; // Réinitialiser après affichage
      req.session.successMessage = null;
    } catch (error) {
      console.error("Erreur dans resetPasswordPage :", error);
      res.status(500).render("error", { message: "Erreur lors de la vérification du lien." });
    }
  };



// Réinitialisation du mot de passe

const resetPasswordAction = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  // Vérification des champs
  if (!password || !confirmPassword) {
    return res.render("auth/reset-password", {
      title: "Réinitialisation du mot de passe",
      token,
      errorMessage: "Les champs de mot de passe sont obligatoires.",
    });
  }

  if (password !== confirmPassword) {
    return res.render("auth/reset-password", {
      title: "Réinitialisation du mot de passe",
      token,
      errorMessage: "Les mots de passe ne correspondent pas.",
    });
  }

  // Vérification des règles de sécurité du mot de passe
  if (!validator.isStrongPassword(password, {
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1, // Force au moins un symbole
  })) {
    console.log("Mot de passe non valide :", password); // Debug
    return res.render("auth/reset-password", {
      title: "Réinitialisation du mot de passe",
      token,
      errorMessage: "Le mot de passe doit contenir au moins 8 caractères, avec des lettres majuscules, minuscules, des chiffres et des symboles.",
    });
  }

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.render("auth/forgot-password", {
        title: "Réinitialisation du mot de passe",
        errorMessage: "Lien invalide ou expiré.",
      });
    }

    // Mise à jour du mot de passe
    user.password = await bcrypt.hash(password, 10);
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
      return res.redirect("/auth/forgot-password");
    }

    // Invalider les anciens tokens
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    // Générer un nouveau token
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await user.save();

    const resetLink = `http://localhost:3000/auth/reset-password/${token}`;
    await sendEmail({
      to: user.email,
      subject: "Réinitialisation de votre mot de passe",
      html: `<p>Cliquez ici pour réinitialiser votre mot de passe : <a href="${resetLink}">${resetLink}</a></p>`,
    });

    // Ajouter un message de succès dans la session
    req.session.successMessage = "Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte mail.";
    res.redirect("/auth/login");
  } catch (error) {
    console.error("Erreur dans resetPasswordRequest :", error);
    req.session.errors = "Une erreur est survenue. Veuillez réessayer.";
    res.redirect("/auth/forgot-password");
  }
};



export default { ...authController, resetPasswordAction, resetPasswordPage, forgotPassword, resetPasswordRequest  };







