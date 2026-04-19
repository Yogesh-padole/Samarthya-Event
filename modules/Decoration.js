const mongoose = require("mongoose");

const DecorationSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  category: String,
  decorationIdx: Number
});

module.exports = mongoose.model("Decoration", DecorationSchema);
