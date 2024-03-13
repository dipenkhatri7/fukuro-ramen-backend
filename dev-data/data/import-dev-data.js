const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const Menu = require("../../models/menuModel");
const configModel = require("../../models/configModel");
// const { log } = require("console");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB, {}).then(() => {
  console.log("DB connection successful");
});

// Read JSON file

// const menus = JSON.parse(fs.readFileSync(`${__dirname}/menus.json`, "utf-8"));
const config = JSON.parse(fs.readFileSync(`${__dirname}/config.json`, "utf-8"));
// Import data into DB

const importData = async () => {
  try {
    // await Menu.create(menus);
    await configModel.create(config);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

// Delete all data from DB

const deleteData = async () => {
  try {
    // await Menu.deleteMany();
    await configModel.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

// console.log(process.argv);
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
