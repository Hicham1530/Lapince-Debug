import User from "../models/user.js";


// test : Fonction pour supprimer un utilisateur
export const deleteUser = async (email) => {
  try {
    // Vérifiez si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("Aucun utilisateur trouvé pour cet email :", email);
      return;
    }

    // Supprimez l'utilisateur
    await User.destroy({ where: { email } });
    console.log("Utilisateur supprimé avec succès.");
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
  }
};








// test : fonction pour mettre à jour un utilisateur 
export const updateUser = async (email, updates) => {
  try {
    const [updated] = await User.update(updates, { where: { email } });
    if (updated) {
      const updatedUser = await User.findOne({ where: { email } });
      console.log("Utilisateur mis à jour avec succès :", updatedUser.toJSON());
    } else {
      console.log("Aucun utilisateur trouvé pour cet email.");
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
  }
};



// test : fonction pour récupérer un utilisateur
export const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      console.log("Utilisateur trouvé :", user.toJSON());
  } else {
      console.log("Utilisateur introuvable.");
  
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
  }
};


////////

export async function createTestUser(emailToTest = "newtest@example.com") {
  try {
    // test : Vérifiez si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email: emailToTest } });

    if (existingUser) {
      console.log(`Un utilisateur avec l'email ${emailToTest} existe déjà :`, existingUser.toJSON());
    } else {
      const newUser = await User.create({
        first_name: "Test",
        last_name: "User",
        email: emailToTest,
        password: "password123",
        date_of_birth: "2000-01-01",
        user_type: "standard",
        language: "English",
        currency: "USD",
      });
      console.log("Nouvel utilisateur créé :", newUser.toJSON());
    }
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      console.error("Erreur : L'email existe déjà dans la base de données.");
    } else {
      console.error("Erreur inconnue :", error);
    }
  }
}



export default { createTestUser };
