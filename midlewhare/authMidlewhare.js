const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../model/userModel");
const { schemaAuth } = require("../validationJoi/validationJoi");

const registration = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }
  const validation = schemaAuth.validate(req.body);

  if (validation.error) {
    return res.status(400).json({ message: "email is not valid" });
  }
  try {
    const newUser = new User({
      email,
      password: await bcrypt.hash(password, 10),
    });
    await newUser.save();

    res.status(201).json({ message: "success created", email, password });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    const validation = schemaAuth.validate(req.body);
    if (validation.error || !user) {
      return res.status(400).json({
        message: `No user with email '${email}' found , or email is not valid`,
      });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const userToken = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET
    );
    const signToken = await User.findByIdAndUpdate(user._id, {
      $set: { token: userToken },
    });
    res.status(200).json({
      token: userToken,
      user: { email, subscription: "starter" },
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const logOut = async (req, res) => {
  try {
    const { _id } = req.body;
    const user = await User.findById(_id);
    // findByIdAndUpdate(_id, { $set: { token: false } });
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    // res.status(200).json(user);
    const changedToken = await User.findByIdAndUpdate(user._id, {
      $set: { token: "" },
    });
    if (!changedToken.token) {
      return res.status(401).json({ message: "Not authorized" });
    }
    console.log(changedToken);
    res.status(204).json({ message: "ok" });
  } catch (err) {
    res.send(err.message);
  }
  // res.status(200).json(user);
};

const getcurrentUser = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token });
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    res
      .status(200)
      .json({ email: user.email, subscription: user.subscription });
  } catch (err) {
    res.send(err.message);
  }
};

module.exports = {
  registration,
  login,
  logOut,
  getcurrentUser,
};
