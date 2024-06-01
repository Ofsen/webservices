const {Vonage} = require("@vonage/server-sdk");
require("dotenv").config();

const vonage = new Vonage({
  apiKey: process.env.SMS_KEY,
  apiSecret: process.env.SMS_SECRET,
});

module.exports.sendSMS = async ({ to, text }) => {
  return await vonage.sms.send({ to, from: "DZ SMS Service", text });
};
