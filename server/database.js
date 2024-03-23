const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// Simple query to check if the database is working
const checkDatabase = async () => {
  try {
    console.log("ENV: ", process.env.POSTGRES_URL);
    const client = await pool.connect();
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    // Close the connection pool
    await pool.end();
  }
};


module.exports = {
  pool
};