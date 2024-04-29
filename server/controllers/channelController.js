const Channel = require("../models/channel");
const { pool } = require("../database");

async function createChannel(req, res) {
  const { name } = req.body;
  try {
    const newChannel = await Channel.createChannel(pool, name);
    res
      .status(201)
      .json({ message: " Successfully added channel", channel: newChannel });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while adding channel" });
  }
}

async function getChannels(req, res) {
  try {
    const channels = await Channel.getChannels(pool);
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ message: "Could not read channels from database" });
  }
}

async function getChannelById(req, res) {
  const { id } = req.params;
  try {
    const channel = await Channel.getChannelById(pool, id);
    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json("Could not read channel from database");
  }
}
async function deleteChannel(req, res) {
  const { id } = req.params;
  try {
    await Channel.deleteChannel(pool, id);
    res.status(200).json({ message: "Successfully deleted channel" });
  } catch (error) {
    res.status(500).json("Failed to delete channel");
  }
}
async function updateChannel(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const newChannel = await Channel.updateChannel(pool, name, id);
    res.status(200).json({ message: "Updated channel", channel: newChannel });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update channel" });
  }
}
async function getAllCampaignsForChannel(req, res) {
  const { id } = req.params
  try {
    const allCampaigns = await Channel.getAllCampaignsForChannel(pool, id);
    res.status(200).json(allCampaigns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve all campaigns for a channel' });
  }
}

module.exports = {
  createChannel,
  getChannels,
  getChannelById,
  deleteChannel,
  updateChannel,
  getAllCampaignsForChannel
};
