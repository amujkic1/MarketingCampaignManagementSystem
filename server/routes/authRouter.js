const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/qrimage", authController.qrCode);
router.post("/set2FA", authController.set2FA);
router.post("/getUser", authController.getUser);
router.post("/logout", authController.logout);

module.exports = router;
