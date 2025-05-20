const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Ticket = sequelize.define(
  "tbl_tickets",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING, // e.g. Free, VIP, General, Early Bird
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    available: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  },
  {
    tableName: "tbl_tickets",
    underscored: true,
    timestamps: true, // Enables created_at/updated_at auto-handling
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Add associations after model definition
Ticket.associate = (models) => {
  Ticket.belongsTo(models.Event, { foreignKey: "event_id" });
};

module.exports = Ticket;
