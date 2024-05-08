const { pool } = require("../database");
const Group = require("../models/group");

async function createGroup(req, res) {
    const {name, channel_type} = req.body;
    try{
        const newGroup = await Group.createGroup(pool, name, channel_type);
        res.status(200).json({ message: "Successfully created group", group: newGroup });
    } catch (error){
        console.log(error);
        res.status(500).json({ message: "Error creating group" });
    }
}

async function getAllGroups(req, res) {
    try{
        const regions = await Group.getAllGroups(pool);
        res.status(200).json(regions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error getting groups" });
    }
}

module.exports = {
    createGroup,
    getAllGroups
};