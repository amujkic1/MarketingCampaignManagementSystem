const adminService = require("../services/adminService");
const companyService = require("../services/companyService");
const { pool } = require('../database');

async function createCompany(req, res){
    try{
        const { name, logo } = req.body; 
        try{
            await companyService.createCompany(name, logo);
        } catch(error){
            console.error('Database error:', error);
            res.status(500).json({ error: "Internal server error" });    
        }
        res.status(200).json({ message: "Company created successfully!" });
    } catch(error){
        console.error('Error creating company:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function createAdmin(req, res){

    try{
        const{username, password, email, phone} = req.body;
        try{
            await adminService.createAdmin(username, password, email, phone);
        } catch(error){
            console.error('Database:', error);
            res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json({ message: "Admin created successfully!" });
    } catch(error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ error: "Internal server error" });
    }

}


module.exports = {
    createCompany,
    createAdmin
}