const express = require("express");
const router = express.Router();
const Decoration = require("../modules/Decoration");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../modules/cloudinary");

// ================= STORAGE =================
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "decorations",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
});

const upload = multer({ storage });

// ================= ADD DECORATION =================
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, decorationIdx } = req.body;

    const newDecoration = new Decoration({
      name,
      price,
      category,
      decorationIdx,
      image: req.file ? req.file.path : "",
      public_id: req.file ? req.file.filename : "" // ✅ IMPORTANT
    });

    await newDecoration.save();

    res.json({ success: true, message: "Decoration added" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

// ================= GET BY CATEGORY =================
router.get("/:category", async (req, res) => {
  try {
    const data = await Decoration.find({
      category: req.params.category
    });

    res.json(data);

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
