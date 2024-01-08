const express = require("express");

const router = express.Router();
const jobApplicationController = require("../controllers/jobApplication.controller");
const multer = require("multer");
const multerStorageConfig = require("../config/multer.config");
const upload = multer({ storage: multerStorageConfig });

router.post(
  "/",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
  ]),
  jobApplicationController.addApplication
);
router.get("/", jobApplicationController.getAllApplications);
router.get("/search",jobApplicationController.searchApplicationByKeyword);
router.patch("/:id", jobApplicationController.updateApplicationById);
// router.get("/:id", jobApplicationController.getApplicationById);
// router.delete("/:id", jobApplicationController.deleteApplicationById);

module.exports = router;
