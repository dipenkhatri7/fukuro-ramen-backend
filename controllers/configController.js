const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Config = require("../models/configModel");

exports.getAllConfigs = catchAsync(async (req, res, next) => {
  const configsData = await Config.find();
  if (!configsData) {
    return next(new AppError("No config found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      configsData,
    },
  });
});
