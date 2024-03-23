const { query } = require("express");
const { Pool } = require("pg");
const { pool } = require("../database");

async function findUser(emailOrPhone) {
  try {
    const client = await pool.connect();
    console.log(emailOrPhone);
    const user = await client.query(
      `SELECT * FROM  users WHERE email='${emailOrPhone}' OR phone='${emailOrPhone}'`
    );
    console.log("User: ", user);
    return user.rows[0];
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  findUser,
};
