const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const countriesController = require("../controllers/countriesController");

router.post(
  "/createcountries",
  authController.protect,
  countriesController.postCountries
);

router.get(
  "/mycountries",
  authController.protect,
  countriesController.getMyCountries
);

router.put(
  "/createcountries/:ID",
  authController.protect,
  countriesController.updateCountries
);

module.exports = router;
