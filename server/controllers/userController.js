// server/controllers/userController.js
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const saltRounds = 10; // number of hash salt rounds

//@desc Register a user
//@route POST  /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    res.status(400);
    throw new Error("There are empty fields");
  }

  const userAvailable = await User.findOne({ email: email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }

  const hashPassword = await bcrypt.hash(password, saltRounds);
  console.log("Hash Password is: " + hashPassword);

  // Create a new user instance
  const user = new User({
    userName,
    email,
    password: hashPassword,
  });

  // Save the user to the database
  const savedUser = await user.save();

  if (savedUser) {
    res.status(201).json({ _id: savedUser._id, email: savedUser.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

//@desc Login user
//@route POST  /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("There are empty fields");
  }

  const user = await User.findOne({ email: email });
  if (user && bcrypt.compare(password, user.password)) {
    // The details that are going to be on the token
    const accessToken = jwt.sign(
      {
        user: {
          username: user.userName,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }

  res.json({ message: "Login user" });
});

//@desc Current user information
//@route GET  /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
