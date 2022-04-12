const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const appErrors = require("../utilities/appErrors");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new appErrors("You are not authorized!", 401));
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return next(new appErrors("You are not authorized!", 401));
    }

    const { _id } = payload;
    User.findById(_id).then((userData) => {
      req.username = userData;
      next();
    });
  });
};
