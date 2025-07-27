import User from "../models/user.js";
import bcrypt from "bcrypt"; // Importation du module bcrypt pour chiffrer les mots de passe
import validator from 'validator'; // Ajout de cette ligne pour valider les emails

const profileController = {
  // Affichage de la page de profil utilisateur
showProfile: (req, res) => {
  if (!req.session.user) {
    return res.status(401).render("error", { message: "Accès interdit. Veuillez vous connecter." });
  }
  res.render("profile/profile", { user: req.session.user });
},

  // Mise à jour du profil utilisateur
  updateProfile: async (req, res) => {
    console.log("Données reçues pour la mise à jour :", req.body);
    try {
      const { genre, prenom, nom, jour, mois, annee, pays } = req.body;
      // pour vérifier si la valeur de "pays" est bien reçue
      console.log("Valeur du pays reçue :", pays);

      const errors = {}; // On crée un objet pour stocker les erreurs potentielles

      if (!genre) errors.genre = "Le genre est obligatoire.";
      if (!prenom) errors.prenom = "Le prénom est obligatoire.";
      if (!nom) errors.nom = "Le nom est obligatoire.";
      if (!jour || !mois || !annee) errors.date_of_birth = "La date de naissance est obligatoire.";
      if (!pays) errors.pays = "Le pays est obligatoire.";
      console.log("Après mise à jour de la session :", req.session.user);

      const moisMapping = { // Mapping pour convertir le nom du mois en chiffre
        Janvier: 1, Février: 2, Mars: 3, Avril: 4, Mai: 5, Juin: 6,
        Juillet: 7, Août: 8, Septembre: 9, Octobre: 10, Novembre: 11, Décembre: 12,
      };
      const moisIndex = moisMapping[mois];
      if (!moisIndex) errors.mois = "Le mois sélectionné est invalide.";

      const date_of_birth = `${annee}-${String(moisIndex).padStart(2, "0")}-${String(jour).padStart(2, "0")}`; // On construit la date au format ISO
      const testDate = new Date(date_of_birth);
      if (testDate.getDate() !== Number(jour) || testDate.getMonth() + 1 !== moisIndex || testDate.getFullYear() !== Number(annee)) {
        errors.date_of_birth = "La date sélectionnée est invalide."; // On vérifie la validité de la date
      }

      if (Object.keys(errors).length > 0) { // S'il y a des erreurs, on les stocke et on retourne au formulaire
        req.session.errors = errors;
        return res.redirect("/profile/profile");
      }

      const userId = req.session.user.id; // On récupère l'id de l'utilisateur courant

      // Ajoutez une valeur par défaut pour `user_type` si elle est absente
      const user_type = req.session.user.user_type || "utilisateur";

      console.log("Données avant mise à jour dans la base de données :", { genre, prenom, nom, date_of_birth, pays, user_type });

      // Mise à jour dans la base de données avec Sequelize
      await User.update(
        { genre, first_name: prenom, last_name: nom, date_of_birth, pays, user_type }, 
        { where: { id_user: userId } }
      );

      console.log("Mise à jour effectuée pour l'utilisateur ID :", userId);
      console.log("Après mise à jour de la session :", req.session.user);

      // Récupération des données mises à jour
      const updatedUser = await User.findByPk(userId);
      console.log("Données utilisateur mises à jour dans la base de données :", updatedUser.toJSON());

      // On met à jour la session utilisateur pour que les nouvelles infos soient prises en compte partout
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

      // console.log("Session mise à jour après modification :", req.session.user);

      req.session.successMessage = "Votre profil a été mis à jour avec succès."; // On met un message de succès dans la session (flash)
      // console.log("Message de confirmation ajouté à la session :", req.session.successMessage);
      // console.log("État de la session avant redirection :", req.session);

      res.redirect("/profile/profile"); // On redirige pour afficher le message à l'utilisateur
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      res.status(500).render("error", { message: "Erreur interne lors de la mise à jour du profil." }); // Gestion des erreurs serveur
    }
  },

  // Mise à jour du mot de passe utilisateur
  updatePassword: async (req, res) => {
    try {
      console.log("Données reçues pour la mise à jour du mot de passe :", req.body);

      const { "current-password": currentPassword, "new-password": newPassword, "confirm-password": confirmPassword } = req.body;

      if (!req.session.user || !req.session.user.id) { // Vérifie que l'utilisateur est bien connecté
        return res.status(401).render("error", { message: "Utilisateur non connecté." });
      }

      const userId = req.session.user.id;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).render("error", { message: "Utilisateur introuvable." }); // Vérifie que l'utilisateur existe
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
      // On supprime les espaces invisibles au début/fin
      const passwordToCheck = newPassword.trim();
      console.log("Mot de passe reçu pour validation:", JSON.stringify(passwordToCheck));

      // Vérifie la force du nouveau mot de passe (sécurité renforcée)
const passwordIsStrong = validator.isStrongPassword(passwordToCheck, {
  minLength: 12,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1
});
if (!passwordIsStrong) {
  req.session.errors = { password: "Le nouveau mot de passe ne respecte pas les exigences de sécurité (12 caractères, majuscule, minuscule, chiffre, symbole)." };
  return res.redirect("/profile/password");
}
      // Hacher le nouveau mot de passe et le mettre à jour
      const hashedPassword = await bcrypt.hash(passwordToCheck, 10);

      console.log("Nouveau mot de passe après hachage :", hashedPassword);
      await User.update({ password: hashedPassword }, { where: { id_user: userId } });

      // Vérifie la mise à jour
      const updatedUser = await User.findByPk(userId);
      console.log("Valeur de 'pays' après la mise à jour dans la base de données :", updatedUser.pays);

      console.log("Je mets le message dans la session !");
      req.session.successMessage = "Votre mot de passe a été mis à jour avec succès.";
      req.session.save(() => { // On force la sauvegarde de la session avant redirection
        res.redirect("/profile/password");
      });

    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe :", error);
      res.status(500).render("error", { message: "Erreur interne." });
    }
  },

  // Mise à jour de l'email utilisateur
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
req.session.save(() => {
  res.redirect("/profile/email");
   });// Redirection vers la page email (le message s'affichera grâce au flash)
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'email :", error);
      res.status(500).render("error", { message: "Erreur interne lors de la mise à jour de l'email." });
    }
  },
updateSettings: async (req, res) => {
  try {
    // Ici tu mets la logique pour mettre à jour les paramètres (langue, devise…)
    const { 'interface-langue': language, devise, convertir_montants } = req.body;
    const userId = req.session.user.id;

    // Met à jour dans la BDD (adapte pour tes champs)
    await User.update(
      { language, currency: devise, convertir_montants: !!convertir_montants },
      { where: { id_user: userId } }
    );

    // Mets à jour la session aussi (optionnel mais conseillé)
    req.session.user.language = language;
    req.session.user.currency = devise;
    req.session.user.convertir_montants = !!convertir_montants;

    // Mets le message flash
    req.session.successMessage = "Les paramètres ont été mis à jour avec succès.";
    res.redirect("/profile/settings");
  } catch (error) {
    req.session.errors = { password: "Erreur lors de la mise à jour des paramètres." };
    res.redirect("/profile/settings");
  }
},

  // Affiche la page des paramètres du profil
settings: (req, res) => {
  res.render("profile/settings", { user: req.session.user });
},
  // Affiche la page de modification d'email
// profileController.js

email: (req, res) => {
  res.render("profile/email", { user: req.session.user });
},

  // Affiche la page de modification du mot de passe
password: (req, res) => {
  res.render("profile/password", { user: req.session.user });
},

}
export default profileController;
