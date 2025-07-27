const Font = require("../models/Font");

exports.uploadFont = async (req, res) => {
  const font = new Font({
    name: req.file.originalname,
    fileUrl: `/uploads/${req.file.filename}`,
  });

  await font.save();
  res.status(201).json(font);
};

exports.getFonts = async (req, res) => {
  const fonts = await Font.find();
  res.json(fonts);
};
