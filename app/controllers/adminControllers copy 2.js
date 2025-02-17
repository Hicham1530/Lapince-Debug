// import Product from "../models/Product.js";
// import Essence from "../models/Essence.js";
// import User from "../models/User.js";
// import Order from "../models/Order.js";
// import { Op } from "sequelize";

// const adminController = {

//   adminHome: async function (req, res) {
//     try {
//       // Vérifie si la session est valide et si l'utilisateur est connecté  et si l'utilisateur est admin 
//       if (!req.session || !req.session.login || !req.session.login.id) {
//         return res.redirect("/login");
//       }

//       // Récupère l'utilisateur connecté
//       const userId = req.session.login.id;
//       const user = await User.findByPk(userId);
//       if (!user) {
//         return res.redirect("/login");
//       }
  
//       // Vérifie si l'utilisateur a le rôle admin
//       if (req.session.login.role !== "admin") {
//         return res.status(403).send("Accès interdit : droits insuffisants");
//       }
  
//       // Rend la page adminHome avec les données de l'utilisateur
//       res.render("adminHome", { user });
//     } catch (error) {
//       console.error("Erreur chargement profil :", error.message);
//       res.status(500).send("Erreur interne");
//     }
//   },
  

//   adminUserlist: async function (req, res) {

//     try {
   
//       // Récupère l'utilisateur connecté
//       const userId = req.session.login.id;
//       const user = await User.findByPk(userId);
//       if (!user) {
//         return res.redirect("/login");
//       }
  
//       // Vérifie si l'utilisateur a le rôle admin
//       if (req.session.login.role !== "admin") {
//         return res.status(403).send("Accès interdit : droits insuffisants");
//       }
  
//       // Récupère la liste des utilisateurs
//       const users = await User.findAll();
  
//       // Rend la page adminUserlist avec la liste des utilisateurs
//       res.render("adminUserlist", { users });
//     } catch (error) {
//       console.error("Erreur chargement liste utilisateurs :", error.message);
//       res.status(500).send("Erreur interne");
//     }

//   },

//   adminDelete: async function (req, res) {
//     try {
//       const userId = req.session.login.id;
//       const user = await User.findByPk(userId);
  
//       if (!user) {
//         return res.redirect("/login");
//       }
  
//       if (req.session.login.role !== "admin") {
//         return res.status(403).send("Accès interdit : droits insuffisants");
//       }
  
//       const idUrl = req.params.id;
//       const userDelete = await User.findByPk(idUrl);
  
//       if (!userDelete) {
//         return res.status(404).send("Utilisateur introuvable");
//       }
  
//       if (userId === parseInt(idUrl, 10)) {
//         return res.status(400).send("Vous ne pouvez pas supprimer votre propre compte.");
//       }
  
//       // Supprimer l'utilisateur
//       await userDelete.destroy();
  
//       req.flash("success", `Utilisateur ${userDelete.id} supprimé avec succès`);
//       // Rediriger vers la page de liste des utilisateurs
//       return res.redirect("/admin/userlist", );
//     } catch (error) {
//       console.error("Erreur suppression utilisateur :", error.message);
//       res.status(500).send("Erreur interne");
//     }
//   },
  

//   // controller pour afficher la page d'administration
//   adminProductlist: async function (req, res) {
//     try {
//       // Vérification des droits de l'utilisateur pour accéder à la page d'administration
     
//       const essences = await Essence.findAll(); // Récupère toutes les essences depuis la base de données
//       const products = await Product.findAll(); // Récupère tous les produits depuis la base de données

//       res.render("adminProductlist", {
//         essences,
//         products,
//         message: req.flash("success"),
//       });
//     } catch (error) {
//       console.error(error.message);
//       res.render("error", { message: error.message });
//     }
//   },

//   adminEdit: async function (req, res) {
//     try {
//       const products = await Product.findAll(); // Récupère tous les produits depuis la base de données
//       const essences = await Essence.findAll(); // Récupère toutes les essences depuis la base de données

//       res.render("adminProducts", { products, essences });
//     } catch (error) {
//       res.status(500).render("error", {
//         message: "Erreur lors de la récupération des produits.",
//       });
//     }
//   },

//   // controller pour ajouter un produit via le formulaire d'administration
//   adminAction: async function (req, res) {
//     try {
//       console.log("Action:", req.body.action);
//       const {
//         action,
//         product_name,
//         product_description,
//         product_family,
//         product_origin,
//         product_image,
//         product_price,
//       } = req.body;

//       if (action === "add") {
//         // Si l'action est "add", on ajoute un produit en base de données
//         if (
//           !product_name ||
//           !product_description ||
//           !product_origin ||
//           !product_image ||
//           !product_price ||
//           !product_family
//         ) {
//           // Si un des champs est vide, on renvoie une erreur
//           throw new Error("Tous les champs sont obligatoires.");
//         }

//         const product = await Product.create({
//           // Création d'un produit en base de données avec les données du formulaire d'ajout
//           name: product_name,
//           description: product_description,
//           price: product_price,
//           photo: product_image,
//           origin: product_origin,
//           id_essence: product_family,
//         });

//         if (!product) {
//           // Si la création du produit échoue, on renvoie une erreur
//           throw new Error("Erreur lors de la création du produit.");
//         }

//         // Message de succès pour l'utilisateur
//         req.flash("success", "Ajout du produit avec succès");
//         return res.redirect("/admin/productlist");
//       }
//     } catch (error) {
//       console.error("Erreur:", error.message);
//       res.render("error", { message: error.message });
//     }
//   },

//   // controller pour modifier un produit via le formulaire d'administration

//   adminUpdate: async function (req, res) {
//     const idUrl = req.params.id;
//     const products = await Product.findByPk(idUrl);
//     if (!products) {
//       return res.status(404).send("Produit introuvable.");
//     }

//     const essences = await Essence.findAll();

//     res.render("adminUpdate", { products, essences });
//   },

//   adminUpdateAction: async function (req, res) {
//     try {
//       const {
//         action_edit,
//         action_delete,
//         product_name,
//         product_description,
//         product_family,
//         product_origin,
//         product_image,
//         product_price,
//       } = req.body;
//       const idUrl = req.params.id;

//       const products = await Product.findByPk(idUrl);
//       if (!products) {
//         return res.status(404).send("Produit introuvable.");
//       }

//       if (action_edit === "edit") {
//         if (
//           !product_name ||
//           !product_description ||
//           !product_origin ||
//           !product_image ||
//           !product_price ||
//           !product_family
//         ) {
//           return res.status(400).send("Tous les champs sont obligatoires.");
//         }

//         await products.update({
//           name: product_name,
//           description: product_description,
//           price: product_price,
//           photo: product_image,
//           origin: product_origin,
//           id_essence: product_family,
//         });

//         req.flash("success", `Produit ${products.name} mis à jour avec succès`);
//         return res.redirect("/admin/productlist"); 
//       }

//       if (action_delete === "delete") {
//         await products.destroy();
//         req.flash("success", `Produit ${products.name} supprimé avec succès`);
//         return res.redirect("/admin/productlist");
//       }
//     } catch (error) {
//       console.error("Erreur:", error.message);
//       res.render("error", { message: error.message });
//     }
//   },
//   Orderlist: async function (req, res) {
//     const orders = await Order.findAll({
//       attributes: ["id", "id_user", "status", "date_order"], // Ajoutez `status` et `date_order`
//       include: [
//         {
//           model: Product,
//           attributes: ["id", "name", "price"], // Inclure les colonnes nécessaires des produits
//         },
//         {
//           model: User,
//           attributes: ["id", "firstname", "email", "role"], // Inclure le rôle de l'utilisateur
//           where: {
//             role: { [Op.ne]: "admin" }, // Exclure les administrateurs (ne correspond pas à "admin")
//           },
//         },
//       ],
//       group: [
//         "Order.id",
//         "Order.id_user",
//         "Order.status",
//         "Order.date_order",
//         "Products.id",
//         "User.id",
//       ], // Ajoutez les colonnes référencées
//     });

//     // Rendre la vue avec les commandes récupérées
//     return res.render("adminOrderlist", { orders });
//   },
// };

// export default adminController;
