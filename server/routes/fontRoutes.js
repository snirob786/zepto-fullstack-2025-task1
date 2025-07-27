const express = require("express");
const multer = require("multer");
const { uploadFont, getFonts } = require("../controllers/fontController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "font/ttf" || file.originalname.endsWith(".ttf")) {
      cb(null, true);
    } else {
      cb(new Error("Only .ttf files allowed"));
    }
  },
});

router.post("/upload", upload.single("font"), uploadFont);
router.get("/", getFonts);

module.exports = router;
