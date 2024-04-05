const { query } = require("express");
const { Pool } = require("pg");
const { pool } = require("../database");
const User = require("../models/user");

async function createCompany(name, username, niche, headquarters){
    try{

        const client = await pool.connect();

        const user = await User.getUser(pool, username);

        console.log(user);
        console.log('id', user.id);

        const companiesQuery = {
            text: 'INSERT INTO companies(name, admin_user_id, niche, headquarters) VALUES ($1, $2, $3, $4) RETURNING id',
            values: [name, user.id, niche, headquarters]
        };

        const result = await client.query(companiesQuery);
        console.log(result.rows[0].id);
        const companyID = result.rows[0].id;

        const adminQuery = {
            text: 'UPDATE users SET company_id = $1 WHERE id = $2',
            values: [companyID, user.id]
        };
        
        await client.query(adminQuery);

        client.release();
        console.log("Company created successfully!");
    }catch(error){
        console.error('Error creating company!', error);
    }
}


module.exports = {
    createCompany
};