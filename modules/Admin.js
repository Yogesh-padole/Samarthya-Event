const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

// 👇 FORCE collection name = "Admins"
module.exports = mongoose.model("Admin", adminSchema, "Admins");
