/** Activities model */
const activities = (sequelize, DataTypes) => {
  const Activities = sequelize.define('activities', {
    name: {
      type: DataTypes.STRING
    },
    dateStart: {
      type: DataTypes.DATE
    },
    dateFinish: {
      type: DataTypes.DATE
    },
    resources: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    estimatedExpense: {
      type: DataTypes.FLOAT
    },
    actualExpense: {
      type: DataTypes.FLOAT
    },
    status: {
      type: DataTypes.ENUM(['En espera', 'Iniciada', 'Finalizada'])
    },
    statusDelete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Activities.associate = models => {
    Activities.belongsTo(models.Binnacle);
    Activities.belongsTo(models.Human_Resources);
  };
  return Activities;
};
module.exports = activities;
