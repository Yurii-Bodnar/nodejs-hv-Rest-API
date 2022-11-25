const jwt = require("jsonwebtoken");
require("dotenv").config();

const authAutorization = (req, res, next) => {
  const [tokenType, token] = req.headers["authorization"].split(" ");

  if (!token) {
    return next(res.status(401).json({ message: "Not authorized" }));
  }
  try {
    const user = jwt.decode(token, process.env.JWT_SECRET);
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    next(res.status(401).json({ message: "Not authorized" }));
  }
};
module.exports = { authAutorization };
