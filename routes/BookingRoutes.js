const express = require("express");
const router = express.Router();
const Booking = require("../modules/Booking");
const nodemailer = require("nodemailer");

// ================= EMAIL SETUP =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ================= ➕ CREATE BOOKING =================
router.post("/book", async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      status: "Pending" // ✅ default status
    });

    await newBooking.save();

    // 📧 EMAIL TO ADMIN
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "🎉 New Booking Received - Samarthya Events",
      html: `
        <h2>New Booking Details</h2>

        <p><b>Name:</b> ${req.body.name}</p>
        <p><b>Phone:</b> ${req.body.mobile}</p>
        <p><b>Email:</b> ${req.body.email || "Not Provided"}</p>
        <p><b>Event:</b> ${req.body.event}</p>
        <p><b>Date:</b> ${req.body.date}</p>
        <p><b>Location:</b> ${req.body.location}</p>

        <br/>
        <p style="color:green;"><b>New booking received 🚀</b></p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Admin Email Sent");
    } catch (emailErr) {
      console.error("❌ Email Error:", emailErr);
    }

    res.json({
      success: true,
      message: "Booking saved successfully!"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error saving booking"
    });
  }
});

// ================= 📋 GET ALL BOOKINGS =================
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// ================= ✅ APPROVE BOOKING =================
router.put("/approve/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "Approved";
    await booking.save(); // ✅ update MongoDB

    // 📧 EMAIL TO USER
    if (booking.email) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.email,
        subject: "🎉 Your Booking is Approved!",
        html: `
          <h2>Hi ${booking.name}</h2>
          <p>Your booking for <b>${booking.event}</b> is approved ✅</p>
          <p><b>Date:</b> ${booking.date}</p>
          <p><b>Location:</b> ${booking.location}</p>

          <br/>
          <p style="color:green;">We will contact you soon 🎊</p>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Approval Email Sent");
      } catch (err) {
        console.error("❌ Email Error:", err);
      }
    }

    res.json({ message: "Booking Approved & Updated ✅" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error approving booking" });
  }
});

// ================= ❌ DECLINE BOOKING =================
router.put("/decline/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "Declined";
    await booking.save(); // ✅ update MongoDB

    // 📧 EMAIL TO USER
    if (booking.email) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.email,
        subject: "❌ Booking Declined",
        html: `
          <h2>Hi ${booking.name}</h2>
          <p>Sorry, your booking for <b>${booking.event}</b> is declined ❌</p>

          <p>Please contact us for more details.</p>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Decline Email Sent");
      } catch (err) {
        console.error("❌ Email Error:", err);
      }
    }

    res.json({ message: "Booking Declined & Updated ❌" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error declining booking" });
  }
});

// ================= 🗑 DELETE BOOKING =================
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking Deleted 🗑" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting booking" });
  }
});

module.exports = router;
