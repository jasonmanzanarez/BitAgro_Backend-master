module.exports = {
  pgUser: process.env.PGUSER,
  pgHost: process.env.PGHOST,
  pgDatabase: process.env.PGDATABASE,
  pgPassword: process.env.PGPASSWORD,
  pgPort: process.env.PGPORT,
  seedToken: process.env.SEED,
  caducidadToken: process.env.CADUCIDAD_TOKEN,
  emailUser: process.env.EMAILUSER,
  passwordemailUser: process.env.PASSWORDEMAILUSER,
  emailHost: process.env.EMAILHOST,
  emailPort: process.env.EMAILPORT,
  emailSecure: process.env.EMAILSECURE === 'true' ? true : false,
  hostFront: process.env.HOSTFRONT,
  hostBack: process.env.HOSTBACK
};
