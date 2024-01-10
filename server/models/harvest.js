/** Harvest model */
const harvest = (sequelize, DataTypes) => {
  const Harvest = sequelize.define('harvest', {
    ton: {
      type: DataTypes.FLOAT
    },
    salePrice: {
      type: DataTypes.FLOAT
    },
    amount: {
      type: DataTypes.FLOAT
    },
    customer: {
      type: DataTypes.STRING
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

  Harvest.associate = models => {
    Harvest.belongsTo(models.Sowing);
    Harvest.hasOne(models.Finances, { onDelete: 'CASCADE' });
  };
  return Harvest;
};
module.exports =  harvest;
