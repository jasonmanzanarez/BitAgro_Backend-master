/** Administrator model */
const users = (sequelize, DataTypes) => {
  const Users = sequelize.define('users', {
    name: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    statusDelete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    confirmToken: {
      type: DataTypes.STRING
    },
    resetPasswordToken: {
      type: DataTypes.STRING
    }
  });
  Users.associate = models => {
    Users.hasMany(models.Human_Resources, { onDelete: 'CASCADE' });
    Users.hasMany(models.Lots, { onDelete: 'CASCADE' });
    Users.hasMany(models.Cycles, { onDelete: 'CASCADE' });
  };
  return Users;
};
module.exports = users;
