const express = require("express");
const app = express();
const morgan = require("morgan");
const menuRouter = require("./routes/menuRoutes");
const userRouter = require("./routes/userRoutes");

// This is a middleware: Middleware is a function that can modify the incoming request data. Called middleware because it sits in the middle of the request and response cycle.
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // This is a third party middleware
}
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes: Mounting the routers
app.use("/api/v1/menus", menuRouter);
app.use("/api/v1/users", userRouter); // Mounting a router on a route, this is called mounting. This means that all the routes that are defined in the userRouter will be prefixed with /api/v1/users

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = "fail";
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
