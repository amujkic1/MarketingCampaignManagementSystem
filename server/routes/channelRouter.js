const router = require("express").Router();

const channelController = require("../controllers/channelController");
const { updateChannel } = require("../models/channel");

router.post("/channel", channelController.createChannel);
router.get("/channel", channelController.getChannels);
router.get("/channel/:id", channelController.getChannelById);
router.delete("/channel/:id", channelController.deleteChannel);
router.put("/channel/:id", channelController.updateChannel);
router.get("/channel/:id/campaigns", channelController.getAllCampaignsForChannel)

module.exports = router;
