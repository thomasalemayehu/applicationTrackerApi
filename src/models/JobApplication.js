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
    payRange: {
      type: String,
    },
    location: {
      type: String,
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
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "user",
    },
    status: {
      type: String,
      default: "Applied",
      enum: [
        "Tracking",
        "Applied",
        "Phone Screen",
        "Interview",
        "Offer",
        "Accepted",
        "Rejected",
      ],
      required: true,
    },
    followUp: {
      type: String,
      default: "None",
      enum: [
        "None",
        "Research",
        "Website Follow Up",
        "Linkedin Follow Up",
        "Email",
        "Multiple Emails",
        "Phone",
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

jobApplicationSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
const JobApplication = mongoose.model("jobApplication", jobApplicationSchema);

module.exports = JobApplication;
