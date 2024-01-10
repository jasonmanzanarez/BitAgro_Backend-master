const db = require('../config/database');
const DataTypes = require('sequelize').DataTypes;

const models = {
  User: require('./users')(db, DataTypes),
  Human_Resources: require('./human_resources')(db, DataTypes),
  Lots: require('./lots')(db, DataTypes),
  Cycles: require('./cycles')(db, DataTypes),
  Sowing: require('./sowing')(db, DataTypes),
  Finances: require('./finances')(db, DataTypes),
  Harvest: require('./harvest')(db, DataTypes),
  Binnacle: require('./binnacle')(db, DataTypes),
  Activities: require('./activities')(db, DataTypes),
  db: db
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

module.exports = models;
