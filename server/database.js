const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

// Simple query to check if the database is working
const checkDatabase = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() AS current_time');
    console.log('Database is working fine. Current time in the database:', result.rows[0].current_time);
    client.release(); 
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};


module.exports = {
  pool,
  checkDatabase, // Exporting checkDatabase function
};