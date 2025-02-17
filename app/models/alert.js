import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import User from "./user.js";
import Budget from "./budget.js";

const alert = sequelize.define("alert", {
  id_alert: {
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
  tableName: "alert",
  timestamps: false,
});

User.hasMany(alert, { foreignKey: "id_user" });
alert.belongsTo(User, { foreignKey: "id_user" });

Budget.hasMany(alert, { foreignKey: "id_budget" });
alert.belongsTo(Budget, { foreignKey: "id_budget" });

export default alert;
