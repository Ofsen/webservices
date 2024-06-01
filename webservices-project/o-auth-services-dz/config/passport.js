const axios = require("axios").default;
const bcrypt = require("bcrypt");

const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GithubStrategy = require("passport-github2").Strategy;

module.exports = function (passport) {
  // LOCAL LOGIN
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, username, password, done) {
        process.nextTick(async function () {
          try {
            const response = await axios.get(
              `${process.env.DZ_APP_CRUD_API}/user?email=${username}`
            );
            // check if error happened
            if ("error" in response.data) return done(response.data.error, false);

            // check if password is valid
            const user = response.data.data[0];
            if (!bcrypt.compareSync(password, user.password))
              return done("Wrong password", false);

            return done(null, user);
          } catch (err) {
            console.log(err);
            return done("Something bad happened", false);
          }
        });
      }
    )
  );

  // FACEBOOK
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.DZ_APP_FACEBOOK_CLIENT_ID,
        clientSecret: process.env.DZ_APP_FACEBOOK_CLIENT_SECRET,
        callbackURL: `${process.env.DZ_APP_OAUTH_API}/auth/facebook/callback`,
        profileFields: ["id", "displayName", "emails"],
        scope: ["emails"],
      },

      function (accessToken, refreshToken, profile, done) {
        process.nextTick(async function () {
          try {
            const response = await axios.get(
              `${process.env.DZ_APP_CRUD_API}/user?facebook=${profile.id}&email=${profile.emails[0].value}`
            );
            if ("error" in response.data) return done(response.data.error, false);
            // Update user if more data is available
            if (response.data.data.length !== 0) {
              var user = response.data.data[0];
              if (profile.id && !user.facebook) user.facebook = profile.id;
              if (profile.displayName && !user.name) user.name = profile.displayName;
              if (profile.emails && !user.email) user.email = profile.emails[0].value;
              if (profile.username && !user.username) user.username = profile.username;
              const updateUserRes = await axios.put(
                `${process.env.DZ_APP_CRUD_API}/user/${user._id}`,
                user
              );
              if ("error" in updateUserRes.data)
                return done(updateUserRes.data.error, false);

              user = updateUserRes.data.data;
            } else {
              // create user
              const body = {
                facebook: profile.id,
              };
              if (profile.displayName) body.name = profile.displayName;
              if (profile.emails) body.email = profile.emails[0].value;
              if (profile.username) body.username = profile.username;

              const createUserRes = await axios.post(
                `${process.env.DZ_APP_CRUD_API}/oauth/${profile.provider}`,
                body
              );
              if ("error" in createUserRes.data)
                return done(createUserRes.data.error, false);

              user = createUserRes.data.data;
            }

            return done(null, user);
          } catch (err) {
            console.log(err);
            return done("Something bad happened", false);
          }
        });
      }
    )
  );

  // TWITTER
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.DZ_APP_X_CLIENT_ID,
        consumerSecret: process.env.DZ_APP_X_CLIENT_SECRET,
        callbackURL: `${process.env.DZ_APP_OAUTH_API}/auth/x/callback`,
        includeEmail: true,
        userProfileURL:
          "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
        scope: ["emails"],
      },
      function (accessToken, refreshToken, profile, done) {
        process.nextTick(async function () {
          try {
            const response = await axios.get(
              `${process.env.DZ_APP_CRUD_API}/user?twitter=${profile.id}&email=${profile.emails[0].value}`
            );
            if ("error" in response.data) return done(response.data.error, false);
            // Update user if more data is available
            if (response.data.data.length !== 0) {
              var user = response.data.data[0];
              if (profile.id && !user.twitter) user.twitter = profile.id;
              if (profile.displayName && !user.name) user.name = profile.displayName;
              if (profile.emails && !user.email) user.email = profile.emails[0].value;
              if (profile.username && !user.username) user.username = profile.username;
              const updateUserRes = await axios.put(
                `${process.env.DZ_APP_CRUD_API}/user/${user._id}`,
                user
              );
              if ("error" in updateUserRes.data)
                return done(updateUserRes.data.error, false);

              user = updateUserRes.data.data;
            }

            // check if user exists
            if (response.data.data.length === 0) {
              // create user
              const body = {
                twitter: profile.id,
              };
              if (profile.displayName) body.name = profile.displayName;
              if (profile.emails) body.email = profile.emails[0].value;
              if (profile.username) body.username = profile.username;

              const createUserRes = await axios.post(
                `${process.env.DZ_APP_CRUD_API}/oauth/${profile.provider}`,
                body
              );
              if ("error" in createUserRes.data)
                return done(createUserRes.data.error, false);

              user = createUserRes.data.data;
            }

            return done(null, user);
          } catch (err) {
            console.log(err);
            return done("Something bad happened", false);
          }
        });
      }
    )
  );

  // GOOGLE
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.DZ_APP_GOOGLE_CLIENT_ID,
        clientSecret: process.env.DZ_APP_GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.DZ_APP_OAUTH_API}/auth/google/callback`,
      },
      function (accessToken, refreshToken, profile, done) {
        process.nextTick(async function () {
          try {
            const response = await axios.get(
              `${process.env.DZ_APP_CRUD_API}/user?google=${profile.id}&email=${profile.emails[0].value}`
            );
            if ("error" in response.data) return done(response.data.error, false);
            // Update user if more data is available
            if (response.data.data.length !== 0) {
              var user = response.data.data[0];
              if (profile.id && !user.google) user.google = profile.id;
              if (profile.displayName && !user.name) user.name = profile.displayName;
              if (profile.emails && !user.email) user.email = profile.emails[0].value;
              if (profile.username && !user.username) user.username = profile.username;
              const updateUserRes = await axios.put(
                `${process.env.DZ_APP_CRUD_API}/user/${user._id}`,
                user
              );
              if ("error" in updateUserRes.data)
                return done(updateUserRes.data.error, false);

              user = updateUserRes.data.data;
            }

            // check if user exists
            if (response.data.data.length === 0) {
              // create user
              const body = {
                google: profile.id,
              };
              if (profile.displayName) body.name = profile.displayName;
              if (profile.emails) body.email = profile.emails[0].value;
              if (profile.username) body.username = profile.username;

              const createUserRes = await axios.post(
                `${process.env.DZ_APP_CRUD_API}/oauth/${profile.provider}`,
                body
              );
              if ("error" in createUserRes.data)
                return done(createUserRes.data.error, false);

              user = createUserRes.data.data;
            }

            return done(null, user);
          } catch (err) {
            return done(null, false);
          }
        });
      }
    )
  );

  // Github
  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.DZ_APP_GITHUB_CLIENT_ID,
        clientSecret: process.env.DZ_APP_GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.DZ_APP_OAUTH_API}/auth/github/callback`,
      },
      function (accessToken, refreshToken, profile, done) {
        process.nextTick(async function () {
          try {
            const response = await axios.get(
              `${process.env.DZ_APP_CRUD_API}/user?github=${profile.id}&email=${profile.emails[0].value}`
            );
            if ("error" in response.data) return done(response.data.error, false);
            // Update user if more data is available
            if (response.data.data.length !== 0) {
              var user = response.data.data[0];
              if (profile.id && !user.github) user.github = profile.id;
              if (profile.displayName && !user.name) user.name = profile.displayName;
              if (profile.emails && !user.email) user.email = profile.emails[0].value;
              if (profile.username && !user.username) user.username = profile.username;
              const updateUserRes = await axios.put(
                `${process.env.DZ_APP_CRUD_API}/user/${user._id}`,
                user
              );
              if ("error" in updateUserRes.data)
                return done(updateUserRes.data.error, false);

              user = updateUserRes.data.data;
            }

            // check if user exists
            if (response.data.data.length === 0) {
              // create user
              const body = {
                github: profile.id,
              };
              if (profile.displayName) body.name = profile.displayName;
              if (profile.emails) body.email = profile.emails[0].value;
              if (profile.username) body.username = profile.username;

              const createUserRes = await axios.post(
                `${process.env.DZ_APP_CRUD_API}/oauth/${profile.provider}`,
                body
              );
              if ("error" in createUserRes.data)
                return done(createUserRes.data.error, false);

              user = createUserRes.data.data;
            }

            return done(null, user);
          } catch (err) {
            console.log(err);
            return done("Something bad happened", false);
          }
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });
};
