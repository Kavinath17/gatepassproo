const express = require("express");
const {
  registerStaff,
  loginStaff,
  getStaffProfile,
} = require("../controllers/staffController");
const { authenticateUser } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerStaff);
router.post("/login", loginStaff);
router.get("/profile", authenticateUser, getStaffProfile);

module.exports = router;
