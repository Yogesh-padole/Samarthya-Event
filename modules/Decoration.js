const mongoose = require("mongoose");

const decorationSchema = new mongoose.Schema({
  name: String,
  price: String,
  category: String,
  decorationIdx: String,

  // ✅ NEW
  images: [String],
  public_ids: [String],

  // ✅ OLD (KEEP for safety)
  image: String,
});


module.exports = mongoose.model("Decoration", decorationSchema);
