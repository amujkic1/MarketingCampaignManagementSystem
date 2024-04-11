const Media = require('../models/media');
const { pool } = require('../database');

async function createMedia(req, res) {
    try {
        const { name } = req.body;
        const newMedia = await Media.createMedia(pool, name);
        res.status(201).json({
            message: "Media created successfully",
            media: newMedia});
    } catch (error) {
        res.status(500).json({ error: 'Failed to create media' });
    }
}

async function getAllMedia(req, res) {
    try {
        const allMedia = await Media.getAllMedia(pool);
        res.status(200).json(allMedia);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve all media' });
    }
}

async function getMediaById(req, res) {
    try {
        const { id } = req.params;
        const media = await Media.getMediaById(pool, id);
        if (!media) {
            return res.status(404).json({ error: 'Media not found' });
        }
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve media' });
    }
}

async function updateMediaById(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedMedia = await Media.updateMediaById(pool, name, id);
    if (!updatedMedia) {
      return res.status(404).json({ error: 'Media not found' });
    }
    res.status(200).json({
        message: "Media updated successfully",
        media: updatedMedia});
    } catch (error) {
        res.status(500).json({ error: 'Failed to update media' });
    }
}

async function getCampaignMedia(req, res){
    try{
       const { campaign_id } = req.params;
       console.log(campaign_id);
       const media = await Media.getCampaignMedia(pool, campaign_id);
       if (!media) {
        return res.status(404).json({ error: 'Media not found' });
        }
        res.status(200).json(media);
    } catch(error) {
        res.status(500).json({ error: 'Failed to fetch media' });
    }
}

async function deleteMediaById(req, res) {
    try {
        const { id } = req.params;
        await Media.deleteMediaById(pool, id);
        res.status(200).json({ message: 'Media deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete media' });
    }
}

async function addMediaURL(req, res) {
    try{
        const{ type, url, banner_link, campaign_id } = req.body;
        try{
            await Media.addMediaURL(pool, type, url, banner_link, campaign_id);
        }
        catch(error) {
            console.log(error);
        }
        
        res.status(200).json({ message: 'URL added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add URL' });
    }
}

async function deleteCampaignURL(req, res) {
    try{
        const { id } = req.params;
        await Media.deleteCampaignUrl(pool, id);
        res.status(200).json({ message: 'Media deleted successfully' });
    } catch(error) {
        res.status(500).json({ error: 'Failed to delete media' });
    }
}

async function deleteMediaURL(req, res) {
    try{
        const { id } = req.params;
        await Media.deleteMediaUrl(pool, id);
        res.status(200).json({ message: 'Media deleted successfully' });
    } catch(error) {
        res.status(500).json({ error: 'Failed to delete media' });
    }
}

async function addText(req, res) {
    try{
        const { campaign_id } = req.params;
        const { text, type } = req.body;

        await Media.addText(pool, text, campaign_id, type);
        res.status(200).json({ message: 'Media added successfully', text });
    } catch(error) {
        res.status(500).json({ error: 'Failed to add media' });
    }
}

module.exports = {
    createMedia,
    getAllMedia,
    getMediaById,
    updateMediaById,
    deleteMediaById,
    addMediaURL,
    deleteCampaignURL,
    deleteMediaURL,
    getCampaignMedia,
    addText
}