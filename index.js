import express from "express";
// import session from "express-session";
import * as dotenv from "dotenv"; // On importe dotenv pour pouvoir lire le fichier.env
import router from "./app/router.js"; // On importe notre router créé et paramétré dans le fichier router.js
import  sequelize  from "./app/config/database.js"; // On importe l'instance de sequelize créée dans le fichier database.js
import User from "./app/models/user.js";
import Budget from "./app/models/budget.js";
import Mouvement from "./app/models/mouvement.js";
import Alerte from "./app/models/alerte.js";

// Rends disponible la variable process.env.PORT, parce qu'on a dans le .env une chaine de caractère PORT=3000
dotenv.config();

// Definition du port (soit celui du .env soit 3000)
const port = process.env.PORT || 3000;

// On créé l'application express
const app = express();

// configurer le moteur de template
app.set("view engine", "ejs");

// chemin vers le dossier des views
app.set("views", "./app/views/");

app.use(express.urlencoded({ extended: true }));

// On dit à express de rendre disponible tout les fichiers du dossier public, par exemple dans notre cas via une url type : localhost:3000/css/style.css
app.use(express.static('./public'));

// On dit à express de prendre en compte notre router
app.use(router);    

sequelize.sync({ force: false }) // Utilisez { force: true } seulement en développement pour recréer les tables
  .then(() => { // On utilise la méthode then() pour gérer le cas où la synchronisation est réussie.
    console.log("Les modèles sont synchronisés avec la base de données."); // On affiche un message de confirmation dans la console si la synchronisation est réussie.
  })
  .catch((err) => {   // On utilise la méthode catch() pour gérer les erreurs.
    console.error("Erreur lors de la synchronisation des modèles :", err);  // On affiche un message d'erreur dans la console si la synchronisation échoue.
  });

 



// On demande à express d'ouvrir le serveur sur le port choisi.
app.listen(port, () => {  // On utilise la méthode listen() pour ouvrir le serveur sur le port 3000.
  console.log(`serveur lancé à cette url http://localhost:${port}`);  // On affiche un message de confirmation dans la console.
});
