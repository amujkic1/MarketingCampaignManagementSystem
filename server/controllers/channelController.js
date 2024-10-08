const Channel = require("../models/channel");
const { pool } = require("../database");

async function createChannel(req, res) {
  const { name, channel } = req.body;
  try {
    const newChannel = await Channel.createChannel(pool, name, channel);
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
  const { name, channel } = req.body;
  try {
    const newChannel = await Channel.updateChannel(pool, name, channel, id);
    res.status(200).json({ message: "Updated channel", channel: newChannel });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update channel" });
  }
}

async function getAllCampaignsForChannel(req, res) {
  const { name } = req.params
  try {
    const allCampaigns = await Channel.getAllCampaignsForChannel(pool, name);
    res.status(200).json(allCampaigns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve all campaigns for a channel' });
  }
}

async function getChannelsByType(req, res) {
  const { type } = req.params;
  try {
    const channels = await Channel.getChannelsByType(pool, type);
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get channels by type' });
  }
}

async function addChannelsToGroup(req, res) {
  try{
    
    const { group_id, channel_ids } = req.body;
    console.log('usli u controller ', req.body);
    await Promise.all(channel_ids.map(async (channel_id) => {
      await Channel.addChannelToGroup(pool, group_id, channel_id);
    }));
    res.status(200).json({ message: "Channels added successfully" });
  } catch(error) {
    res.status(500).json({ error: "Failed to add channles to group" });
  }
}

module.exports = {
  createChannel,
  getChannels,
  getChannelById,
  deleteChannel,
  updateChannel,
  getAllCampaignsForChannel,
  getChannelsByType,
  addChannelsToGroup
};
