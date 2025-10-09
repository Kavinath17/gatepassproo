const express = require("express");
const {
  applyGatePass,
  getStudentGatePasses,
  getPendingGatePasses,
  updateGatePassStatus,
  approveGatePass,
  getPendingApprovals,
  verifyGatePass,
  submitGatePass,
  exitGatePass,
  getApprovedGatePasses,
  getGatePassesForSecurity,
} = require("../controllers/gatePassController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// Student Routes
// router.post("/apply", applyGatePass); // Apply for a gate pass
router.get("/:student_id", getStudentGatePasses); // Get a student's gate passes
router.post("/submit", authenticateUser, submitGatePass);

// Staff Approval Routes
router.put("/:id/approve", approveGatePass); // Approve/reject gate pass
router.get("/pending/:role", getPendingApprovals); // Get pending approvals for staff role

// General Gate Pass Routes
router.get("/pending", getPendingGatePasses); // Get all pending gate passes
router.put("/:id/status", updateGatePassStatus); // Update gate pass final status

router.get("/security/approved", getApprovedGatePasses); // Get approved gate passes for security
router.put("/:id/verify", verifyGatePass); // Endpoint for Security to verify
router.put("/exit/:id", exitGatePass);
router.get("/security/all", getGatePassesForSecurity);
module.exports = router;
// const express = require("express");
// const {
//   applyGatePass,
//   getStudentGatePasses,
//   getPendingGatePasses,
//   updateGatePassStatus,
// } = require("../controllers/gatePassController");

// const router = express.Router();

// router.post("/apply", applyGatePass);
// router.get("/pending", getPendingGatePasses); // ✅ New route for staff
// router.get("/:student_id", getStudentGatePasses);
// router.put("/:id/status", updateGatePassStatus);

// module.exports = router;
// const express = require("express");
// const {
//   applyGatePass,
//   getStudentGatePasses,
//   updateGatePassStatus,
// } = require("../controllers/gatePassController");

// const router = express.Router();

// router.post("/apply", applyGatePass);
// router.get("/:student_id", getStudentGatePasses);
// router.put("/:id/status", updateGatePassStatus);

// module.exports = router;
