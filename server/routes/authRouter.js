const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.get("/qrimage", authController.qrCode);
router.get("/set2FA", authController.set2FA);
router.get("/getUser", authController.getUser);

module.exports = router;
