// import validator from "validator";
// import bcrypt from "bcrypt";
// import User from "../models/User.js";
// import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";

// const authController = {
//   signup: function (req, res) {
//     if (req.session.login) {
//       // Si l'utilisateur est déjà connecté
//       return res.redirect("/"); // Redirection vers la page d'accueil
//     }

//     // Si l'utilisateur n'est pas connecté, afficher la page d'inscription
//     res.render("signup");
//   },

//   signupAction: async function (req, res) {
//     try {
//       const { firstname, lastname, email, password, passwordConfirm } =
//         req.body; // Récupération des données du formulaire d'inscription
//       console.log(req.body);


//       // Vérification de la validité de l'email
//       if (!validator.isEmail(email)) {
//         // Si l'email n'est pas valide
//         throw new Error("L'email n'est pas valide."); // On renvoie une erreur
//       }

//       const passwordoptions = {
//         // Options pour le mot de passe
//         minLength: 12,
//         minUppercase: 1,
//         minNumbers: 1,
//         minSymbols: 1,
//       };

//       if (!validator.isStrongPassword(password, passwordoptions)) {
//         // Si le mot de passe n'est pas assez fort selon les options définies ci-dessus
//         throw new Error( // On renvoie une erreur
//           "Le mot de passe doit contenir au moins 12 caractères, une minuscule, une majuscule, un chiffre et un caractère spécial."
//         );
//       }

//       // Vérification de l'unicité de l'email
//       const mailExist = await User.findOne({ where: { email } }); // Recherche de l'utilisateur en base de données par son email pour vérifier son existence

//       if (mailExist) {
//         // Si l'email existe déjà en base de données
//         throw new Error("Cet email est déjà utilisé."); // On renvoie une erreur
//       }

//       // Vérification que les mots de passe correspondent
//       if (password !== passwordConfirm) {
//         // Si les mots de passe ne correspondent pas
//         throw new Error("Les mots de passe ne correspondent pas.");
//       } // On renvoie une erreur

//       // Hachage du mot de passe avec bcrypt
//       const hash = await bcrypt.hash(password, 10);

//       // Création du nouvel utilisateur avec les informations fournies
//       const user = await User.create({
//         email,
//         password: hash,
//         firstname,
//         lastname,
//       });

//       // Enregistrement de l'utilisateur dans la session pour le connecter
//       req.session.login = {
//         // On enregistre l'utilisateur dans la session
//         id: user.id, // On enregistre l'id de l'utilisateur
//         email: user.email, // On enregistre l'email de l'utilisateur
//         role: user.role, // On enregistre le rôle de l'utilisateur
//       };

//       // Redirection vers la page d'accueil ou autre
//       res.redirect("/");
//     } catch (error) {
//       console.log(error.message);
//       // Affichage de l'erreur dans la page de signup ou une page d'erreur dédiée
//       res.render("error", { message: error.message });
//     }
//   },

//   login: function (req, res) {
//     // Fonction de connexion
//     if (req.session.login) {
//       console.log(req.session);
      
//       // Si l'utilisateur est déjà connecté
//       return res.redirect("/"); // Redirection vers la page d'accueil
//     }
//     res.render("login",); // Renvoie du formulaire de connexion
//   },

//   loginAction: async (req, res) => {
//     try {
//       const { email, password } = req.body; // Récupération des données du formulaire de connexion

//       // Recherche de l'utilisateur en base de données
//       const user = await User.findOne({ where: { email } }); // Vérification de l'existence de l'utilisateur en base de données par son email
//       if (!user) {
//         // Si l'utilisateur n'existe pas en base de données
//         throw new Error("La combinaison email/mot de passe est incorrecte."); // On renvoie une erreur
//       }

//       // Comparaison des mots de passe avec bcrypt pour vérifier qu'ils correspondent bien à l'utilisateur trouvé
//       const isMatch = await bcrypt.compare(password, user.password); // Comparaison du mot de passe fourni avec le mot de passe haché en base de données
//       if (!isMatch) {
//         // Si les mots de passe ne correspondent pas
//         throw new Error("La combinaison email/mot de passe est incorrecte."); // On renvoie une erreur
//       }

//       // Enregistrement de l'utilisateur dans la session pour le connecter
//       req.session.login = {
//         // On enregistre l'utilisateur dans la session
//         id: user.id, // On enregistre l'id de l'utilisateur
//         email: user.email, // On enregistre l'email de l'utilisateur
//         role: user.role, // On enregistre le rôle de l'utilisateur
//       };
//       // Redirection vers la page d'accueil
//       return res.redirect("/");
//     } catch (error) {
//       console.error(error.message);
//       res.render("error", { message: error.message });
//     }
//   },

//   logout: function (req, res) {
//     // Fonction de déconnexion
//     req.session.destroy(); // methode destroy() pour détruire la session en cours , methode native de express-session
//     res.redirect("/"); // Redirige immédiatement après
//   },



//   forgotPassword: function (req, res) {

//     res.render("forgot-password"); // Affiche le formulaire de demande de réinitialisation du mot de passe

//   },

//   forgotPasswordAction: async (req, res) => {
//     const { email } = req.body;
  
//     try {
//       const user = await User.findOne({ where: { email } });
  
//       if (!user) {
//         return res.status(404).send("Utilisateur introuvable.");
//       }
  
//       // Créer un token JWT pour l'utilisateur avec une durée de validité de 1h 
//       const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY_JWT, { expiresIn: "1h" });
  
//       // Configurer le transporteur d'email
//       const transporter = nodemailer.createTransport({
//         service: "Gmail",
//         auth: {
//           user: process.env.mailUser,
//           pass: process.env.mailPassWord, 
//         },
//       });
  
//       const resetLink = `http://localhost:3000/reset-password/${token}`;
//       await transporter.sendMail({
//         from: `Support GreenRoots <${process.env.mailUser}>`,
//         to: email,
//         subject: "Réinitialisation de mot de passe",
//         html: `<p>Cliquez ici pour réinitialiser votre mot de passe : <a href="${resetLink}">Réinitialiser</a></p>`,
//       });
//       req.flash("success", "Email de réinitialisation envoyé avec succès.");
//       res.redirect("/forgot-password");
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Erreur lors de l'envoi de l'email.");
//     }
//   },

//   resetPassword: (req, res) => {
//     const { token } = req.params;
//     res.render("reset-password", { token }); // Vue EJS
//   },

//   resetPasswordAction: async (req, res) => {
//     const { token } = req.params;
//     const { password } = req.body;

   
  
//     try {
//       const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
  
//       const user = await User.findByPk(decoded.userId);
//       if (!user) {
//         return res.status(404).send("Utilisateur introuvable.");
//       }

//       const passwordoptions = {
//         // Options pour le mot de passe
//         minLength: 12,
//         minUppercase: 1,
//         minNumbers: 1,
//         minSymbols: 1,
//       };
  
//       if (!validator.isStrongPassword(password, passwordoptions)) {
//        req.flash("error", "Le mot de passe doit contenir au moins 12 caractères, une minuscule, une majuscule, un chiffre et un caractère spécial.");
//        return res.render("reset-password", { token, messages: { error: req.flash("error") } });

//       }

//       // Hacher le nouveau mot de passe
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       // Mettre à jour le mot de passe de l'utilisateur
//       await user.update({ password: hashedPassword });
  
//       req.flash("success", "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.");
//       res.redirect("/login");
//     } catch (error) {
//       console.log(error.message);
//       // Affichage de l'erreur dans la page de signup ou une page d'erreur dédiée
//       res.render("error", { message: error.message, });
//     }   
//   },
// };

// export default authController;