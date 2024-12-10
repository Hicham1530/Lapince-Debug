

import { Sequelize } from "sequelize"; // On importe la classe Sequelize depuis le package sequelize.
import * as dotenv from "dotenv"; // On importe dotenv pour pouvoir lire le fichier.env 

dotenv.config(); // On importe dotenv pour pouvoir lire le fichier.env et pour charger les variables d'environnement.

// On créé une instance de sequelize en lui passant les informations de connexion à la base de données.
// On utilise les variables d'environnement pour cacher les informations de connexion à la base de données.
const sequelize = new Sequelize(  
    process.env.DB_NAME,     // Nom de la base de données 
    process.env.DB_USER,     // Nom d'utilisateur de la base de données  
    process.env.DB_PASSWORD, // Mot de passe de la base de données        
    {
  host: process.env.DB_HOST,    // Adresse de la base de données (localhost dans notre cas ) 
  dialect: "postgres",  // On précise le dialecte de la base de données, ici postgres.
  logging: false, // On désactive les logs pour ne pas les afficher dans la console.        
});


// On créé une fonction asynchrone pour tester la connexion à la base de données.  
// Cette fonction est asynchrone car la connexion à la base de données est une opération asynchrone.
// On utilise la méthode authenticate() de l'instance sequelize pour tester la connexion à la base de données.
// Si la connexion est établie, on affiche un message de confirmation dans la console.
// Si une erreur survient, on affiche un message d'erreur dans la console.
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("La connexion à la base de données a été établie avec succès.");
  } catch (error) {
    console.error("Impossible de se connecter à la base de données:", error);
  }
};

testConnection(); // On appelle la fonction testConnection() pour tester la connexion à la base de données.




export default sequelize; // On exporte l'instance de sequelize pour pouvoir l'utiliser dans les autres fichiers de notre projet.