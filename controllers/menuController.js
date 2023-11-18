const fs = require("fs");

const menus = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/menus.json`)
);

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "Missing name or price",
    });
  }
  next();
};

exports.checkId = (req, res, next, val) => {
  console.log(`Menu id is: ${val}`);
  if (req.params.id * 1 > menus.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};
exports.getAllMenus = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: menus.length,
    data: {
      menus,
    },
  });
};
exports.getMenu = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const menu = menus.find((el) => el.id === id);
  res.status(200).json({
    status: "success",
    data: {
      menu,
    },
  });
};
exports.createMenu = (req, res) => {
  console.log(req.body); // body is the property of request object that contains the data that is sent by the client and is available only when we use middleware express.json()
  const newId = menus[menus.length - 1].id + 1;
  const newMenus = Object.assign({ id: newId }, req.body);
  menus.push(newMenus);

  fs.writeFile(
    `${__dirname}/dev-data/data/menus.json`,
    JSON.stringify(menus),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          menus: newMenus,
        },
      });
    }
  );
};
exports.updateMenu = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      menu: "<Updated menu here...>",
    },
  });
};
exports.deleteMenu = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
