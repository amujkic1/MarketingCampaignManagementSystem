const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { pool } = require('../database');

async function createUser(req, res) {
    try {
        const { username, password, email, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.createUser(pool, username, hashedPassword, email, phone);
        res.status(201).json({
            message: "User created successfully",
            user: newUser});
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
}
async function getAllUsers(req, res) {
    try {
        const allUsers = await User.getAllUsers(pool);
        console.log(allUsers);
        res.status(200).json(allUsers);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ error: 'Failed to retrieve all users' });
    }
}

async function getUserById(req, res) {
    try {
        const { id } = req.params;
        const user = await User.getUserById(pool, id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve the user' });
    }
}

async function updateUserById(req, res) {
    try {
        const { id } = req.params;
        const { username, password, email, phone, company_id } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.updateUserById(pool, id, username, hashedPassword, email, phone, company_id);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({
        message: "User updated successfully",
        user: updatedUser});
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
}

async function deleteUserById(req, res) {
    try {
        const { id } = req.params;
        await User.deleteUserById(pool, id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
}