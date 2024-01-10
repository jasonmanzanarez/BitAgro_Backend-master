/** Lots model */
const cycles = (sequelize, DataTypes) => {
  const Cycles = sequelize.define('cycles', {
    name: {
      type: DataTypes.STRING
    },
    dateStart: {
      type: DataTypes.DATE
    },
    dateFinish: {
      type: DataTypes.DATE
    },
    crops: {
      type: DataTypes.ARRAY(DataTypes.STRING)
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

  Cycles.associate = models => {
    Cycles.belongsTo(models.User);
    Cycles.hasMany(models.Sowing, { onDelete: 'CASCADE' });
  };
  return Cycles;
};
module.exports =  cycles;
