import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js";
import Budget from "./budget.js";

const Alerte = sequelize.define("Alerte", {
  id_alerte: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id_user",
    },
  },
  id_budget: {
    type: DataTypes.INTEGER,
    references: {
      model: Budget,
      key: "id_budget",
    },
  },
}, {
  tableName: "alerte",
  timestamps: false,
});

User.hasMany(Alerte, { foreignKey: "id_user" });
Alerte.belongsTo(User, { foreignKey: "id_user" });

Budget.hasMany(Alerte, { foreignKey: "id_budget" });
Alerte.belongsTo(Budget, { foreignKey: "id_budget" });

export default Alerte;
