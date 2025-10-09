const express = require("express");
const {
  registerStudent,
  loginStudent,
  getStudentProfile,
} = require("../controllers/studentController");
const { authenticateUser } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/profile", authenticateUser, getStudentProfile);

module.exports = router;
