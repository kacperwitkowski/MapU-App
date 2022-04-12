const Countries = require("../models/countries");
const appErrors = require("../utilities/appErrors.js");
const catchAsync = require("../utilities/catchAsync");

exports.getMyCountries = catchAsync(async (req, res) => {
  let result = await Countries.find({ postedBy: req.username._id });

  if (!result) {
    return next(new appErrors("Havent found roads for this user", 500));
  }
  res.send(result);
});

exports.postCountries = catchAsync(async (req, res) => {
  try {
    const item = new Countries({ ...req.body, postedBy: req.username });
    const result = await item.save();
    res.status(200).send(result);
  } catch (err) {
    throw err;
  }
});
exports.updateCountries = catchAsync(async (req, res) => {
  try {
    let result = await Countries.findByIdAndUpdate(req.params.ID, req.body);
    res.status(200).send(result);
  } catch (err) {
    throw err;
  }
});
