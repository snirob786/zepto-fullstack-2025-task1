const mongoose = require("mongoose");

const FontSchema = new mongoose.Schema({
  name: String,
  fileUrl: String,
});

module.exports = mongoose.model("Font", FontSchema);
