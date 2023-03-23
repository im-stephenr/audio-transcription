const express = require("express");
const router = express.Router();
const uploadController = require("../controller/upload-controller");
const { check } = require("express-validator");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, "uploads/audios");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/save", upload.single("audio"), uploadController.save);

module.exports = router;
