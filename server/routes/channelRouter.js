const router = require("express").Router();

const channelController = require("../controllers/channelController");

router.post("/channel", channelController.createChannel);
router.get("/channel", channelController.getChannels);
router.get("/channel/:id", channelController.getChannelById);
router.delete("/channel/:id", channelController.deleteChannel);
router.put("/channel/:id", channelController.updateChannel);
router.get("/channel/:name/campaigns", channelController.getAllCampaignsForChannel);
router.get("/getchannel/:type", channelController.getChannelsByType);
router.post("/channel/addtogroup", channelController.addChannelsToGroup);

module.exports = router;
