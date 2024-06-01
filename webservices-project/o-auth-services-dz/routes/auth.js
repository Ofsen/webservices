function controller(req, res, provider) {
  if (provider === "local-login") {
    if (req.isAuthenticated()) {
      res.status(200).json({ ok: true });
    } else {
      res.status(203).json({ error: "Couldn't log in, please try again" });
    }
  } else {
    if (req.isAuthenticated()) {
      res.redirect("http://ofsen.io:5173/success");
    } else {
      res.redirect(
        "http://ofsen.io:5173/auth/login?error=" + "Couldn't log in, please try again"
      );
    }
  }
}

module.exports = function (app, passport) {
  function passportMiddleware(req, res, next, provider, options) {
    passport.authenticate(provider, options, function (err, user) {
      if (provider === "local-login") {
        if (err) {
          return res.status(203).json({ error: err });
        }
        if (!user) {
          console.error("user not found");
          return res.status(203).json({ error: "Something bad happened" });
        } else {
          req.logIn(user, function (err) {
            if (err) {
              return res.status(203).json({ error: "Couldn't log in, please try again" });
            }
            next();
          });
        }
      } else {
        if (err) {
          return res.redirect("http://ofsen.io:5173/auth/login?error=" + err);
        }
        if (!user) {
          return res.redirect(
            "http://ofsen.io:5173/auth/login?error=Something bad happened"
          );
        } else {
          req.logIn(user, function (err) {
            if (err) {
              return res.redirect(
                "http://ofsen.io:5173/auth/login?error=" +
                  "Couldn't log in, please try again"
              );
            }
            next();
          });
        }
      }
    })(req, res, next);
  }

  app.post(
    "/auth/login",
    (req, res, next) => passportMiddleware(req, res, next, "local-login"),
    (req, res) => controller(req, res, "local-login")
  );

  app.get(
    "/auth/facebook",
    (req, res, next) =>
      passportMiddleware(req, res, next, "facebook", { scope: ["email"] }),
    (req, res) => controller(req, res, "facebook")
  );

  app.get(
    "/auth/facebook/callback",
    (req, res, next) =>
      passportMiddleware(req, res, next, "facebook", { scope: ["email"] }),
    (req, res) => controller(req, res, "facebook")
  );

  app.get(
    "/auth/x",
    (req, res, next) => passportMiddleware(req, res, next, "twitter"),
    (req, res) => controller(req, res, "twitter")
  );

  app.get(
    "/auth/x/callback",
    (req, res, next) => passportMiddleware(req, res, next, "twitter"),
    (req, res) => controller(req, res, "twitter")
  );

  app.get(
    "/auth/google",
    (req, res, next) =>
      passportMiddleware(req, res, next, "google", { scope: ["profile", "email"] }),
    (req, res) => controller(req, res, "google")
  );

  app.get(
    "/auth/google/callback",
    (req, res, next) =>
      passportMiddleware(req, res, next, "google", { scope: ["profile", "email"] }),
    (req, res) => controller(req, res, "google")
  );

  app.get(
    "/auth/github",
    (req, res, next) => passportMiddleware(req, res, next, "github"),
    (req, res) => controller(req, res, "github")
  );

  app.get(
    "/auth/github/callback",
    (req, res, next) => passportMiddleware(req, res, next, "github"),
    (req, res) => controller(req, res, "github")
  );
};
