const {
  MissingAttributeError,
  UnAuthorizedAccessError,
  MissingParameterError,
} = require("../errors/errors");
const JobApplication = require("../models/JobApplication");
const JWTHandler = require("../utils/JWTHandler");

const controller = {
  addApplication: async (req, res) => {
    const { verifiedUserId } = req;

    if (!verifiedUserId) throw new UnAuthorizedAccessError("Please Login");

    const { company, position, jobDescription, remark } = req.body;

    if (!company) throw new MissingAttributeError("Company");
    if (!position) throw new MissingAttributeError("Position");
    if (!jobDescription) throw new MissingAttributeError("Job Description");
    if (!remark) throw new MissingAttributeError("Remark");

    const newApplication = await JobApplication.create({
      company,
      position,
      jobDescription,
      remark,
      userId: verifiedUserId,
    });

    res.status(200).json(newApplication);
  },
  getAllApplications: async (req, res) => {
    // const { verifiedUserId } = req;

    // if (!verifiedUserId) throw new UnAuthorizedAccessError("Please Login");
    let { page, size } = req.query;

    if (!page) page = 1;

    if (!size) size = 20;

    const skip = (page - 1) * size;

    const allApplications = await JobApplication.find({
      // userId: verifiedUserId,
    })
      .skip(skip)
      .limit(size);

    res.status(200).json(allApplications);
  },
  getApplicationById: async (req, res) => {
    const { verifiedUserId } = req;

    if (!verifiedUserId) throw new UnAuthorizedAccessError("Please Login");

    const { id } = req.params;

    if (!id) throw new MissingParameterError("Application info id");

    const application = await JobApplication.findOne({
      _id: id,
      userId: verifiedUserId,
    });

    res.status(200).json(application);
  },
  updateApplicationById: async (req, res) => {
    const { verifiedUserId } = req;

    if (!verifiedUserId) throw new UnAuthorizedAccessError("Please Login");

    const { company, position, jobDescription, remark } = req.body;

    const { id } = req.params;

    if (!id) throw new MissingParameterError("Application info id");

    const updateInfo = {};
    if (company) updateInfo.company = company;
    if (position) updateInfo.position = position;
    if (jobDescription) updateInfo.jobDescription = jobDescription;
    if (remark) updateInfo.remark = remark;

    const result = await JobApplication.updateOne(
      { userId: verifiedUserId, _id: id },
      { $set: updateInfo }
    );

    res.status(200).json(result);
  },
  deleteApplicationById: async (req, res) => {
    const { verifiedUserId } = req;

    if (!verifiedUserId) throw new UnAuthorizedAccessError("Please Login");

    const { id } = req.params;

    const application = await JobApplication.findByIdAndDelete({
      _id: id,
      userId: verifiedUserId,
    });

    res.status(200).json(application);
  },
};

module.exports = controller;
