const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  baseUrls: {
    bannerImageUrl: String,
  },
  appMinimumVersionAndroid: {
    type: Number,
  },
  appMinimumVersionIos: {
    type: Number,
  },
  maintenanceMode: {
    type: Boolean,
  },
  defaultLocation: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  loyaltyPointExchangeRate: {
    type: Number,
  },
  loyaltyPointItemPurchasePoint: {
    type: Number,
  },
});

const Config = mongoose.model("Config", configSchema);

module.exports = Config;
