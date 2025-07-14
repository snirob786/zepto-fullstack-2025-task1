// src/server.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Database = require("./database");
const FontManager = require("./fontManager");
const GroupManager = require("./groupManager");
require("dotenv").config();

const app = express();
const upload = multer({ dest: "uploads/temp/" });
const db = new Database();

app.use(express.json());
app.use(express.static("public")); // Serve frontend
app.use("/fonts", express.static("uploads/fonts")); // Serve font files

// Initialize database
let fontManager, groupManager;
db.connect().then((database) => {
  fontManager = new FontManager(database);
  groupManager = new GroupManager(database);
});

// Font upload
app.post("/api/fonts", upload.single("font"), async (req, res) => {
  try {
    const result = await fontManager.uploadFont(req.file);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get fonts
app.get("/api/fonts", async (req, res) => {
  try {
    const fonts = await fontManager.getFonts();
    res.json({ success: true, data: fonts });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Delete font
app.delete("/api/fonts/:id", async (req, res) => {
  try {
    await fontManager.deleteFont(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Create group
app.post("/api/groups", async (req, res) => {
  try {
    const { title, fontIds } = req.body;
    const result = await groupManager.createGroup(title, fontIds);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get groups
app.get("/api/groups", async (req, res) => {
  try {
    const groups = await groupManager.getGroups();
    res.json({ success: true, data: groups });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Update group
app.put("/api/groups/:id", async (req, res) => {
  try {
    const { title, fontIds } = req.body;
    await groupManager.updateGroup(req.params.id, title, fontIds);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Delete group
app.delete("/api/groups/:id", async (req, res) => {
  try {
    await groupManager.deleteGroup(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
