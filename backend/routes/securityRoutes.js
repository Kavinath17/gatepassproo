const express = require("express");
const {
  registerSecurity,
  loginSecurity,
  getSecurityProfile,
} = require("../controllers/securityController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerSecurity);
router.post("/login", loginSecurity);
router.get("/profile", authenticateUser, getSecurityProfile);

module.exports = router;
