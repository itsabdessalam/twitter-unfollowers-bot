const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const createError = require("http-errors");
const express = require("express");
const serverless = require("serverless-http");
const logger = require("morgan");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const router = express.Router();

app.use(cors());
app.use(logger("dev"));
app.use(helmet());
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

router.get("/", (req, res) => {
	res.writeHead(200, { "Content-Type": "text/html" });
	res.write("<h1>Hello from Node.js twitter bot!</h1>");
	res.end();
});

app.use(
	process.env.NODE_ENV === "dev" ? "/" : "/.netlify/functions/index",
	router
);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404, `Cannot ${req.method} ${req.originalUrl}`));
});
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.send(err.message);
});

module.exports = app;
module.exports.handler = serverless(app);
