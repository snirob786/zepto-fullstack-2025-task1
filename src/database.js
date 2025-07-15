const { MongoClient } = require("mongodb");
require("dotenv").config();

class Database {
  constructor() {
    this.uri = process.env.MONGODB_URI;
    this.client = new MongoClient(this.uri);
    this.dbName = "font_group_system";
    this.db = null;
  }

  async connect() {
    if (!this.db) {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      await this.initCollections();
    }
    return this.db;
  }

  async initCollections() {
    const collections = await this.db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);
    if (!collectionNames.includes("fonts")) {
      await this.db.createCollection("fonts");
    }
    if (!collectionNames.includes("font_groups")) {
      await this.db.createCollection("font_groups");
    }
  }

  async close() {
    await this.client.close();
  }
}

module.exports = Database;
