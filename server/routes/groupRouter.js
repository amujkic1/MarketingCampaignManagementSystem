const router = require("express").Router();

const groupController = require("../controllers/groupController");

router.post("/group", groupController.createGroup);
router.get("/groups", groupController.getAllGroups);

module.exports = router;