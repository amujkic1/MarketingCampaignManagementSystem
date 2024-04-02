const router = require("express").Router();

const companyController = require("../controllers/companyController");

router.post("/admincompanies", companyController.findAdminsCompanies);

module.exports = router;