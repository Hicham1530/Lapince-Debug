
# Commandes essentielles pour gérer une base de données PostgreSQL

## 1. Commandes de connexion et de base de données
- **Se connecter à une base de données** :
  ```bash
  psql -U utilisateur -d nom_base
  ```
- **Lister toutes les bases de données** :
  ```sql
  \l
  ```
- **Créer une nouvelle base de données** :
  ```sql
  CREATE DATABASE nom_base;
  ```
- **Supprimer une base de données** :
  ```sql
  DROP DATABASE nom_base;
  ```
- **Changer de base de données (dans psql)** :
  ```sql
  \c nom_base
  ```

---

## 2. Gestion des utilisateurs
- **Créer un utilisateur** :
  ```sql
  CREATE USER nom_utilisateur WITH PASSWORD 'mot_de_passe';
  ```
- **Modifier le mot de passe d'un utilisateur** :
  ```sql
  ALTER USER nom_utilisateur WITH PASSWORD 'nouveau_mot_de_passe';
  ```
- **Supprimer un utilisateur** :
  ```sql
  DROP USER nom_utilisateur;
  ```
- **Lister les utilisateurs** :
  ```sql
  \du
  ```
- **Attribuer des privilèges sur une base de données** :
  ```sql
  GRANT ALL PRIVILEGES ON DATABASE nom_base TO nom_utilisateur;
  ```
- **Révoquer les privilèges** :
  ```sql
  REVOKE ALL PRIVILEGES ON DATABASE nom_base FROM nom_utilisateur;
  ```

---

## 3. Gestion des tables
- **Lister toutes les tables de la base de données courante** :
  ```sql
  \dt
  ```
- **Créer une table** :
  ```sql
  CREATE TABLE nom_table (
      colonne1 TYPE [CONTRAINTES],
      colonne2 TYPE [CONTRAINTES],
      ...
  );
  ```
  Exemple :
  ```sql
  CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      nom VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE
  );
  ```
- **Supprimer une table** :
  ```sql
  DROP TABLE nom_table;
  ```
- **Modifier une table** :
  - Ajouter une colonne :
    ```sql
    ALTER TABLE nom_table ADD colonne TYPE;
    ```
  - Supprimer une colonne :
    ```sql
    ALTER TABLE nom_table DROP COLUMN colonne;
    ```
  - Renommer une colonne ou une table :
    ```sql
    ALTER TABLE nom_table RENAME COLUMN ancienne_colonne TO nouvelle_colonne;
    ALTER TABLE ancienne_table RENAME TO nouvelle_table;
    ```

---

## 4. Manipulation des données
- **Insérer des données** :
  ```sql
  INSERT INTO nom_table (colonne1, colonne2, ...) VALUES (valeur1, valeur2, ...);
  ```
- **Mettre à jour des données** :
  ```sql
  UPDATE nom_table SET colonne1 = nouvelle_valeur WHERE condition;
  ```
- **Supprimer des données** :
  ```sql
  DELETE FROM nom_table WHERE condition;
  ```
- **Lire des données (requêtes SELECT)** :
  ```sql
  SELECT colonne1, colonne2 FROM nom_table WHERE condition;
  ```
  - Exemple avec tri :
    ```sql
    SELECT * FROM nom_table ORDER BY colonne1 ASC;
    ```

---

## 5. Contraintes et relations
- **Ajouter une clé étrangère** :
  ```sql
  ALTER TABLE nom_table ADD CONSTRAINT nom_contrainte FOREIGN KEY (colonne) REFERENCES autre_table(colonne);
  ```
- **Supprimer une contrainte** :
  ```sql
  ALTER TABLE nom_table DROP CONSTRAINT nom_contrainte;
  ```

---

## 6. Sauvegarde et restauration
- **Sauvegarder une base de données** :
  ```bash
  pg_dump -U utilisateur -F c -b -v -f fichier_sauvegarde nom_base
  ```
- **Restaurer une base de données** :
  ```bash
  pg_restore -U utilisateur -d nom_base fichier_sauvegarde
  ```

---

## 7. Autres commandes utiles
- **Voir la structure d'une table** :
  ```sql
  \d nom_table
  ```
- **Voir la structure des relations (tables, séquences, etc.)** :
  ```sql
  \d
  ```
- **Annuler une commande en cours** :
  Appuyez sur `CTRL + C`.
- **Quitter psql** :
  ```sql
  \q
  ```

---

## 8. Requêtes avancées
- **Regrouper et calculer des sommes/moyennes** :
  ```sql
  SELECT colonne, SUM(valeur) FROM nom_table GROUP BY colonne;
  ```
- **Joindre deux tables** :
  ```sql
  SELECT t1.colonne1, t2.colonne2
  FROM table1 t1
  JOIN table2 t2 ON t1.colonne = t2.colonne;
  ```

---

Avec ces commandes, vous avez tout ce qu'il faut pour bien gérer une base de données PostgreSQL. N'hésitez pas à demander des explications supplémentaires si nécessaire !
