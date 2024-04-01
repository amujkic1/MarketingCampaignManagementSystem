const { query } = require("express");
const { Pool } = require("pg");
const { pool } = require("../database");

async function createCompany(name, logo){
    try{
        const client = await pool.connect();

        const query = {
            text: 'INSERT INTO companies(name, logo) VALUES ($1, $2)',
            values: [name, logo]
        };
        await client.query(query);
        client.release();
        console.log("Company created successfully!");
    }catch(error){
        console.error('Error creating company!', error);
    }
}

module.exports = {
    createCompany
};