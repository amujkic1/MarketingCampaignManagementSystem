const { pool } = require("../database");
const adminService = require("../services/adminService");
const Company = require("../models/company");

async function findAdminsCompanies(req, res){
    
    try{
        const companies = await Company.getAdminCompanies(pool);    
        res.json(companies);
    } catch(error){
        console.error('Database error:', error);
        res.status(500).json({ error: "Internal server error" });
    }

}

module.exports = {
    findAdminsCompanies,
}