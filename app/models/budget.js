import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js"; // Importez le modèle `User`

const Budget = sequelize.define("Budget", {
  id_budget: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  amount_limit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
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
  tableName: "budget",
  timestamps: false,
});

User.hasMany(Budget, { foreignKey: "id_user" });
Budget.belongsTo(User, { foreignKey: "id_user" });

export default Budget;
