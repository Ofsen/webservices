module.exports = function (app) {
  app.get("/", (req, res) => {
    res.status(200).json({ connected: true });
  });

  app.get("/health", (req, res) => {
    res.status(200).send("OK");
  });

  app.get("/authenticated", (req, res) => {
    res.status(200).json({ auth: req.isAuthenticated(), user: req.user?.email });
  });

  app.get("/logout", function (req, res) {
    req.logout((err) => {
      if (err) {
        console.log(err);
      }
    });
    res.status(204).send("Logged out");
  });
};
