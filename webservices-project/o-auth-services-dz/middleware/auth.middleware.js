const publicPaths = [
  "/logout",
  "/auth/login",
  "/auth/signup",
  "/auth/facebook",
  "/auth/x",
  "/auth/google",
  "/auth/github",
  "/auth/facebook/callback",
  "/auth/x/callback",
  "/auth/google/callback",
  "/auth/github/callback",
  "/health",
  "/authenticated",
  "/",
];

module.exports = function () {
  return function (req, res, next) {
    if (publicPaths.indexOf(req.path) === -1 && !req.isAuthenticated()) {
      return res.status(401).json({ message: "Access Denied" });
    }

    next();
  };
};
