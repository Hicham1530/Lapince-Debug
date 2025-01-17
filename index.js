import express from "express";// import session from "express-session";
import * as dotenv from "dotenv"; // On importe dotenv pour pouvoir lire le fichier.env
import router from "./app/router.js"; // On importe notre router créé et paramétré dans le fichier router.js
import  sequelize  from "./config/database.js"; // On importe l'instance de sequelize créée dans le fichier database.js
import User from "./app/models/user.js";
import Budget from "./app/models/budget.js";
import Mouvement from "./app/models/mouvement.js";
import Alerte from "./app/models/alert.js";
import userController from "./app/controllers/userController.js";
import session from "express-session"; // Importation du module express-session pour gérer les sessions
import validator from "validator";  // Importation du module validator pour valider les données






// Importation des contrôleurs pour les tests : 
import {
  createTestUser,
  getUserByEmail,
  updateUser,
  deleteUser,
} from "./app/controllers/userController.js";



// Rends disponible la variable process.env.PORT, parce qu'on a dans le .env une chaine de caractère PORT=3000
dotenv.config();

// Definition du port (soit celui du .env soit 3000)
const port = process.env.PORT || 3000;

// On créé l'application express
const app = express();




// Configuration de la session
app.use(session({
  secret: process.env.SECRET || 'defaultSecret', // Remplace 'defaultSecret' par une clé plus sécurisée en prod
  resave: false, // Ne pas sauvegarder la session si elle n'a pas été modifiée
  saveUninitialized: false, // Ne pas sauvegarder les sessions non initialisées
  cookie: { secure: false } // Mettre `true` si vous utilisez HTTPS
}));

app.get('/test-session', (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.send(`Nombre de vues : ${req.session.views}`);
  } else {
    req.session.views = 1;
    res.send("Bienvenue ! Rafraîchissez pour compter les vues.");
  }
});


// configurer le moteur de template
app.set("view engine", "ejs");

// chemin vers le dossier des views
app.set("views", "./app/views");
// Ajoute le console.log ici pour afficher le chemin configuré
console.log("Chemin configuré pour les vues : ", app.get("views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// On dit à express de rendre disponible tout les fichiers du dossier public, par exemple dans notre cas via une url type : localhost:3000/css/style.css
app.use(express.static('public'));

// sinon on peut faire comme ça

 import path from "path"; // On importe le module path de Node.js
const __dirname = path.resolve(); // Obtient le répertoire racine du  projet (le dossier où se trouve le fichier index.js) en utilisant la méthode resolve() du module path  de Node.js
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  console.log("État de la session à chaque requête :", req.session);
  console.log("Utilisateur connecté :", req.session.user);
  next();
});
app.use((req, res, next) => {
  res.locals.successMessage = req.session.successMessage || null;
  res.locals.errors = req.session.errors || null;
  req.session.successMessage = null; // Réinitialiser après transmission
  req.session.errors = null; // Réinitialiser après transmission
  next();
});
// On dit à express de prendre en compte notre router
app.use(router);    




// // Test de connexion à Sequelize
// (async () => {
//   try {
//     await sequelize.authenticate(); // Tester la connexion
//     console.log('Connexion à la base de données réussie !');
//   } catch (error) {
//     console.error('Impossible de se connecter à la base de données :', error);
//     process.exit(1); // Arrête l'application si la base de données est inaccessible
//   }
// })();



// test : Fonction principale pour exécuter les tests après la synchronisation
const runTests = async () => {
  try {
    // Test : Création d'un utilisateur
    await createTestUser();

    // Test : Récupération d'un utilisateur
    await getUserByEmail("newtest@example.com");

    // Test : Mise à jour d'un utilisateur
    await updateUser("newtest@example.com", { first_name: "UpdatedName" });

    // Test : Suppression d'un utilisateur
    await deleteUser("newtest@example.com");
  } catch (error) {
    console.error("Erreur lors des tests :", error);
  }
};

//  test : Synchronisation des modèles et lancement des tests
(async () => {
  try {
    // Test de connexion à la base
    await sequelize.authenticate();
    console.log("Connexion à la base de données réussie !");

    // Synchronisation des modèles
    await sequelize.sync({ force: false });
    console.log("Les modèles sont synchronisés avec la base de données.");

    // Lancement des tests
    await runTests();
  } catch (error) {
    console.error("Erreur lors de la synchronisation ou des tests :", error);
  }
})();


app.use((err, req, res, next) => {
  console.error("Erreur détectée :", err.message); // Affiche le message d'erreur
  console.error("Stack trace :", err.stack); // Affiche la pile d'appels complète

  // Ajoutez des informations sur la requête pour comprendre le contexte
  console.log("Requête URL :", req.originalUrl);
  console.log("Session utilisateur :", req.session ? req.session.user : "Aucune session");

  res.status(500).send("Erreur interne du serveur !");
});

// On demande à express d'ouvrir le serveur sur le port choisi.
app.listen(port, () => {  // On utilise la méthode listen() pour ouvrir le serveur sur le port 3000.
  console.log(`serveur lancé à cette url http://localhost:${port}`);  // On affiche un message de confirmation dans la console.
});
