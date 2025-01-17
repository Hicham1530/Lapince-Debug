import User from "../models/user.js";
import bcrypt from "bcrypt"; // Importation du module bcrypt pour chiffrer les mots de passe
import validator from 'validator'; // Ajout de cette ligne pour valider les emails


const profileController = {
  showProfile: (req, res) => {
    console.log("Session utilisateur avant affichage du profil :", req.session.user);
    if (!req.session.user) {
      console.error("Erreur : utilisateur non connecté.");
      return res.status(401).render("error", { message: "Accès interdit. Veuillez vous connecter." });
    }

  
    console.log("Affichage du profil pour l'utilisateur :", req.session.user);
  
    const successMessage = req.session.successMessage || null;
    const errors = req.session.errors || {};
    req.session.successMessage = null;
    req.session.errors = null;
  
    res.render("profile/profile", {
      user: req.session.user,
      successMessage,
      errors,
    });
  },

  updateProfile: async (req, res) => {
    console.log("Données reçues pour la mise à jour :", req.body);
    try {
      const { genre, prenom, nom, jour, mois, annee, pays } = req.body;
      // pour vérifier si la valeur de "pays" est bien reçue
      console.log("Valeur du pays reçue :", pays);


      const errors = {};
      if (!genre) errors.genre = "Le genre est obligatoire.";
      if (!prenom) errors.prenom = "Le prénom est obligatoire.";
      if (!nom) errors.nom = "Le nom est obligatoire.";
      if (!jour || !mois || !annee) errors.date_of_birth = "La date de naissance est obligatoire.";
      if (!pays) errors.pays = "Le pays est obligatoire.";
      console.log("Après mise à jour de la session :", req.session.user);
  
      const moisMapping = {
        Janvier: 1, Février: 2, Mars: 3, Avril: 4, Mai: 5, Juin: 6,
        Juillet: 7, Août: 8, Septembre: 9, Octobre: 10, Novembre: 11, Décembre: 12,
      };
      const moisIndex = moisMapping[mois];
      if (!moisIndex) errors.mois = "Le mois sélectionné est invalide.";
  
      const date_of_birth = `${annee}-${String(moisIndex).padStart(2, "0")}-${String(jour).padStart(2, "0")}`;
      const testDate = new Date(date_of_birth);
      if (testDate.getDate() !== Number(jour) || testDate.getMonth() + 1 !== moisIndex || testDate.getFullYear() !== Number(annee)) {
        errors.date_of_birth = "La date sélectionnée est invalide.";
      }
  
      if (Object.keys(errors).length > 0) {
        req.session.errors = errors;
        return res.redirect("/profile/profile");
      }
  
      const userId = req.session.user.id;
  
        // Ajoutez une valeur par défaut pour `user_type` si elle est absente
        const user_type = req.session.user.user_type || "utilisateur";

        console.log("Données avant mise à jour dans la base de données :", { genre, prenom, nom, date_of_birth, pays, user_type });
    
        // Mise à jour dans la base de données
        await User.update(
          { genre, first_name: prenom, last_name: nom, date_of_birth, pays, user_type }, 
          { where: { id_user: userId } }
        );
    
        console.log("Mise à jour effectuée pour l'utilisateur ID :", userId);
      console.log("Après mise à jour de la session :", req.session.user);
  
      // Récupération des données mises à jour
      const updatedUser = await User.findByPk(userId);
      console.log("Données utilisateur mises à jour dans la base de données :", updatedUser.toJSON());
  

      console.log("Après mise à jour de la session :", req.session.user);  // Logs pour débogage
  
   // Mettre à jour la session utilisateur (Cette modification garantit que les données proviennent directement de la base de données mise à jour, et pas uniquement du formulaire.)
    // Mise à jour de la session utilisateur avec conservation des valeurs existantes si non définies
    // Mise à jour de la session utilisateur
    req.session.user = {
      ...req.session.user,
      genre: updatedUser.genre,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      date_of_birth: updatedUser.date_of_birth,
      pays: updatedUser.pays,
      language: updatedUser.language,
      currency: updatedUser.currency,
      user_type: updatedUser.user_type, // Inclure user_type
    };

    console.log("Session mise à jour après modification :", req.session.user);

    req.session.successMessage = "Votre profil a été mis à jour avec succès.";
    console.log("Message de confirmation ajouté à la session :", req.session.successMessage);
    console.log("État de la session avant redirection :", req.session);
    res.redirect("/profile/profile");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil :", error);
    res.status(500).render("error", { message: "Erreur interne lors de la mise à jour du profil." });
  }
},




updatePassword: async (req, res) => {
  try {
    console.log("Données reçues pour la mise à jour du mot de passe :", req.body);

    const { "current-password": currentPassword, "new-password": newPassword, "confirm-password": confirmPassword } = req.body;

    if (!req.session.user || !req.session.user.id) {
      return res.status(401).render("error", { message: "Utilisateur non connecté." });
    }

    const userId = req.session.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).render("error", { message: "Utilisateur introuvable." });
    }

    // Vérifie si le mot de passe actuel est correct
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    console.log("Mot de passe actuel correct :", isPasswordValid);
    if (!isPasswordValid) {
      req.session.errors = { password: "Le mot de passe actuel est incorrect." };
      return res.redirect("/profile/password");
    }

    // Vérifie si les nouveaux mots de passe correspondent
    console.log("Nouveaux mots de passe identiques :", newPassword === confirmPassword);
    if (newPassword !== confirmPassword) {
      req.session.errors = { password: "Les nouveaux mots de passe ne correspondent pas." };
      return res.redirect("/profile/password");
    }

    // Hacher le nouveau mot de passe et le mettre à jour
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("Nouveau mot de passe après hachage :", hashedPassword);
    await User.update({ password: hashedPassword }, { where: { id_user: userId } });

    // Vérifie la mise à jour
const updatedUser = await User.findByPk(userId);
console.log("Valeur de 'pays' après la mise à jour dans la base de données :", updatedUser.pays);


req.session.successMessage = "Votre mot de passe a été mis à jour avec succès.";
res.redirect("/profile/password");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe :", error);
    res.status(500).render("error", { message: "Erreur interne." });
  }
},


updateEmail: async (req, res) => {
  try {
    console.log("Requête reçue pour mise à jour de l'email :", req.body);

    const { new_email, confirm_email, password } = req.body;

    // Vérification de la session utilisateur
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).render("error", { message: "Utilisateur non connecté." });
    }

    // Validation des données
    if (!new_email || !confirm_email) {
      req.session.errors = { email: "Les deux champs email sont obligatoires." };
      return res.redirect("/profile/email");
    }

    if (new_email !== confirm_email) {
      req.session.errors = { email: "Les emails ne correspondent pas." };
      return res.redirect("/profile/email");
    }

    if (!validator.isEmail(new_email)) {
      req.session.errors = { email: "Adresse email invalide." };
      return res.redirect("/profile/email");
    }

    const userId = req.session.user.id;

    // Vérification si l'email existe déjà
    const existingUser = await User.findOne({ where: { email: new_email } });
    if (existingUser) {
      req.session.errors = { email: "Cet email est déjà utilisé." };
      return res.redirect("/profile/email");
    }

    // Vérification du mot de passe
    const user = await User.findByPk(userId);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      req.session.errors = { email: "Mot de passe incorrect." };
      return res.redirect("/profile/email");
    }

    // Mise à jour dans la base de données
    await User.update({ email: new_email }, { where: { id_user: userId } });

    // Mise à jour de l'email dans la session utilisateur
    req.session.user.email = new_email;

    console.log("Email mis à jour avec succès :", new_email);
    req.session.successMessage = "Votre email a été mis à jour avec succès.";
    res.redirect("/profile/email");
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'email :", error);
    res.status(500).render("error", { message: "Erreur interne lors de la mise à jour de l'email." });
  }
},








    // Ajout des méthodes manquantes
    settings: (req, res) => {
      console.log("Route /profile/settings atteinte");
      console.log("Session utilisateur dans settings :", req.session);
    
      res.render("profile/settings", {
        user: req.session.user, // Passe les données utilisateur à la vue
        successMessage: req.session.successMessage || null // Passe le message de succès, s'il existe
      });
    },
    
    email: (req, res) => {
      console.log("Route /profile/email atteinte");
      console.log("Session utilisateur dans email :", req.session);
    
      const successMessage = req.session.successMessage || null;
      req.session.successMessage = null; // Supprime le message après l'affichage
    
      const errors = req.session.errors || {}; // Définit errors comme un objet vide si absent
      req.session.errors = null; // Supprime les erreurs après l'affichage
    
      res.render("profile/email", {
        user: req.session.user,
        successMessage,
        errors, // Passe les erreurs à la vue
      });
    },
    
    password: (req, res) => {
      console.log("Route /profile/password atteinte");
      console.log("Session utilisateur dans password :", req.session);
    
      const successMessage = req.session.successMessage || null;
      req.session.successMessage = null; // Supprime le message après l'affichage
    
      res.render("profile/password", {
        user: req.session.user,
        successMessage,
      });
    },
  }
export default profileController;