const express = require("express");

const router = express.Router();
const jobApplicationController = require("../controllers/jobApplication.controller");

router.post("/", jobApplicationController.addApplication);
router.get("/", jobApplicationController.getAllApplications);
router.get("/:id", jobApplicationController.getApplicationById);
router.delete("/:id", jobApplicationController.deleteApplicationById);
router.patch("/:id", jobApplicationController.updateApplicationById);

module.exports = router;
