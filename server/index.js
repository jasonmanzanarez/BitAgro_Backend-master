const express = require('express');
const morgan= require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
const path = require('path');

/** DB */
const db = require('./config/database');

/** TEST db */
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error DB => ', err));

const server = express();

server.use(cors());
server.use(morgan('dev'));
server.use(bodyParser.json());
server.use('/api/v1', routes);
server.use(express.static(path.resolve(__dirname + '/public/')));

module.exports = server;
