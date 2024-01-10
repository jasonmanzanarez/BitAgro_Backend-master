const Sequelize = require('sequelize');
const keys = require('./keys');

const db = new Sequelize(keys.pgDatabase, keys.pgUser, keys.pgPassword, {
  host: keys.pgHost,
  dialect: 'postgres'
});

module.exports = db;