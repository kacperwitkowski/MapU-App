const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const CountriesScheme = new mongoose.Schema(
  {
    countriesList: {
      type: Array,
      require: true,
      min: 3,
    },
    countryCode: {
      type: Array,
      require: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Countries", CountriesScheme);
