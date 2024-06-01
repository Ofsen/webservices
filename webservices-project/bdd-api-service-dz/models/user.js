var mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: String,
  username: String,
  password: String,
  name: String,
  subscriptionPlan: String,
  subscriptionStartDate: Date,
  isSubscribed: Boolean,

  facebook: String,
  twitter: String,
  google: String,
  github: String,
});

userSchema.statics.findByEmailOrQuery = function (email) {
  return this.findOne({
    $or: [
      {
        email: email,
      },
    ],
  });
};

module.exports = mongoose.model("User", userSchema);
