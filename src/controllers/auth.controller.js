const { MissingAttributeError } = require("../errors/errors");
const User = require("../models/User");
const JWTHandler = require("../utils/JWTHandler");
const controller = {
  register: async (req, res) => {
    const { fullName, userName, email, password } = req.body;

    if (!fullName) throw new MissingAttributeError("Name");
    else if (!email) throw new MissingAttributeError("Email");
    else if (!password) throw new MissingAttributeError("Password");

    const newUser = await User.create({ fullName, userName, email, password });
    const jwt = JWTHandler.generate({ id: newUser.id });
    res.status(201).json({
      id: newUser.id,
      fullName: newUser.fullName,
      userName: newUser.userName,
      email: newUser.email,
      token: jwt,
    });
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email) throw new MissingAttributeError("Email");
    else if (!password) throw new MissingAttributeError("Password");

    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).json({ message: "Invalid username and/or password" });
      return;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(404).json({ message: "Invalid email and/or password" });
      return;
    }

    const jwt = JWTHandler.generate({ id: user.id });

    res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      token: jwt,
    });
  },
};

module.exports = controller;
