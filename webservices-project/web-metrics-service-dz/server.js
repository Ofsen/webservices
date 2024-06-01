require("dotenv").config();

const express = require("express");
const { collectDefaultMetrics, register } = require("prom-client");
const serviceAuthMiddleware = require("./middleware/serviceAuth.middleware");

const app = express();

// Check if all required env variables are set
require("./config/checkEnv").check();
// API KEY Middleware
app.use(serviceAuthMiddleware);

const port = process.env.DZ_APP_PORT || 3002;

collectDefaultMetrics();

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});

app.get("/health", async (req, res) => {
  res.send("running");
});

// Start the Express.js server
app.listen(port, () => {
  console.log(`MONITOR - App listening on port: ${port}`);
});
