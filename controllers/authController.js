const User = require("../models/userModels");

const bcrypt = require("bcrypt");

exports.signUp = async (req, res, next) => {
  const { username, password } = req.body;
  const hashpassword = await bcrypt.hash(password, 12);

  try {
    const newUser = await User.create({
      username,
      password: hashpassword,
    });
    req.session.user = newUser;
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if (isCorrect) {
      req.session.user = user;
      res.status(201).json({
        status: "success",
      });
    } else {
      res.status(400).json({
        status: "incorrect username or password",
      });
    }
  } catch (e) {
    res.status(400).json({
      status: "fail",
    });
  }
};
