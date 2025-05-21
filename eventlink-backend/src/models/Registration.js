const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Registration = sequelize.define(
  "tbl_registrations",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "tbl_users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "tbl_events",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    ticket_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "tbl_tickets",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tbl_registrations",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Registration;
