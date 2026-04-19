const express = require("express");
const router = express.Router();
const Admin = require("../modules/Admin");


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  console.log("Login API hit");

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({ success: false, message: "All fields required" });
    }

    const admin = await Admin.findOne({ username, password });

    console.log("Admin found:", admin);

    if (admin) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ================= ADD NEW ADMIN =================
router.post("/add-admin", async (req, res) => {
  console.log("Add Admin API hit");

  try {
    const { username, password } = req.body;

    // ✅ validation
    if (!username || !password) {
      return res.json({
        success: false,
        message: "All fields required"
      });
    }

    // ✅ check existing admin
    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      return res.json({
        success: false,
        message: "Admin already exists"
      });
    }

    // ✅ create new admin
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    console.log("New admin created:", newAdmin);

    res.json({
      success: true,
      message: "Admin added successfully"
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


module.exports = router;
