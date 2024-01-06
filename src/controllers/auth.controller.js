const { MissingAttributeError } = require("../errors/errors");
const User = require("../models/User");
const JWTHandler = require("../utils/JWTHandler");
const controller = {
  register: async (req, res) => {
    console.log("Registering...")
    const { name, userName, email, password } = req.body;

    if (!name) throw new MissingAttributeError("Name");
    else if (!userName) throw new MissingAttributeError("Username");
    else if (!email) throw new MissingAttributeError("Email");
    else if (!password) throw new MissingAttributeError("Password");

    const newUser = await User.create({ name, userName, email, password });
    const jwt = JWTHandler.generate({ id: newUser.id });
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      userName: newUser.userName,
      email: newUser.email,
      token: jwt,
    });
  },
  login: async (req, res) => {
    const { userName, password } = req.body;

    if (!userName) throw new MissingAttributeError("Username");
    else if (!password) throw new MissingAttributeError("Password");

    const user = await User.findOne({ userName: userName });

    if (!user) {
      res.status(404).json({ message: "Invalid username and/or password" });
      return;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(404).json({ message: "Invalid username and/or password" });
      return;
    }

    const jwt = JWTHandler.generate({ id: user.id });

    res.status(200).json({
      id: user.id,
      name: user.name,
      userName: user.userName,
      email: user.email,
      token: jwt,
    });
  },
};

module.exports = controller;
