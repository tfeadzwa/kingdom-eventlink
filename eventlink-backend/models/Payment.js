const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.User, { foreignKey: "user_id" });
      Payment.belongsTo(models.Registration, { foreignKey: "registration_id" });
    }
  }
  Payment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: { type: DataTypes.UUID, allowNull: false },
      registration_id: { type: DataTypes.UUID, allowNull: false },
      reference: { type: DataTypes.STRING, allowNull: false, unique: true },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      poll_url: DataTypes.STRING,
      status: { type: DataTypes.STRING, defaultValue: "Created" },
      paynow_reference: DataTypes.STRING,
      payment_channel: DataTypes.STRING,
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "tbl_payments",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Payment;
};
