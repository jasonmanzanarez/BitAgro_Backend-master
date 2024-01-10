/** Lots model */
const lots = (sequelize, DataTypes) => {
  const Lots = sequelize.define('lots', {
    alias: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    numHas: {
      type: DataTypes.FLOAT
    },
    typeAdq: {
      type: DataTypes.STRING
    },
    cost: {
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

  Lots.associate = models => {
    Lots.belongsTo(models.User);
    Lots.hasMany(models.Sowing, { onDelete: 'CASCADE' });
  };
  return Lots;
};
module.exports = lots;
