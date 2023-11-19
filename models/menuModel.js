const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A menu must have a name"],
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  popular: {
    type: Boolean,
    default: false,
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
    min: [1, "Rating must be above 1.0"],
    max: [5, "Rating must be below 5.0"],
    set: (val) => Math.round(val * 10) / 10, // This will round the value to one decimal place.
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  imageCover: {
    type: String,
    required: [true, "A menu must have a cover image"],
  },
  images: [String],
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
