import express from "express";// import session from "express-session";
import * as dotenv from "dotenv"; // On importe dotenv pour pouvoir lire le fichier.env
import router from "./app/router.js"; // On importe notre router créé et paramétré dans le fichier router.js
import  sequelize  from "./app/config/database.js"; // On importe l'instance de sequelize créée dans le fichier database.js
import User from "./app/models/user.js";
import Budget from "./app/models/budget.js";
import Mouvement from "./app/models/mouvement.js";
import Alerte from "./app/models/alerte.js";
import userController from "./app/controllers/userController.js";




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

// configurer le moteur de template
app.set("view engine", "ejs");

// chemin vers le dossier des views
app.set("views", "./app/views");

app.use(express.urlencoded({ extended: true }));

// On dit à express de rendre disponible tout les fichiers du dossier public, par exemple dans notre cas via une url type : localhost:3000/css/style.css
app.use(express.static('public'));

// sinon on peut faire comme ça

 import path from "path"; // On importe le module path de Node.js
const __dirname = path.resolve(); // Obtient le répertoire racine de ton projet (le dossier où se trouve le fichier index.js) en utilisant la méthode resolve() du module path  de Node.js
app.use(express.static(path.join(__dirname, 'public')));



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




// On demande à express d'ouvrir le serveur sur le port choisi.
app.listen(port, () => {  // On utilise la méthode listen() pour ouvrir le serveur sur le port 3000.
  console.log(`serveur lancé à cette url http://localhost:${port}`);  // On affiche un message de confirmation dans la console.
});
