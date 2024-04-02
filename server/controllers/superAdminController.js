const adminService = require("../services/adminService");
const companyService = require("../services/companyService");
const { pool } = require('../database');
const User = require("../models/user");
const jwt = require('jsonwebtoken');

async function createCompany(req, res){
    try{
        const { name, logo, adminId } = req.body; 
        try{
            await companyService.createCompany(name, logo, adminId);
        } catch(error){
            console.error('Database error:', error);
            res.status(500).json({ error: "Internal server error" });    
        }
        res.status(200).json({ message: "Company created successfully!" });
    } catch(error){
        console.error('Error creating company:', error);
        res.status(500).json({ error: "Internal server error!" });
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

async function checkIsSuperAdmin(req) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        const user = await User.getUserById(pool, userId);
        return user.role === 'superadmin';
    } catch (error) {
        console.error('Error checking superadmin status:', error);
        throw error;
    }
}

module.exports = {
    createCompany,
    createAdmin,
    checkIsSuperAdmin
}