const Road = require("../models/roads");
const appErrors = require("../utilities/appErrors.js");
const catchAsync = require("../utilities/catchAsync");

exports.createRoad = catchAsync(async (req, res, next) => {
  const { title, gasoline } = req.body;

  if (!title || !gasoline) {
    return next(new appErrors("Please fill up all the fields!!!", 422));
  }

  req.username.password = undefined;

  const newRoad = await new Road({ ...req.body, postedBy: req.username });
  newRoad.save().then((result) => {
    res.json({ road: result });
  });
});

exports.getMyRoads = catchAsync(async (req, res) => {
  const pageSize = 10;
  const page = parseInt(req.query.page || "0");
  const total = await Road.countDocuments({ postedBy: req.username._id });

  const roads = await Road.find({ postedBy: req.username._id })
    .limit(pageSize)
    .skip(pageSize * page);
  res.status(200).json({ totalPages: Math.ceil(total / pageSize), roads });
});

exports.deleteRoad = catchAsync(async (req, res) => {
  await Road.findByIdAndDelete(req.params.postID);

  res.status(201).json({
    status: "DELETED",
    road: null,
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const updates = req.body;
  const id = req.body._id;

  const result = await Road.findByIdAndUpdate(id, updates, {
    new: true,
  });

  res.status(201).json({
    status: "update done",
    result,
  });
});
