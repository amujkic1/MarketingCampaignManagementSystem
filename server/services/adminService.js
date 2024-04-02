const { query } = require("express");
const { Pool } = require("pg");
const { pool } = require("../database");
const bcrypt = require("bcryptjs");

async function createAdmin(username, password, email, phone){

    try{

        const hashedPassword = await bcrypt.hash(password, 10);

        const client = await pool.connect();

        const query = {
            text: 'INSERT INTO users(username, password, email, phone, two_factor_enabled, role) VALUES ($1, $2, $3, $4, false, $5)',
            values: [username, hashedPassword, email, phone, 'admin']
        };
        await client.query(query);
        client.release();
        console.log("Admin created successfully!");

    } catch(error){
        console.error('Error creating admin!', error);
    }

}

async function getAdminByUsername(username){

    const query = "SELECT id FROM users WHERE username = $1 AND role = 'admin'"
    try{
        const client = await pool.connect();
        const result = await client.query(query, [username]);
        client.release();
        const adminId = result.rows[0];
        if (!adminId) {
          return null;
        }
        return adminId;      
    } catch(error){
        console.error(`Error fetching admin with username ${username}:`, error);
        throw error;
    }
}

module.exports = {
    createAdmin,
    getAdminByUsername
};