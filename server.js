const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Uncaught exception error
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught exception! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

dotenv.config({ path: "./config.env" }); // This will read the config.env file and save the environment variables in the process.env object. This object is a global object that is available in all the modules.
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {}).then((connection) => {
  // console.log(connection.connections);
  console.log("DB connection successful");
});
// This env vairable is set by express.
// console.log(app.get("env")); // This will print the environment variable. Environment variable is a variable that is set in the underlying system. In this case, it is set in the terminal. To set the environment variable, type in the terminal: export NODE_ENV=development
// This env vairable is set by node.
// console.log(process.env);
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log("Listening");
});

// Unhandled rejection error
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});