const router = require("express").Router();
const mediaController = require("../controllers/mediaController");

router.post('/media', mediaController.createMedia);
router.get('/media', mediaController.getAllMedia);
router.get('/media/:id', mediaController.getMediaById);
router.put('/media/:id', mediaController.updateMediaById);
router.delete('/media/:id', mediaController.deleteMediaById);
router.post('/addmediaurl', mediaController.addMediaURL);
router.delete('/deletecampaignurl/:id', mediaController.deleteCampaignURL);
router.delete('/deletemediaurl/:id', mediaController.deleteMediaURL);

module.exports = router;