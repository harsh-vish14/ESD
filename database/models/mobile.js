const mongoose = require("mongoose");
const MobileModel = {
  name: String,
  company: String,
  price: Number,
  origin: String,
  ram: Number,
  storage: Number,
  processor: String,
  camera: Number,
  size: String,
};
module.exports = mongoose.model("mobile", MobileModel);
