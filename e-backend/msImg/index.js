/** @format */

const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const router = require("./routes/routes");
const log4js = require("log4js");
const logger = log4js.getLogger();
const PORT = process.env.PORT || 3002;

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Content-Length, Content-Disposition, Accept, Access-Control-Allow-Request-Method"
	);
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
	res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
	next();
});

app.use(router);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "http://localhost:4200",
	})
);

app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "production") {
	logger.level = "trace";
	logger.trace(`= = = = = = PROJECT IN PRODUCTION = = = = = =`);
} else {
	logger.level = "trace";
	logger.trace(`= = = = = = PROJECT IN DEVELOPMENT = = = = = =`);
}

app.listen(PORT, () => {
	logger.level = "info";
	logger.info(`App listening at http://localhost:${PORT}`);
});

//test
app.get("/", (req, res) => {
	res.send("Hello World");
});
