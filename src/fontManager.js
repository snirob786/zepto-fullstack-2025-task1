// src/fontManager.js
const path = require("path");
const fs = require("fs").promises;
const { ObjectId } = require("mongodb"); // Import ObjectId

class FontManager {
  constructor(db) {
    this.db = db;
  }

  async uploadFont(file) {
    if (
      !file ||
      file.mimetype !== "application/octet-stream" ||
      path.extname(file.originalname) !== ".ttf"
    ) {
      throw new Error("Only TTF files are allowed.");
    }

    const tempDir = path.join(__dirname, "..", "uploads", "temp");
    const fontsDir = path.join(__dirname, "..", "Uploads", "fonts");
    const name = path.parse(file.originalname).name;
    const filePath = path.join(fontsDir, `${Date.now()}_${file.originalname}`);

    try {
      // Create directories if they don't exist
      await fs.mkdir(tempDir, { recursive: true });
      await fs.mkdir(fontsDir, { recursive: true });

      // Verify source file exists
      await fs.access(file.path).catch(() => {
        throw new Error(`Temporary file not found: ${file.path}`);
      });

      // Move file to fonts directory
      await fs.rename(file.path, filePath);

      // Insert into MongoDB
      const result = await this.db.collection("fonts").insertOne({
        name,
        file_path: `/fonts/${path.basename(filePath)}`,
      });

      return {
        id: result.insertedId.toString(),
        name,
        file_path: `/fonts/${path.basename(filePath)}`,
      };
    } catch (err) {
      throw new Error(`Failed to upload font: ${err.message}`);
    }
  }

  async getFonts() {
    const fonts = await this.db.collection("fonts").find().toArray();
    return fonts.map((font) => ({
      id: font._id.toString(),
      name: font.name,
      file_path: font.file_path,
    }));
  }

  async deleteFont(id) {
    try {
      console.log("🚀 ~ FontManager ~ deleteFont ~ id:", id);
      const font = await this.db
        .collection("fonts")
        .findOne({ _id: new ObjectId(id) });
      if (!font) throw new Error("Font not found.");
      console.log(
        "🚀 ~ FontManager ~ deleteFont ~ font.file_path:",
        font.file_path
      );
      console.log("🚀 ~ FontManager ~ deleteFont ~ __dirname:", __dirname);
      await fs
        .unlink(path.join(__dirname, "..", "uploads", font.file_path))
        .catch((err) => {
          throw new Error(`Failed to delete font file: ${err.message}`);
        });
      await this.db.collection("fonts").deleteOne({ _id: new ObjectId(id) }); // Use imported ObjectId
      return true;
    } catch (err) {
      throw new Error(`Failed to delete font: ${err.message}`);
    }
  }
}

module.exports = FontManager;
