// src/groupManager.js
const { ObjectId } = require("mongodb"); // Import ObjectId

class GroupManager {
  constructor(db) {
    this.db = db;
  }

  async createGroup(title, fontIds) {
    if (fontIds.length < 1) {
      throw new Error("At least two fonts are required.");
    }
    const result = await this.db
      .collection("font_groups")
      .insertOne({ title, font_ids: fontIds });
    return { id: result.insertedId.toString(), title, font_ids: fontIds };
  }

  async getGroups() {
    const groups = await this.db.collection("font_groups").find().toArray();
    return groups.map((group) => ({
      id: group._id.toString(),
      title: group.title,
      font_ids: group.font_ids,
    }));
  }

  async updateGroup(id, title, fontIds) {
    if (fontIds.length < 1) {
      throw new Error("At least two fonts are required.");
    }
    try {
      const result = await this.db.collection("font_groups").updateOne(
        { _id: new ObjectId(id) }, // Use imported ObjectId
        { $set: { title, font_ids: fontIds } }
      );
      if (result.matchedCount === 0) throw new Error("Group not found.");
      return true;
    } catch (err) {
      throw new Error(`Failed to update group: ${err.message}`);
    }
  }

  async deleteGroup(id) {
    try {
      const result = await this.db
        .collection("font_groups")
        .deleteOne({ _id: new ObjectId(id) }); // Use imported ObjectId
      if (result.deletedCount === 0) throw new Error("Group not found.");
      return true;
    } catch (err) {
      throw new Error(`Failed to delete group: ${err.message}`);
    }
  }
}

module.exports = GroupManager;
