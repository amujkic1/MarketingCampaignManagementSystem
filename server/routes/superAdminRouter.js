// superAdminRouter.js

const router = require("express").Router();
const superController = require("../controllers/superAdminController");

router.post("/company", superController.createCompany);
router.post("/admin", superController.createAdmin);
router.get("/isSuperAdmin", superController.checkIsSuperAdmin);

module.exports = router;
