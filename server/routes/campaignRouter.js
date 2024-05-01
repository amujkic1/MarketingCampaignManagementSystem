const router = require("express").Router();

const campaignController = require("../controllers/campaignController");

router.post("/campaign", campaignController.createCampaign);
router.get("/campaign", campaignController.getCampaigns);
router.get("/campaign/:id", campaignController.getCampaignsById);
router.put("/campaign/:id", campaignController.updateCampaign);
router.delete("/campaign/:id", campaignController.deleteCampaign);

router.get(
  "/request-campaign/:id/media/download",
  campaignController.getCampaignMedia
);

router.post("/campaign/assigngroup", campaignController.assignGroup);

module.exports = router;
