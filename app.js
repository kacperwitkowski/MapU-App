const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
require("dotenv").config();

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

require("./models/user");
require("./models/roads");
require("./models/countries");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/roadRoute"));
app.use(require("./routes/countriesRoute"));


app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

  app.use(express.static("frontend/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });

app.listen(PORT);
