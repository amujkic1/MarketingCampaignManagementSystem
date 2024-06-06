const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'default',
  host: 'localhost',
  database: 'verceldb',
  password: 'vHBCIkr4Ael6',
  port: 5432,
});

module.exports = {
  pool
};