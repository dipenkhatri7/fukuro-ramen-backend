const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (val) {
        return validator.isEmail(val);
      },
      message: "Please provide a valid email",
    },
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    // This only works on CREATE and SAVE
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 14);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (password, userPassowrd) {
  return await bcryptjs.compare(password, userPassowrd);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimeStamp;
  }
  return false; 
};

const User = mongoose.model("User", userSchema);

module.exports = User;
