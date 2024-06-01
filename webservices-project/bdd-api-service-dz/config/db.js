const mongoose = require("mongoose");

exports.config = () => {
  mongoose.connect(process.env.DZ_APP_MONGO_URI, {
    dbName: "crud",
  });
  console.log("CRUD - Connected to MongoDB");
};
