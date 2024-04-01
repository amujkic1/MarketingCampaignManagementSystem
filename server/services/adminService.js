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

module.exports = {
    createAdmin
};