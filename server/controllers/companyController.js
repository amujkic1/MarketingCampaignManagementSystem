const { pool } = require("../database");
const adminService = require("../services/adminService");
const Company = require("../models/company");

async function findAdminsCompanies(req, res){

    try{
        const { username } = req.body;
        let adminId;
        try{
            const adminData = await adminService.getAdminByUsername(username);
            adminId = adminData.id; 
        } catch(error){
            console.error('Database error:', error);
            res.status(500).json({ error: "Internal server error" });
        }
        try{
            const companies = await Company.getAdminCompanies(pool, adminId);    
            res.json(companies);
        } catch(error){
            console.error('Database error:', error);
            res.status(500).json({ error: "Internal server error" });
        }

    } catch(error){
        console.error('Error:', error);
        res.status(400).json({ error: "Bad request" });
    }

}

async function uploadImage(req, res){
    try {
 
 

    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

module.exports = {
    findAdminsCompanies,
    uploadImage
}