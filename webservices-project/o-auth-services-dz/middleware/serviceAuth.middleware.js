const { verify } = require("jsonwebtoken");
const { DZ_APP_ACCESS_SECRET } = process.env;

module.exports = async function (req, res, next) {
  if (
    req.method === "OPTIONS" ||
    req.url === "/auth/google" ||
    req.url.split("?")[0] === "/auth/google/callback" ||
    req.url === "/auth/facebook" ||
    req.url.split("?")[0] === "/auth/facebook/callback" ||
    req.url === "/auth/github" ||
    req.url.split("?")[0] === "/auth/github/callback" ||
    req.url === "/auth/x" ||
    req.url.split("?")[0] === "/auth/x/callback"
  )
    return next();
  if (req.hostname === "ofsen.io") return next();

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
