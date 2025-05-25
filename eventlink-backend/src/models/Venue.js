const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Venue = sequelize.define(
  "tbl_venues",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    venue_type: {
      type: DataTypes.STRING(100),
    },
    amenities: {
      type: DataTypes.TEXT,
    },
    guest_capacity: {
      type: DataTypes.INTEGER,
    },
    address: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING(100),
    },
    state: {
      type: DataTypes.STRING(100),
    },
    country: {
      type: DataTypes.STRING(100),
    },
    postal_code: {
      type: DataTypes.STRING(20),
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
    },
    availability: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "active",
    },
    price_per_hour: {
      type: DataTypes.DECIMAL(10, 2),
    },
    price_per_day: {
      type: DataTypes.DECIMAL(10, 2),
    },
    price_currency: {
      type: DataTypes.STRING(10),
      defaultValue: "USD",
    },
    contact_phone: {
      type: DataTypes.STRING(20),
    },
    contact_email: {
      type: DataTypes.STRING(255),
    },
    image_url: {
      type: DataTypes.STRING(255),
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
    tableName: "tbl_venues",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Venue;
