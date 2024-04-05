const { pool } = require("../database");
const Campaign = require("../models/campaign");

async function createCampaign(req, res) {
  const { name, durationfrom, durationto, mediatypes, channels } = req.body;
  try {
    const newCampaign = await Campaign.createCampaign(
      pool,
      name,
      durationfrom,
      durationto,
      mediatypes,
      channels
    );
    res.status(200).json({
      message: "Successfully created campaign",
      campaign: newCampaign,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Failed to create campaign" });
  }
}

async function getCampaigns(req, res) {
  try {
    const campaigns = await Campaign.getCampaigns(pool);
    res.status(200).json(campaigns);
  } catch {
    res
      .status(500)
      .json({ message: " Failed to return all campaigns from database" });
  }
}
async function getCampaignsById(req, res) {
  const { id } = req.params;
  try {
    const campaign = await Campaign.getCampaignsById(pool, id);
    res
      .status(200)
      .json({ message: "Successfuly returned campaign", campaign: campaign });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to return campaign from database" });
  }
}
async function updateCampaign(req, res) {
  const { id } = req.params;
  const { name, durationfrom, durationto } = req.body;
  try {
    const campaign = await Campaign.updateCampaign(pool, id, name, durationfrom, durationto);
    res.status(200).json({ message: "Successfuly updated campaign" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update campaign" });
  }
}

async function deleteCampaign(req, res) {
  try {
    const { id } = req.params;
    await Campaign.deleteCampaign(pool, id);
    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete campaign" });
  }
}

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignsById,
  updateCampaign,
  deleteCampaign,
};
