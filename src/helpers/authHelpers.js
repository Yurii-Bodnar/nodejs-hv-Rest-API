const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMessage = async (verificationToken, email) => {
  const msg = {
    to: email,
    from: "yuriy.bodnar75@gmail.com",
    subject: "success verifycation",
    text: `Please confirm the verification localhost:3000/users/verify/:${verificationToken}`,
    html: `<strong>Please confirm the verification localhost:3000/users/verify/:${verificationToken}</strong>`,
  };
  return await sgMail.send(msg);
};

const token = (userId) => {
  const userToken = jwt.sign(
    {
      _id: userId,
    },
    process.env.JWT_SECRET
  );
  return userToken;
};

module.exports = { sendMessage, token };
