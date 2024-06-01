const mongoose = require("mongoose");

exports.config = () => {
  mongoose.connect(process.env.DZ_APP_MONGO_URI);
  console.log("OAUTH - Connected to MongoDB");
};
