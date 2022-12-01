const express = require("express");
const multer = require("multer");
const path = require("path");
const { avatarUpload } = require("../../midlewhare/avatarMidlewhare");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("./tmp"));
  },
  filename: (req, file, cb) => {
    const [filename, extention] = file.originalname.split(".");
    cb(null, `${filename}.${extention}`);
  },
});

const uploadMidlewhare = multer({ storage });

router.patch(
  "/avatars",
  uploadMidlewhare.single("avatar"),

  async (req, res, next) => {
    try {
      await avatarUpload(req, res);
    } catch (err) {
      res.send(err.message);
    }
  }
);

module.exports = router;
