/** Human resources model */
const human_resources = (sequelize, DataTypes) => {
  const Human_Resources = sequelize.define('humanResources', {
    name: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    salary: {
      type: DataTypes.FLOAT
    },
    address: {
      type: DataTypes.STRING
    },
    statusDelete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Human_Resources.associate = models => {
    Human_Resources.belongsTo(models.User);
    Human_Resources.hasMany(models.Activities, { onDelete: 'CASCADE' });
  };
  return Human_Resources;
};
module.exports = human_resources;
