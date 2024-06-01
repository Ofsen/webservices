const { verify } = require("jsonwebtoken");
const { DZ_APP_ACCESS_SECRET } = process.env;

module.exports = async function (req, res, next) {
  if (req.method === "OPTIONS") return next();
  if (req.host === "ofsen.io") return next();

  if (!req.headers["x-api-key"])
    return res.status(401).json({ message: "Access Denied" });

  try {
    const token = req.headers["x-api-key"];
    var decoded = verify(token, DZ_APP_ACCESS_SECRET);
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Access Denied" });
  }

  req.locals = { api: decoded };
  next();
};
