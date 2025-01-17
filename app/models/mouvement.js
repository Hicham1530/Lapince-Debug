import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import User from "./user.js"; // Importez le modèle `User`
import Budget from "./budget.js";



const Mouvement = sequelize.define("Mouvement", {
  id_mouvement: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  category: {
    type: DataTypes.STRING(50),
  },
  description: {
    type: DataTypes.TEXT,
  },
  transaction_type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [["debit", "credit"]],
    },
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id_user",
    },
  },
}, {
  tableName: "mouvement",
  timestamps: false,
});

User.hasMany(Mouvement, { foreignKey: "id_user" });
Mouvement.belongsTo(User, { foreignKey: "id_user" });

export default Mouvement;
