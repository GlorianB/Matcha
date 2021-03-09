require('dotenv').config();

config = {
  PGHOST : process.env.PGHOST,
  PGUSER : process.env.PGUSER,
  PGDATABASE : process.env.PGDATABASE,
  PGPASSWORD : process.env.PGPASSWORD,
  PGPORT : process.env.PGPORT
};

module.exports = config;
