const { query } = require("express");
const { Pool } = require("pg");
const { pool } = require("../database");

async function getUserRole(userId) {
    try {
        const client = await pool.connect();
        const query = "SELECT role FROM users WHERE id = $1";
        const result = await client.query(query, [userId]);
        client.release();
        return result.rows[0].role;
    } catch (error) {
        console.error('Error fetching user role:', error);
        throw error;
    }
}

module.exports = {
    getUserRole
}