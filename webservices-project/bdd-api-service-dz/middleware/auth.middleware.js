const axios = require("axios");

module.exports = async function (req, res, next) {
  if (req.hostname === "ofsen.io") {
    req.locals = { user: "cookie" };
    return next();
  }

  if (req.locals.api) {
    req.locals = { user: "cookie" };
    return next();
  }

  const token = req.cookies["connect.sid"];
  if (!token) return res.status(401).json({ error: "Access Denied" });

  try {
    var authorization = await axios.get(process.env.DZ_APP_OAUTH_API + "/authenticated", {
      withCredentials: true,
      headers: {
        Cookie: "connect.sid=" + token,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something bad happened" });
  }

  if (!authorization.data.auth) return res.status(401).json({ error: "Access Denied" });

  req.locals = { user: authorization.data?.user };
  next();
};
