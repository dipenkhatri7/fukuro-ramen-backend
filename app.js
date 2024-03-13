const express = require("express");
const app = express();
const morgan = require("morgan");
const menuRouter = require("./routes/menuRoutes");
const userRouter = require("./routes/userRoutes");
const configRouter = require("./routes/configRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

// This is a middleware: Middleware is a function that can modify the incoming request data. Called middleware because it sits in the middle of the request and response cycle.

// Global Middleware

// Set security HTTP headers (helmet). This will set some HTTP headers that will make our app more secure. Eg: It will set the HTTP header for XSS protection, it will set the HTTP header for not allowing the app to be loaded in a frame, etc.

app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // This is a third party middleware
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter); // This is a middleware that will be applied to all the routes that start with /api

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize()); // This will look at the req.body, req.query and req.params and will filter out all the $ and the . symbols

// Data sanitization against XSS (cross site scripting) attacks
app.use(xss()); // This will clean any user input from malicious HTML code

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["ratingsQuantity", "ratingsAverage", "price"], // This will allow the same parameter to be used multiple times in the query string
  })
); // This will remove duplicate parameters from the query string

// Serving static files
// app.use(express.static(`${__dirname}/public`)); // This is a middleware that will serve all the static files that are in the public folder

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// Routes: Mounting the routers
app.use("/api/v1/menus", menuRouter);
app.use("/api/v1/users", userRouter); // Mounting a router on a route, this is called mounting. This means that all the routes that are defined in the userRouter will be prefixed with /api/v1/users
app.use("/api/v1/config", configRouter);

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = "fail";
  // err.statusCode = 404;
  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
