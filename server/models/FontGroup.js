const mongoose = require("mongoose");

const FontGroupSchema = new mongoose.Schema({
  name: String,
  fontIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Font" }],
});

module.exports = mongoose.model("FontGroup", FontGroupSchema);
