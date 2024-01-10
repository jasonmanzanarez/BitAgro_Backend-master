/** Finances model */
const finances = (sequelize, DataTypes) => {
  const Finances = sequelize.define('finances', {
    budget: {
      type: DataTypes.FLOAT
    },
    expenditure: {
      type: DataTypes.FLOAT
    },
    gain: {
      type: DataTypes.FLOAT
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    statusDelete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Finances.associate = models => {
    Finances.belongsTo(models.Sowing);
    Finances.belongsTo(models.Harvest);
  };
  return Finances;
};
module.exports = finances;
