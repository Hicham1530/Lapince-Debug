# La Pince - Application de Gestion de Finances Personnelles

La Pince est une application web conçue pour aider les utilisateurs à gérer leurs finances personnelles. Elle inclut des fonctionnalités de suivi des budgets, des transactions, et des alertes pour informer les utilisateurs en cas de dépassement de budget.

## Fonctionnalités

- **Gestion des utilisateurs** : Création et gestion des comptes utilisateurs avec des informations personnelles.
- **Suivi des budgets** : Permet de définir des budgets mensuels pour différentes catégories.
- **Suivi des mouvements financiers** : Enregistrement des transactions financières avec des détails tels que le montant, la catégorie, et le type (débit ou crédit).
- **Alertes financières** : Notifications pour signaler des événements importants comme un dépassement de budget.

## CREATE DATABASE lapince; : 
CREATE USER la_pince WITH PASSWORD 'lapince';
CREATE DATABASE lapince OWNER la_pince;
verification si la creation a ete bien faite : \l
deconnection du superuser et connection a la base de donnée : psql -U la_pince -d lapince
	•	L’utilisateur (-U la_pince).
	•	La base de données (-d lapince).

## Structure de la Base de Données

### Table `users`
Contient les informations des utilisateurs :
- `id_user` : Identifiant unique (clé primaire).
- `first_name` : Prénom.
- `last_name` : Nom.
- `email` : Adresse e-mail unique.
- `date_of_birth` : Date de naissance.
- `password` : Mot de passe (à hacher pour la production).
- `user_type` : Type d'utilisateur (ex. : `standard` ou `admin`).
- `language` : Langue préférée.
- `currency` : Devise préférée.
- `account_creation_date` : Date de création du compte.

Vérification des tables : \d
```sql 
lapince=> INSERT INTO "users" (first_name, last_name, email, date_of_birth, password, user_type, language, currency)
VALUES 
('John', 'Doe', 'john.doe@example.com', '1990-01-01', 'securepassword', 'standard', 'en', 'USD'),
('Marie', 'Dupont', 'marie.dupont@example.com', '1985-05-20', 'password123', 'standard', 'fr', 'EUR');
INSERT 0 2
lapince=> INSERT INTO "users" (first_name, last_name, email, date_of_birth, password, user_type, language, currency)
VALUES ('Hassan', 'El Fassi', 'hassan.elfassi@example.com', '1990-03-10', 'securepassword', 'standard', 'ar', 'MAD');
INSERT 0 1
lapince=> INSERT INTO "users" (first_name, last_name, email, date_of_birth, password, user_type, language, currency)
VALUES ('Émile', 'Tremblay', 'emile.tremblay@example.ca', '1988-11-02', 'bilingualpass', 'standard', 'fr-en', 'CAD');
INSERT 0 1

apres avoir fait le test de la suppression de l'id_user 3 voila comment on peut recrée un autre avec le meme id_user : 
INSERT INTO "users" (id_user, first_name, last_name, email, date_of_birth, password, user_type, language, currency)
VALUES (3, 'Nouhaila', 'Amrani', 'nouhaila.amrani@example.com', '1995-01-01', 'securepassword', 'standard', 'fr', 'EUR');
````


### Table `budget`
Enregistre les budgets des utilisateurs :
- `id_budget` : Identifiant unique (clé primaire).
- `category` : Catégorie du budget (ex. : Alimentation, Transport).
- `amount_limit` : Limite de montant.
- `id_user` : Référence à l'utilisateur (clé étrangère liée à `users`).

### Table `mouvement`
Enregistre les transactions financières :
- `id_mouvement` : Identifiant unique (clé primaire).
- `amount` : Montant de la transaction.
- `date` : Date de la transaction.
- `category` : Catégorie de la transaction.
- `description` : Description détaillée.
- `transaction_type` : Type de transaction (`debit` ou `credit`).
- `id_user` : Référence à l'utilisateur (clé étrangère liée à `users`).

### Vérifier le total des transactions par utilisateur

Calcule le total des transactions (debit et credit) pour chaque utilisateur :

SELECT 
    id_user, 
    SUM(CASE WHEN transaction_type = 'debit' THEN amount ELSE 0 END) AS total_debit,
    SUM(CASE WHEN transaction_type = 'credit' THEN amount ELSE 0 END) AS total_credit
FROM "mouvement"
GROUP BY id_user;


### Table `alerte`
Enregistre les alertes liées aux finances :
- `id_alerte` : Identifiant unique (clé primaire).
- `message` : Message de l'alerte.
- `type` : Type d'alerte (ex. : Dépassement de budget).
- `date_creation` : Date de création de l'alerte.
- `id_user` : Référence à l'utilisateur (clé étrangère liée à `users`).
- `id_budget` : Référence au budget concerné (clé étrangère liée à `budget`).


### Afficher les alertes par utilisateur

Tu peux grouper les alertes par utilisateur pour une vue organisée :

SELECT u.first_name, u.last_name, a.message, a.type, a.date_creation
FROM "alerte" a
JOIN "users" u ON a.id_user = u.id_user
ORDER BY u.id_user, a.date_creation;


## Scripts SQL pour la Base de Données

### Création des Tables

```sql
CREATE TABLE "users" (
    id_user SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL,
    language VARCHAR(20) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    account_creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "budget" (
    id_budget SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    amount_limit NUMERIC(10,2) NOT NULL,
    id_user INT NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE "mouvement" (
    id_mouvement SERIAL PRIMARY KEY,
    amount NUMERIC(10,2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    category VARCHAR(50),
    description TEXT,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('debit', 'credit')),
    id_user INT NOT NULL,
    CONSTRAINT fk_user_mouvement FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE "alerte" (
    id_alerte SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_user INT NOT NULL,
    id_budget INT,
    CONSTRAINT fk_user_alerte FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    CONSTRAINT fk_budget_alerte FOREIGN KEY (id_budget) REFERENCES budget(id_budget) ON DELETE CASCADE
);



## Ajout des Données :
```sql

INSERT INTO users (first_name, last_name, email, date_of_birth, password, user_type, language, currency)
VALUES ('John', 'Doe', 'john.doe@example.com', '1990-01-01', 'securepassword', 'standard', 'English', 'USD');

INSERT INTO budget (category, amount_limit, id_user)
VALUES ('Alimentation', 500.00, 1), ('Transport', 200.00, 1), ('Loisirs', 150.00, 1);

INSERT INTO mouvement (amount, date, category, description, transaction_type, id_user)
VALUES 
  (150.00, '2024-12-08', 'Alimentation', 'Courses alimentaires', 'debit', 1), 
  (2500.00, '2024-12-08', 'Salaire', 'Paiement de salaire', 'credit', 1);

INSERT INTO alerte (message, type, id_user, id_budget)
VALUES ('Vous avez dépassé votre budget alimentaire', 'dépassement de budget', 1, 1);

Requêtes Avancées: 
Total des Transactions par Mois : 

SELECT 
    id_user,
    transaction_type,
    EXTRACT(YEAR FROM date) AS year,
    EXTRACT(MONTH FROM date) AS month,
    SUM(amount) AS total_amount
FROM 
    mouvement
GROUP BY 
    id_user, transaction_type, year, month
ORDER BY 
    year, month, id_user, transaction_type;


Alertes avec Détails du Budget: 
SELECT 
    alerte.id_alerte, 
    alerte.message, 
    alerte.type, 
    alerte.date_creation, 
    budget.category AS budget_category, 
    budget.amount_limit
FROM 
    alerte
LEFT JOIN 
    budget ON alerte.id_budget = budget.id_budget;



1. Total des débits/crédits par utilisateur :
SELECT 
    id_user,
    transaction_type,
    SUM(amount) AS total_amount
FROM 
    mouvement
GROUP BY 
    id_user, transaction_type
ORDER BY 
    id_user, transaction_type;




2. Total des débits/crédits par mois et utilisateur :
SELECT 
    id_user,
    transaction_type,
    EXTRACT(YEAR FROM date) AS year,
    EXTRACT(MONTH FROM date) AS month,
    SUM(amount) AS total_amount
FROM 
    mouvement
GROUP BY 
    id_user, transaction_type, year, month
ORDER BY 
    year, month, id_user, transaction_type;

3. Total global des débits et crédits :
    SELECT 
    transaction_type,
    SUM(amount) AS total_amount
FROM 
    mouvement
GROUP BY 
    transaction_type;

4. Solde par utilisateur :

SELECT 
    id_user,
    SUM(CASE WHEN transaction_type = 'credit' THEN amount ELSE 0 END) AS total_credit,
    SUM(CASE WHEN transaction_type = 'debit' THEN amount ELSE 0 END) AS total_debit,
    SUM(CASE WHEN transaction_type = 'credit' THEN amount ELSE 0 END) -
    SUM(CASE WHEN transaction_type = 'debit' THEN amount ELSE 0 END) AS balance
FROM 
    mouvement
GROUP BY 
    <!-- id_user; -->
    ```
