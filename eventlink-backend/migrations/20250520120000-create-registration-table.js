"use strict";

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable("tbl_registrations", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "tbl_users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      event_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "tbl_events",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      ticket_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "tbl_tickets",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    return queryInterface.dropTable("tbl_registrations");
  },
};
