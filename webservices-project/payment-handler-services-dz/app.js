const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const stripe = require("stripe")(process.env.PRIVATE_KEY);
const cors = require("cors");
const axios = require("axios");
const { collectDefaultMetrics, register } = require("prom-client");

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const { handleSubsCreated, handleInvoicePaid } = require("./utils");

const app = express();
app.use(
  cors({
    origin: ["http://ofsen.io:5173", "http://localhost:8080"],
    credentials: true,
    methods: "POST",
    allowedHeaders: [
      "Content-type",
      "Origin",
      "Access-Control-Allow-Origin",
      "Access-Control-Request-Headers",
      "X-Api-Key",
    ],
  })
);

app.post("/create-subscription", bodyParser.json(), async (req, res) => {
  const { paymentMethodId, email, plan } = req.body;

  // check if a customer exists, if no create a new customer object
  let customer;
  const { data } = await stripe.customers.search({
    query: `email:"${email}"`,
  });
  if (data.length > 0) customer = data[0];
  else
    customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

  // Create the subscription
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan }],
    expand: ["latest_invoice.payment_intent"],
  });

  const userDb = await axios.get(`http://ofsen.io:3001/api/user?email=${email}`, {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.DZ_APP_ACCESS_SECRET,
    },
  });

  //update db
  await axios.put(
    "http://ofsen.io:3001/api/user/" + userDb.data.data[0]._id,
    {
      subscriptionPlan: plan,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.DZ_APP_ACCESS_SECRET,
      },
    }
  );

  res.send(subscription);
});

app.post("/create-plan", bodyParser.json(), async (req, res) => {
  const plan = await stripe.plans.create({
    amount: 1200,
    currency: "eur",
    interval: "month",
    product: "prod_PxM71uEpDRnBKE",
  });

  res.send(plan);
});

app.post("/cancel-subscription", bodyParser.json(), async (req, res) => {
  const { email } = req.body;

  try {
    const { data } = await stripe.customers.search({
      query: `email:"${email}"`,
    });
    const customer = data[0];
    const subscription = await stripe.subscriptions.list({
      customer: customer.id,
    });
    const sub = subscription.data[0];
    const deleted = await stripe.subscriptions.cancel(sub.id);

    //update db
    await axios.post(
      "http://ofsen.io:3001/api/cancelUserSubscription",
      {
        email,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.DZ_APP_ACCESS_SECRET,
        },
      }
    );
    res.send(deleted);
  } catch (error) {
    console.log(error);
  }
});

app.post("/webhook", bodyParser.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "customer.subscription.created":
      stripe.customers.retrieve(event.data.object.customer, (err, customer) => {
        if (err) return console.log(err);
        handleSubsCreated(customer, event.data.object.plan.id);
      });
      break;
    case "invoice.paid":
      handleInvoicePaid(event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

collectDefaultMetrics();

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});

app.listen(3008, () => {
  console.log(`Server listening at http://ofsen.io:3008`);
});
