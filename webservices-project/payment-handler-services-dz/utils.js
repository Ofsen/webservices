const axios = require("axios");
require("dotenv").config();

module.exports.handleSubsCreated = async (customerInfo, planID) => {
  try {
    //send mail to the customer
    await axios.post("http://ofsen.io:3011/subs-created", {
      recepient: customerInfo.email,
    });
    //update data base
    await axios.post(
      "http://ofsen.io:3001/api/userSubscription",
      {
        email: customerInfo.email,
        name: "salim",
        subscriptionPlan: planID,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.DZ_APP_ACCESS_SECRET,
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports.handleInvoicePaid = async (invoiceInfo) => {
  //send mail to the user
  const data = {
    recepient: invoiceInfo.customer_email,
    invoiceUrl: invoiceInfo.invoice_pdf,
  };
  try {
    await axios.post("http://ofsen.io:3011/send-invoice", data);
  } catch (error) {
    console.error(error);
  }
};
