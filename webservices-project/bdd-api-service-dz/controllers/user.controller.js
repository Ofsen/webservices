const User = require("../models/user.js");
const bcrypt = require("bcrypt");

exports.registerUser = (req, res) => {
  if (
    !req.body.email ||
    !req.body.name ||
    !req.body.password ||
    !req.body.passwordConfirm
  )
    return res.status(400).json({ error: "Missing fields" });

  if (req.body.password !== req.body.passwordConfirm)
    return res
      .status(400)
      .json({ error: "Password & confirmation password don't match" });

  User.findByEmailOrQuery(req.body.email).then(async (user) => {
    if (user) return res.status(400).json({ error: "Email already in use" });

    if (!user) {
      var user = new User();
    }

    user.email = req.body.email;
    user.name = req.body.name;
    user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
    user.username = req.body.username;
    user.subscriptionPlan = "plan_free";
    if (req.body.google) user.google = req.body.google;
    if (req.body.facebook) user.facebook = req.body.facebook;
    if (req.body.x) user.x = req.body.x;
    if (req.body.github) user.github = req.body.github;

    await user
      .save()
      .then((data) => {
        res.status(200).json({ data: data, message: "User created" });
      })
      .catch((err) => {
        console.error(err.message);
        res.status(500).json({ error: "Something bad happened" });
      });
  });
};

// register user with oauth
exports.registerUserWithOauth = (req, res) => {
  if (!req.body[req.params.provider])
    return res.status(400).json({ error: "Missing fields" });

  var user = new User();
  if (req.body[req.params.provider])
    user[req.params.provider] = req.body[req.params.provider];
  if (req.body.email) user.email = req.body.email;
  if (req.body.name) user.name = req.body.name;
  if (req.body.username) user.username = req.body.username;

  user
    .save()
    .then((data) => {
      res.status(200).json({ data: data, message: "User created" });
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500).json({ error: "Something bad happened" });
    });
};

exports.getUserByFields = (req, res) => {
  const query = Object.keys(req.query);
  let condition = [];
  query.map((field) => {
    condition.push({ [field]: req.query[field] });
  });

  User.find({ $or: condition })
    .then((user) => {
      if (user.length <= 0) return res.status(200).json({ error: "User(s) not found" });
      res.status(200).json({ data: user });
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500).json({ error: "Something bad happened" });
    });
};

exports.updateUser = async (req, res) => {
  console.log(req.body.email, req.locals.user);
  if (req.body.email !== req.locals.user && req.locals.user !== "cookie") {
    try {
      const data = await User.findByEmailOrQuery(req.body.email);
      if (data) {
        return res.status(400).json({ error: "Email already in use" });
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Something bad happened" });
    }
  }

  User.findById(req.params.id).then(async (user) => {
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (
      req.body.password &&
      req.body.passwordConfirm &&
      req.body.passwordConfirm === req.body.password
    )
      user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
    if (req.body.username && !user.username) user.username = req.body.username;
    if (req.body.google && !user.google) user.google = req.body.google;
    if (req.body.facebook && !user.facebook) user.facebook = req.body.facebook;
    if (req.body.twitter && !user.twitter) user.twitter = req.body.twitter;
    if (req.body.github && !user.github) user.github = req.body.github;
    if (req.body.subscriptionPlan) {
      user.isSubscribed = true;
      user.subscriptionStartDate = new Date();
      user.subscriptionPlan = req.body.subscriptionPlan;
    }

    try {
      const data = await user.save();
      res.status(200).json({ data: data, message: "User updated" });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Something bad happened" });
    }
  });
};

exports.deleteUser = (req, res) => {
  if (req.body.email !== req.locals.user)
    return res.status(403).json({ error: "You can't perform this action" });

  User.findByEmailOrQuery(req.body.email).then(async (user) => {
    if (!user) return res.status(404).json({ error: "User not found" });

    await user
      .deleteOne()
      .then(() => {
        res.status(200).json({ ok: true, message: "User deleted" });
      })
      .catch((err) => {
        console.error(err.message);
        res.status(500).json({ error: "something bad happened" });
      });
  });
};

exports.createUserSubscription = async (req, res) => {
  if ((!req.body.email, !req.body.subscriptionPlan))
    return res.status(400).json({ error: "Missing fields" });

  const user = await User.findByEmailOrQuery(req.body.email);
  if (!user) return res.status(400).json({ error: "User not found" });

  user.isSubscribed = true;
  user.subscriptionPlan = req.body.subscriptionPlan;
  user.subscriptionStartDate = new Date();

  try {
    const data = await user.save();
    res.status(200).json({ data: data, message: "User subscription created" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something bad happened" });
  }
};

exports.cancelUserSubscription = async (req, res) => {
  if (!req.body.email) return res.status(400).json({ error: "Missing fields" });

  const user = await User.findByEmailOrQuery(req.body.email);
  if (!user) return res.status(400).json({ error: "User not found" });

  user.isSubscribed = false;
  user.subscriptionPlan = "plan_free";
  user.subscriptionStartDate = null;

  try {
    const data = await user.save();
    res.status(200).json({ data: data, message: "User subscription deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something bad happened" });
  }
};
