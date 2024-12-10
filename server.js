const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const http = require("http");
const moment = require("moment");
const cron = require("node-cron");
const pullDataFromHubspot = require("./worker");

const { PORT, NODE_ENV } = process.env;

// server setup
const app = express();
const server = http.Server(app);

app.locals.moment = moment;
app.locals.version = process.env.version;
app.locals.NODE_ENV = NODE_ENV;

app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use((req, res, next) => express.json({ limit: "50mb" })(req, res, next));
app.use(bodyParser.text({ limit: "50mb" }));
app.use(cookieParser());

// Schedule task to run at midnight (00:00) every day
cron.schedule("0 0 * * *", async () => {
  try {
    await pullDataFromHubspot();
  } catch (error) {
    logger.error("Failed to execute HubSpot data pull", { error });
  }
});

// listen to connections
server.listen(PORT);
