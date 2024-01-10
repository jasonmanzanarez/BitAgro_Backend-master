const jwt = require('jsonwebtoken');
const { seedToken } =require('../config/keys');

//MiddleWare para verificar el token
let verifyToken = (req, res, next) => {
  let token = req.get('token');
  jwt.verify(token, seedToken, (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid Token');
    }
    //Se le envia el user que se creo en login al momento de crear el token
    req.user = decoded.user;
    next();
  });
};

module.exports = {
  verifyToken
};
