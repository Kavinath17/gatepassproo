const express = require("express");
const router = express.Router();
const visitorController = require("../controllers/visitorController");

router.post("/submit", visitorController.submitVisitor);
// Approve/Reject visitor
router.put("/update-status/:id", visitorController.updateVisitorStatus);
router.get("/approved", visitorController.getApprovedVisitors);

module.exports = router;
