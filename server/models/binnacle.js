/** Binnacle model */
const binnacle = (sequelize, DataTypes) => {
  const Binnacle = sequelize.define('binnacle', {
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
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

  Binnacle.associate = models => {
    Binnacle.belongsTo(models.Sowing);
    Binnacle.hasMany(models.Activities, { onDelete: 'CASCADE' });
  };
  return Binnacle;
};
module.exports = binnacle;
