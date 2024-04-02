const { query } = require("express");
const { Pool } = require("pg");
const { pool } = require("../database");

async function createCompany(name, logo, adminId){
    try{
        const client = await pool.connect();

        console.log('admin id', adminId);
        const companiesQuery = {
            text: 'INSERT INTO companies(name, logo, admin_user_id) VALUES ($1, $2, $3) RETURNING id',
            values: [name, logo, adminId]
        };

        const result = await client.query(companiesQuery);
        console.log(result.rows[0].id);
        const companyID = result.rows[0].id;

        const adminQuery = {
            text: 'UPDATE users SET company_id = $1 WHERE id = $2',
            values: [companyID, adminId]
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