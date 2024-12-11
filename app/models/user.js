import { DataTypes } from "sequelize"; // On importe la classe DataTypes depuis le package sequelize
import sequelize from "../config/database.js"; // On importe l'instance de sequelize créée dans le fichier database.js
import db from '../config/database.js';


// On créé un modèle user pour définir la structure de la table users dans la base de données.
// On utilise la méthode define() de l'instance sequelize pour définir le modèle User. 
// On précise le nom du modèle (user) et les attributs de la table (id, username, email, password).
// Chaque attribut est défini par un objet avec un type (DataTypes.STRING) et une propriété allowNull (false).
// La propriété allowNull indique si la valeur de l'attribut peut être nulle ou non.
// Par exemple, l'attribut username ne peut pas être nul, donc allowNull est à false.
// On exporte le modèle user pour pouvoir l'utiliser dans les autres fichiers de notre projet.

const User = sequelize.define("users", { // On définit le modèle user avec la méthode define() de l'instance sequelize
    id_user : {                               // On définit l'attribut id
        type: DataTypes.INTEGER,             // On précise le type de l'attribut id (INTEGER)
        autoIncrement: true,                // On précise que l'attribut id est auto-incrémenté
        primaryKey: true,                  // On précise que l'attribut id est la clé primaire de la table
    }, 
    first_name: {                          // On définit l'attribut first_name
        type: DataTypes.STRING,           // On précise le type de l'attribut username (STRING)
        allowNull: false,                // On précise que l'attribut username ne peut pas être nul (obligatoire).
    },
    last_name: {                               // On définit l'attribut last_name
        type: DataTypes.STRING,              // On précise le type de l'attribut username (STRING)
        allowNull: false,                   // On précise que l'attribut username ne peut pas être nul (obligatoire).
    },
    email: {                              // On définit l'attribut email
        type: DataTypes.STRING,          // On précise le type de l'attribut email (STRING)
        allowNull: false,                // On précise que l'attribut email ne peut pas être nul (obligatoire).
        unique: true,                   // Contrainte d'unicité             
    },
    password: {                       // On définit l'attribut password
        type: DataTypes.STRING,      // On précise le type de l'attribut password (STRING)
        allowNull: false,           // On précise que l'attribut password ne peut pas être nul (obligatoire).
    },
    
    date_of_birth: {                          // On définit l'attribut date_of_birth
        type: DataTypes.DATEONLY,            // On précise le type de l'attribut date_of_birth (DATEONLY)
        allowNull: false,                   // On précise que l'attribut date_of_birth ne peut pas être nul (obligatoire).
    },

    user_type: {                             // On définit l'attribut user_type
        type: DataTypes.STRING,             // On précise le type de l'attribut user_type (STRING)
        allowNull: false,                  // On précise que l'attribut user_type ne peut pas être nul (obligatoire).
    },

    language: {                           // On définit l'attribut language
        type: DataTypes.STRING,          // On précise le type de l'attribut language (STRING)
        allowNull: false,               // On précise que l'attribut language ne peut pas être nul (obligatoire).
    },

    currency : {                       // On définit l'attribut currency
        type: DataTypes.STRING,       // On précise le type de l'attribut currency (STRING)
        allowNull: false,            // On précise que l'attribut currency ne peut pas être nul (obligatoire).
                  
    },
  }, { 
    tableName: "users" , // On précise le nom de la table (users) dans la base de données
    timestamps: false, // On désactive createdAT et updatedAt dans la table users pour ne pas avoir de colonnes supplémentaires dans la table users
    });


    export default User; // On exporte le modèle user pour pouvoir l'utiliser dans les autres fichiers de notre projet.