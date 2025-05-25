"use strict";

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable("tbl_venues", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
      },
      venue_type: {
        type: Sequelize.STRING(100),
      },
      amenities: {
        type: Sequelize.TEXT,
      },
      guest_capacity: {
        type: Sequelize.INTEGER,
      },
      address: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING(100),
      },
      state: {
        type: Sequelize.STRING(100),
      },
      country: {
        type: Sequelize.STRING(100),
      },
      postal_code: {
        type: Sequelize.STRING(20),
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 7),
      },
      longitude: {
        type: Sequelize.DECIMAL(10, 7),
      },
      availability: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      status: {
        type: Sequelize.STRING(50),
        defaultValue: "active",
      },
      price_per_hour: {
        type: Sequelize.DECIMAL(10, 2),
      },
      price_per_day: {
        type: Sequelize.DECIMAL(10, 2),
      },
      price_currency: {
        type: Sequelize.STRING(10),
        defaultValue: "USD",
      },
      contact_phone: {
        type: Sequelize.STRING(20),
      },
      contact_email: {
        type: Sequelize.STRING(255),
      },
      image_url: {
        type: Sequelize.STRING(255),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable("tbl_venues");
  },
};
