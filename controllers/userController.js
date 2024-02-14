const asyncWrapper = require("../middleware/asyncWrapper");
const User = require("../models/userModel");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");

// Controller methods

const userController = {
  getAllUsers: asyncWrapper(async (req, res) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const users = await User.find({}, { __v: false, password: false })
      .limit(limit)
      .skip(skip);
    res.json({ status: httpStatusText.SUCCESS, data: { users } });
  }),

  registerUser: asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, password, role } = req.body;
    console.log("req.file -->", req.file);
    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
      const error = appError.create(
        "user already exists",
        400,
        httpStatusText.FAIL
      );
      return next(error);
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      avatar: req.file.filename,
    });

    // generate JWT token
    const token = await generateJWT({
      email: newUser.email,
      id: newUser._id,
      role: newUser.role,
    });
    newUser.token = token;

    await newUser.save();
    res
      .status(201)
      .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
  }),
  loginUser: asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email && !password) {
      const error = appError.create(
        "email and password are required",
        400,
        httpStatusText.FAIL
      );
      return next(error);
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      const error = appError.create("user not found", 400, httpStatusText.FAIL);
      return next(error);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = appError.create(
        "invalid password",
        400,
        httpStatusText.FAIL
      );
      return next(error);
    }

    // logged in successfully
    const token = await generateJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });
    user.token = token;
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { token } });
  }),
};

module.exports = userController;
