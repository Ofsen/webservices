require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const MongoStore = require("connect-mongo");
const passport = require("passport");
const session = require("express-session");
const serviceAuthMiddleware = require("./middleware/serviceAuth.middleware");
const { collectDefaultMetrics, register } = require("prom-client");

// Check if all required env variables are set
require("./config/checkEnv").check();
// API KEY Middleware
app.use(serviceAuthMiddleware);
// Setup axios & add cookie
require("./config/axios").setup();

collectDefaultMetrics();

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});

// Logger
const morgan = require("morgan");
app.use(morgan("dev"));

const PORT = process.env.DZ_APP_PORT || 3000;

// DB config
require("./config/db").config();

app.use(
  cors({
    origin: [
      "http://ofsen.io:5173",
      "http://ofsen.io:3001",
      "http://ofsen.io:9090",
      "http://ofsen.io:4000",
      "http://localhost:8080",
      "http://localhost:3001",
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

const passportConfig = require("./config/passport");
const authentication = require("./middleware/auth.middleware");
const authRoutes = require("./routes/auth");
const appRoutes = require("./routes/app");

app.use(
  session({
    secret: "dz-wesh-wesh",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DZ_APP_MONGO_URI,
      dbName: "sessions",
    }), // to store sessions in the SESSIONS database
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

passportConfig(passport);

// Authentication middleware
app.use(authentication());

// Authenticated routes
authRoutes(app, passport);
appRoutes(app);

app.listen(PORT);
console.log("OAUTH - App listening on port: " + PORT);
