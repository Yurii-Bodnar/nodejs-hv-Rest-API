const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
const { User } = require("../model/userModel");
const { schemaAuth } = require("../validationJoi/validationJoi");
const { sendMessage, token } = require("../helpers/authHelpers");

const registration = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }
  const validation = schemaAuth.validate(req.body);
  if (validation.error) {
    return res.status(400).json({ message: "email is not valid" });
  }

  const secureUrl = gravatar.url(email, { s: "100", r: "x", d: "retro" }, true);
  try {
    const newUser = new User({
      email,
      password: await bcrypt.hash(password, 10),
      avatarURL: secureUrl,
      verificationToken: uuidv4(),
    });
    await newUser.save();
    await sendMessage(newUser.verificationToken, email);
    res
      .status(201)
      .json({
        message: "success created, please confirm your email",
        email,
        password,
      });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, verify: true });

    const validation = schemaAuth.validate(req.body);
    if (validation.error || !user) {
      return res.status(400).json({
        message: `No user with email '${email}' found , or email is not valid, or user unverified`,
      });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const userToken = token(user._id);
    await User.findByIdAndUpdate(user._id, {
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
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const changedToken = await User.findByIdAndUpdate(user._id, {
      $set: { token: "" },
    });
    if (!changedToken.token) {
      return res.status(401).json({ message: "Not authorized" });
    }
    res.status(204).json({ message: "ok" });
  } catch (err) {
    res.send(err.message);
  }
};

const getcurrentUser = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token });
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

const getVerificationUser = async (req, res) => {
  try {
    const { verificationToken } = req.params;
    const updateToken = verificationToken.split("").slice(1, 37).join("");
    const user = await User.findOne({
      verificationToken: updateToken,
    });
    if (!user.verificationToken) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndUpdate(user._id, {
      $set: { verificationToken: null, verify: true },
    });
    res.status(200).json({ message: "Verification successful" });
  } catch (err) {
    res.send(err.message);
  }
};

const resendingLetter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "missing required field email" });
    }
    const user = await User.findOne({ email });
    if (user.verify === true) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }
    await sendMessage(user.verificationToken, email);
    res.status(200).json({ message: "Verification email sent" });
  } catch (err) {
    res.send(err.message);
  }
};

module.exports = {
  registration,
  login,
  logOut,
  getcurrentUser,
  getVerificationUser,
  resendingLetter,
};
