const express = require("express");
const router = express.Router();
const {
  registration,
  login,
  logOut,
  getcurrentUser,
  getVerificationUser,
  resendingLetter,
} = require("../../midlewhare/authMidlewhare");

router.post("/register", async (req, res, next) => {
  try {
    await registration(req, res);
  } catch (err) {
    res.send(err.message);
    next();
  }
});

router.post("/login", async (req, res, next) => {
  try {
    await login(req, res);
  } catch (err) {
    res.send(err.message);
    next();
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    await logOut(req, res);
  } catch (err) {
    res.send(err.message);
    next();
  }
});
router.get("/current", async (req, res, next) => {
  try {
    await getcurrentUser(req, res);
  } catch (err) {
    res.send(err.message);
    next();
  }
});
router.get("/verify/:verificationToken", async (req, res, next) => {
  try {
    await getVerificationUser(req, res);
  } catch (err) {
    res.send(err.message);
    next();
  }
});
router.post("/verify", async (req, res, next) => {
  try {
    await resendingLetter(req, res);
  } catch (err) {
    res.send(err.message);
    next();
  }
});
module.exports = router;
