const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
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
    // difficulty: {
    //   type: String,
    //   required: true,
    //   enum: {
    //     // This will only allow the values specified in the enum array. and enum is only for strings.
    //     values: ["easy", "medium", "difficult"],
    //     message: "{VALUE} is not supported",
    //   },
    // },
  },
  {
    // toJSON: { virtuals: true }, // This will allow virtual properties to be shown when outputting JSON data.
    // toObject: { virtuals: true }, // This will allow virtual properties to be shown when outputting object data.
  }
);

// virtual property related to price in country currency where the user is located
// menuSchema.virtual("priceInCurrentCountry").get(function () {
//   console.log("Inside virtual property");
//   // console.log(this);
//   // console.log(req.user.country);
//   // const countryCurrency = req.user.countryCurrency;
//   return this.price * 1;
// });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()

menuSchema.pre("save", function (next) {
  console.log("Inside pre save middleware");
  // console.log(this);
  next();
});

menuSchema.post("save", function (doc, next) {
  console.log("Inside post save middleware");
  // console.log(doc);
  next();
});

// QUERY MIDDLEWARE (this keyword points to the current query)
menuSchema.pre(/^find/, function (next) {
  // this.find({ popular: { $ne: true } });
  this.start = Date.now();
  next();
});

menuSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE (this keyword points to the current aggregation object)

menuSchema.pre("aggregate", function (next) {
  console.log("Inside pre aggregate middleware");
  // this.pipeline().unshift({ $match: { popular: { $ne: true } } }); // unshift() adds an element to the beginning of an array and returns the new length of the array.
  // console.log(this.pipeline());
  next();
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
