const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  name: String,
  image: String,
  category: String,
  decorationIdx: Number 
});

module.exports = mongoose.model("Package", PackageSchema);
