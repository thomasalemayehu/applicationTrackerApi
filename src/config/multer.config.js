const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Replace 'uploads/' with your desired destination
  },
  filename: function (req, file, cb) {
    if (file.mimetype === "application/pdf")
      cb(null, uuidv4() + path.extname(file.originalname));
    // This setup will save the file with its field name, a timestamp, and its original extension
    else cb(new Error("Only Pdf Files are allowed"));
  },
});

module.exports = storage;
