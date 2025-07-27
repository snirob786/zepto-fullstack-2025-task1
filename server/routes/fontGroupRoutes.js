const express = require("express");
const {
  createGroup,
  getGroups,
  deleteGroup,
  updateGroup,
} = require("../controllers/fontGroupController");

const router = express.Router();

router.post("/", createGroup);
router.get("/", getGroups);
router.delete("/:id", deleteGroup);
router.put("/:id", updateGroup);

module.exports = router;
