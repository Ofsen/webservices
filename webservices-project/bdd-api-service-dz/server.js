require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const serviceAuthMiddleware = require("./middleware/serviceAuth.middleware");
const { collectDefaultMetrics, register } = require("prom-client");

const app = express();
// Check if all required env variables are set
require("./config/checkEnv").check();

// Parse cookies
app.use(cookieParser());
// API KEY Middleware
app.use(serviceAuthMiddleware);
// Logger
app.use(morgan("dev"));

app.use(
  cors({
    origin: [
      "http://ofsen.io:5173",
      "http://ofsen.io:3000",
      "http://ofsen.io:3008",
      "http://localhost:8080",
    ],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: [
      "Content-type",
      "Origin",
      "Access-Control-Allow-Origin",
      "Access-Control-Request-Headers",
      "X-Api-Key",
    ],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// DB config
require("./config/db").config();

app.get("/", (req, res) => {
  res.status(200).send("ok");
});

// Routes
fs.readdirSync("./routes").map((route) => {
  app.use("/api", require("./routes/" + route));
});

collectDefaultMetrics();

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});

app.listen(process.env.DZ_APP_PORT);
console.log("CRUD - App listening on port: " + process.env.DZ_APP_PORT);
