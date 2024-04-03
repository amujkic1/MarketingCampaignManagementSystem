const router = require("express").Router();

const companyController = require("../controllers/companyController");

router.post("/admincompanies", companyController.findAdminsCompanies);
//router.post("/upload", companyController.uploadImage);

module.exports = router;