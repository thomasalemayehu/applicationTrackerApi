const mongoose = require("mongoose");

const jobApplicationSchema = mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company is required to add"],
    },

    position: {
      type: String,
      required: [true, "Position is required to add"],
    },

    resumeVersionPath: {
      type: String,
      //   required: [true, "Resume is required to add"],
    },
    jobDescription: {
      type: String,
    },
    remark: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"user"
    },
  },
  {
    timestamps: true,
  }
);

const JobApplication = mongoose.model(
  "jobApplication",
  jobApplicationSchema
);

module.exports = JobApplication;
