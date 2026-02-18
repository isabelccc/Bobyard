// database connection
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'linl',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'comments_db',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error(' Database connection error:', err);
  } else {
    console.log('Connected to PostgreSQL');
  }
});

module.exports = pool;
