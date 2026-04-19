const nodemailer = require("nodemailer");

const sendEmail = async (bookingData) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS  // app password
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // where you want to receive booking
      subject: "🎉 New Booking Received",
      html: `
        <h2>New Booking Details</h2>
        <p><b>Name:</b> ${bookingData.name}</p>
        <p><b>Phone:</b> ${bookingData.phone}</p>
        <p><b>Event:</b> ${bookingData.event}</p>
        <p><b>Date:</b> ${bookingData.date}</p>
        <p><b>Address:</b> ${bookingData.address}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email Sent!");
  } catch (error) {
    console.error("❌ Email Error:", error);
  }
};

module.exports = sendEmail;
