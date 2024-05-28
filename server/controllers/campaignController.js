const { pool } = require("../database");
const Campaign = require("../models/campaign");
const archiver = require("archiver");
const fs = require("fs");
const axios = require("axios");
const mime = require("mime-types");

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

async function getCampaignMedia(req, res) {
  const { id } = req.params;
  console.log(req.params);
  try {
    const campaignMedia = await Campaign.getCampaignMedia(pool, id);
    console.log(campaignMedia);

    const archive = archiver("zip", { zlib: { level: 9 } });

    res.attachment(`campaign_${id}_media.zip`);
    res.status(200);

    archive.pipe(res);

    for (const media of campaignMedia) {
      if (media.url) {
        let response;
        switch (media.mediatype) {
          case "Video":
            response = await axios.get(media.url, { responseType: "stream" });
            archive.append(response.data, {
              name: `${media.mediatype}_${media.id}.mp4`,
            });
            break;
          case "Audio":
            response = await axios.get(media.url, { responseType: "stream" });
            archive.append(response.data, {
              name: `${media.mediatype}_${media.id}.mp3`,
            });
          case "Image":
            response = await axios.get(media.url, { responseType: "stream" });
            archive.append(response.data, {
              name: `${media.mediatype}_${media.id}.png`,
            });
            break;

          case "Banner":
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                  <title>Banner</title>
                </head>
                <body>
                  <a href="${media.banner_link}" target="_blank">
                    <img src="${media.url}" alt="Banner Image" style="display: block; max-width: 100%;" />
                  </a>
                </body>
                </html>
              `;

            archive.append(htmlContent, {
              name: `${media.mediatype}_${media.id}.html`,
            });
            break;
        }
      }
      else if (media.mediatype == "Link"){
        if (media.text !== null) {

          const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                  <title>Banner</title>
                </head>
                <body>
                  <a href="${media.text}" target="_blank">Link</a>
                </body>
                </html>
              `;

            archive.append(htmlContent, {
              name: `${media.mediatype}_${media.id}.html`,
           });
        } else {
          console.error("Text content is null for media:", media);
        }
      }
      else if (media.mediatype == "Text") {
        if (media.text !== null) {
          const textContent = media.text;
          archive.append(textContent, {
            name: `${media.mediatype}_${media.id}.txt`,
          });
        } else {
          console.error("Text content is null for media:", media);
        }
      }
    }

    archive.finalize();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to return mediatypes for certain campaign" });
  }
}

async function updateCampaign(req, res) {
  const { id } = req.params;
  const { name, durationfrom, durationto, mediatypes, channels, oldChannel } = req.body;
  try {
    const campaign = await Campaign.updateCampaign(
      pool,
      id,
      name,
      durationfrom,
      durationto,
      mediatypes,
      channels,
      oldChannel
    );
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

async function assignGroup(req, res) {
  try {
    const { region_name, campaign_names } = req.body; 
    console.log('region ', region_name);
    console.log('campaigns', campaign_names);

    if (!Array.isArray(campaign_names)) {
      return res.status(400).json({ error: "campaign_names must be an array" });
    }

    const assignments = await Promise.all(campaign_names.map(async (campaign) => {
      const campaignName = campaign.match(/^(.+?) \((.+?)\)$/)[1];
      const channels = campaign.match(/^(.+?) \((.+?)\)$/)[2];
      await Campaign.assignGroup(pool, region_name, campaignName, channels);
    }));

    res.status(200).json({ message: "Group assigned successfully" });
  } catch (error) {
    console.error("Unexpected error: ", error);
    res.status(500).json({ error: "Failed to assign group" });
  }
}


  async function getCampaignsByGroup(req, res) {
    try{
      const { group_id, channel } = req.body;
      console.log(req.body);
      const campaigns = await Campaign.getCampaignsByGroup(pool, group_id, channel);  
      res.status(200).json(campaigns);
    } catch(error) {
      res.status(500).json({ error: "Failed to get campaigns" });
    }
  }

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignsById,
  updateCampaign,
  deleteCampaign,
  getCampaignMedia,
  assignGroup,
  getCampaignsByGroup    
};
