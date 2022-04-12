const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const RoadScheme = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
      min: 3,
      trim: true,
      maxlength: [
        25,
        "A Road title must have less or equal then 25 characters!",
      ],
    },
    countries: {
      type: Array,
      require: true,
    },
    img1: {
      type: String,
      require: true,
    },
    img2: {
      type: String,
    },
    gasoline: {
      type: Number,
    },
    gasolinePrice: {
      type: Number,
    },
    kms: {
      type: Number,
    },
    origin: {
      type: Array,
      require: true,
    },
    destination: {
      type: Array,
      require: true,
    },
    fullPrice: {
      type: Number,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Road", RoadScheme);
