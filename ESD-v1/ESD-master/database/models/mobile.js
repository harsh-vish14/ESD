const mongoose = require("mongoose");
const MobileModel = {
  mobileName: String,
  brand: String,
  price: Number,
  origin: String,
};
module.exports = mongoose.model("mobile", MobileModel);
