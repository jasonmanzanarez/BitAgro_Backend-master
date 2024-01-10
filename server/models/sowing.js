/** Sowing model */
const sowing = (sequelize, DataTypes) => {
  const Sowing = sequelize.define('sowing', {
    alias: {
      type: DataTypes.STRING
    },
    crops: {
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

  Sowing.associate = models => {
    Sowing.belongsTo(models.Lots);
    Sowing.belongsTo(models.Cycles);
    Sowing.hasOne(models.Finances, { onDelete: 'CASCADE' });
    Sowing.hasOne(models.Harvest, { onDelete: 'CASCADE' });
    Sowing.hasMany(models.Binnacle, { onDelete: 'CASCADE' });
  };
  return Sowing;
};
module.exports = sowing;
