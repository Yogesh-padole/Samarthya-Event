const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  event: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  decorationIdx: {
    type: Number
  },
  mobile: {
    type: String,
    required: true
  },
  email: {
    type: String // ✅ needed for sending email
  },
  description: {
    type: String
  },
  status: {
    type: String,
    default: "Pending" // ✅ important
  }
}, { timestamps: true }); // ✅ adds createdAt & updatedAt

module.exports = mongoose.model("Booking", BookingSchema);
