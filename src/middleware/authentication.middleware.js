const { UnAuthorizedAccessError } = require("../errors/errors");
const JWTHandler = require("../utils/JWTHandler");

module.exports = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");

    const bearerToken = bearer[1];


    const userId = JWTHandler.validate(bearerToken);

    if (!userId) throw new UnAuthorizedAccessError("Please Login");

    req.verifiedUserId = userId;

    next();
  } else {
    throw new UnAuthorizedAccessError("Please Login");
  }
};
