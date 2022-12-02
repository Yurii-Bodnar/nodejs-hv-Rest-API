const express = require("express");
const router = express.Router();
const {
  registration,
  login,
  logOut,
  getcurrentUser,
} = require("../../midlewhare/authMidlewhare");

router.post("/register", async (req, res, next) => {
  await registration(req, res);
});

router.post("/login", async (req, res, next) => {
  await login(req, res);
});

router.post("/logout", async (req, res, next) => {
  logOut(req, res);
});
router.get("/current", async (req, res, next) => {
  getcurrentUser(req, res);
});
module.exports = router;
