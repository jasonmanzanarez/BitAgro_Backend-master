const server = require('./server');
const db = require('./server/config/database');

const PORT = process.env.PORT || 5000;
/** ERASE DATABASE WHEN THE SERVER STARTS **/
const eraseDatabaseOnSync = false;

db.sync({ force: eraseDatabaseOnSync }).then(async () => {
  server.listen(PORT, () => console.log(`server is running at ${PORT}`));
});
