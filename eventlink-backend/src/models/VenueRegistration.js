const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Venue = require("./Venue");

const VenueRegistration = sequelize.define(
  "tbl_venue_registration",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    venue_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "pending",
    },
    notes: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "tbl_venue_registration",
    underscored: true,
    timestamps: true,
  }
);

VenueRegistration.belongsTo(Venue, { foreignKey: "venue_id", as: "venue" });

module.exports = VenueRegistration;
