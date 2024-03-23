const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL ,
  })

// Simple query to check if the database is working
const checkDatabase = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() AS current_time');
    console.log('Database is working fine. Current time in the database:', result.rows[0].current_time);
    client.release(); 
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    // Close the connection pool
    await pool.end();
  }
};

const createTable = async () => {
    try {
      const client = await pool.connect();
      const query = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(20) NOT NULL
        )
      `;
      await client.query(query);
      console.log('Table "users" created successfully');
      client.release();
    } catch (error) {
      console.error('Error creating table:', error);
    } finally {
      await pool.end();
    }
  };

  
//  createTable();
//checkDatabase();

module.exports = {
  pool
};