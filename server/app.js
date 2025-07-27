const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fontRoutes = require("./routes/fontRoutes");
const fontGroupRoutes = require("./routes/fontGroupRoutes");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/fonts", fontRoutes);
app.use("/api/font-groups", fontGroupRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("Mongo error:", err));
