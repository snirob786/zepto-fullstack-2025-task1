const FontGroup = require("../models/FontGroup");

exports.createGroup = async (req, res) => {
  const { name, fontIds } = req.body;
  if (!fontIds || fontIds.length < 2)
    return res.status(400).json({ error: "Minimum 2 fonts required" });

  const group = new FontGroup({ name, fontIds });
  await group.save();
  res.status(201).json(group);
};

exports.getGroups = async (req, res) => {
  const groups = await FontGroup.find().populate("fontIds");
  res.json(groups);
};

exports.deleteGroup = async (req, res) => {
  await FontGroup.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};

exports.updateGroup = async (req, res) => {
  const { fontIds, name } = req.body;
  const updated = await FontGroup.findByIdAndUpdate(
    req.params.id,
    { fontIds, name },
    { new: true }
  );
  res.json(updated);
};
