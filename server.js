const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded images (VERY IMPORTANT)
app.use("/uploads", express.static("uploads"));


// ================= ROUTES =================
const bookingRoutes = require("./routes/BookingRoutes");
const decorationRoutes = require("./routes/decorationRoutes");
const adminRoutes = require("./routes/admin");


app.use(cors({
  origin: "*"
}));


// ✅ Clean API structure
app.use("/api/bookings", bookingRoutes);
app.use("/api/decorations", decorationRoutes);
app.use("/api/admin", adminRoutes);


// ================= DATABASE =================
// ❗ FIXED: removed old options
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ DB Error:", err);
    process.exit(1); // stop server if DB fails
  });


// ================= ROOT TEST =================
app.get("/", (req, res) => {
  res.send("🚀 Backend running...");
});


// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});


// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
