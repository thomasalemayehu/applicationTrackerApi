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

    console.log(req.body);
    const { company, payRange, position, location, jobDescription, remark } =
      req.body;

    if (!company) throw new MissingAttributeError("Company");
    if (!position) throw new MissingAttributeError("Position");

    const { resume, coverLetter } = req.files;

    // Simplified object construction
    const applicationInfo = {
      company,
      position,
      userId: verifiedUserId,
      ...(payRange && { payRange }),
      ...(location && { location }),
      ...(jobDescription && { jobDescription }),
      ...(remark && { remark }),
      ...(resume && { resumePath: resume[0].path.replace("public", "") }),
      ...(coverLetter && {
        coverLetterPath: coverLetter[0].path.replace("public", ""),
      }),
    };

    const newApplication = await JobApplication.create(applicationInfo);

    res.status(200).json(newApplication);
  },
  getAllApplications: async (req, res) => {
    const { verifiedUserId } = req;

    console.log(verifiedUserId);

    if (!verifiedUserId) throw new UnAuthorizedAccessError("Please Login");
    let { page, size } = req.query;

    if (!page) page = 1;

    if (!size) size = 20;

    const skip = (page - 1) * size;

    const allApplications = await JobApplication.find({
      userId: verifiedUserId,
    })
      .skip(skip)
      .limit(size);

    res.status(200).json(allApplications);
  },

  searchApplicationByKeyword: async (req, res) => {
    const { verifiedUserId } = req;

    if (!verifiedUserId) throw new UnAuthorizedAccessError("Please Login");
    const { keyword } = req.query;

    let result;
    if (!keyword) {
      result = await JobApplication.find({}).limit(20);
    } else {
      result = await JobApplication.find({
        $and: [
          { userId: verifiedUserId },
          { $or: [{ company: keyword }, { position: keyword }] },
        ],
      }).limit(20);
    }

    res.status(200).json(result);
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

    const {
      company,
      position,
      payRange,
      location,
      jobDescription,
      remark,
      status,
      followUp,
    } = req.body;

    const { id } = req.params;

    if (!id) throw new MissingParameterError("Application info id");

    const updateInfo = {};
    if (company) updateInfo.company = company;
    if (position) updateInfo.position = position;
    if (payRange) updateInfo.payRange = payRange;
    if (location) updateInfo.location = location;
    if (jobDescription) updateInfo.jobDescription = jobDescription;
    if (remark) updateInfo.remark = remark;
    if (status) updateInfo.status = status;
    if (followUp) updateInfo.followUp = followUp;

    const result = await JobApplication.updateOne(
      {
        userId: verifiedUserId,
        _id: id,
      },
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
