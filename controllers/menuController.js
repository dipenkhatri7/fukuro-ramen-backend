const Menu = require("../models/menuModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
// const menus = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/menus.json`)
// );

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Missing name or price",
//     });
//   }
//   next();
// };

// exports.checkId = (req, res, next, val) => {
//   console.log(`Menu id is: ${val}`);
//   if (req.params.id * 1 > menus.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }
//   next();
// };

exports.aliasPopularMenus = async (req, res, next) => {
  req.query.limit = await Menu.countDocuments({ popular: true });
  // console.log(req.query.limit);
  req.query.sort = "-popular,-ratingAverage,price";
  req.query.fields = "name,price,ratingAverage,image,description";
  next();
};

exports.getAllMenus = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Menu.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const menus = await features.query;

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: menus.length,
    data: {
      menus,
    },
  });
});

exports.getMenu = catchAsync(async (req, res, next) => {
  // Menu.findOne({ _id: req.params.id });
  const menu = await Menu.findById(req.params.id);
  if (!menu) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      menu,
    },
  });
});

exports.createMenu = catchAsync(async (req, res, next) => {
  // const newMenu = new Menu({});
  // newMenu.save();
  const menu = await Menu.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      menu,
    },
  });
  // console.log(req.body); // body is the property of request object that contains the data that is sent by the client and is available only when we use middleware express.json()
  // const newId = menus[menus.length - 1].id + 1;
  // const newMenus = Object.assign({ id: newId }, req.body);
  // menus.push(newMenus);

  // fs.writeFile(
  //   `${__dirname}/dev-data/data/menus.json`,
  //   JSON.stringify(menus),
  //   (err) => {
  //     res.status(201).json({
  //       status: "success",
  //       data: {
  //         menus: newMenus,
  //       },
  //     });
  //   }
  // );
});

exports.updateMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!menu) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      menu,
    },
  });
});

exports.deleteMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.findByIdAndDelete(req.params.id);
  if (!menu) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getMenuStats = catchAsync(async (req, res, next) => {
  const stats = await Menu.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },

    {
      $group: {
        _id: "$popular",
        numMenus: { $sum: 1 },
        numRatings: { $sum: "$ratingQuantity" },
        avgRating: { $avg: "$ratingAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $addFields: { isPopular: "$_id" },
    },
    {
      $sort: { avgPrice: 1 },
    },
    {
      $project: { _id: 0 },
    },
    // {
    //   $match: { _id: { $ne: false } },
    // },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const menuPlan = await Menu.aggregate([
    {
      $unwind: "$menuPlan", // deconstructs an array field from the input documents to output a document for each element
    },
    {
      $group: {
        _id: { $month: "$menuPlan.date" },
        numMenuStarts: { $sum: 1 },
        menus: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numMenuStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);
});
