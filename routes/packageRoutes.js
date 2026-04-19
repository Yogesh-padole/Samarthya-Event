const express = require("express");
const router = express.Router();
const Package = require("../modules/package");


// ✅ GET ALL PACKAGES
router.get("/packages", async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET BY CATEGORY
router.get("/packages/:category", async (req, res) => {
  try {
    const category = req.params.category;

    const packages = await Package.find({ category });

    res.json(packages);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ ADD PACKAGE (ADMIN)
router.post("/packages", async (req, res) => {
  try {
    const { name, image, category, decorationIdx } = req.body;

    const newPackage = new Package({
      name,
      image,
      category,
      decorationIdx
    });

    await newPackage.save();

    res.json({ success: true, message: "Package added" });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
