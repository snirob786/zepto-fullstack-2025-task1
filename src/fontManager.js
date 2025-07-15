const path = require("path");
const fs = require("fs").promises;
const { ObjectId } = require("mongodb");

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
      await fs.mkdir(tempDir, { recursive: true });
      await fs.mkdir(fontsDir, { recursive: true });
      await fs.access(file.path).catch(() => {
        throw new Error(`Temporary file not found: ${file.path}`);
      });

      await fs.rename(file.path, filePath);

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
      await this.db.collection("fonts").deleteOne({ _id: new ObjectId(id) });
      return true;
    } catch (err) {
      throw new Error(`Failed to delete font: ${err.message}`);
    }
  }
}

module.exports = FontManager;
