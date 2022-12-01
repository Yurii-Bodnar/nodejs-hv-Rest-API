const { v4: uuidv4 } = require("uuid");
const Jimp = require("jimp");
const { User } = require("../model/userModel");

const randomName = uuidv4();

function updateImige(userImg) {
  Jimp.read(`tmp/${userImg}`)
    .then((user) => {
      return user
        .resize(250, 250)
        .quality(60)
        .write(`src/publick/avatars/${randomName}.jpg`);
    })
    .catch((err) => {
      console.error(err);
    });
}

const avatarUpload = async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Not authorized" });
  }
  const token = req.headers.authorization.split(" ");

  const user = await User.findOne({
    token: token[1],
  });
  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  try {
    await updateImige(req.file.originalname);
    await User.findByIdAndUpdate(user._id, {
      avatarURL: `http://localhost:3000/avatars/${randomName}.jpg`,
    });
    res
      .status(200)
      .json({ avatarURL: `http://localhost:3000/avatars/${randomName}.jpg` });
  } catch (err) {
    res.send(err.message);
  }
};
module.exports = {
  avatarUpload,
};
