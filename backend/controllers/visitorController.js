const VisitorModel = require("../models/VisitorModel");
const sendEmail = require("../utils/sendEmail");

exports.submitVisitor = async (req, res) => {
  const {
    name,
    phone,
    reason,
    in_time,
    expected_exit_time,
    concerned_person_name,
    concerned_person_phone,
  } = req.body;

  try {
    console.log("h")
    // Step 1: Get email of concerned staff
    const staffEmail = await VisitorModel.findStaffEmail(
      concerned_person_name,
      concerned_person_phone
    );

    if (!staffEmail) {
      return res.status(404).json({ message: "Concerned staff not found." });
    }

    // Step 2: Insert visitor request into DB
    await VisitorModel.create({
      name,
      phone,
      reason,
      in_time,
      expected_exit_time,
      concerned_person_name,
      concerned_person_email: staffEmail,
    });

    // Step 3: Send email
    const emailContent = `
      <h3>🚪 Visitor Approval Request</h3>
      <p><strong>Visitor Name:</strong> ${name}</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p><strong>In Time:</strong> ${in_time}</p>
      <p><strong>Expected Exit Time:</strong> ${expected_exit_time}</p>
      <p>Please login to your staff dashboard to approve or reject this request.</p>
    `;

    await sendEmail(staffEmail, "Visitor Approval Request", emailContent);

    res
      .status(201)
      .json({ message: "Visitor request submitted and email sent." });
  } catch (error) {
    console.error("❌ Error submitting visitor:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.updateVisitorStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "Approved" or "Rejected"

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }
  try {
    // Update status
    await VisitorModel.updateStatus(id, status);
    res.status(200).json({ message: `Visitor status updated to ${status}` });
  } catch (error) {
    console.error("❌ Error updating visitor status:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.getApprovedVisitors = async (req, res) => {
  try {
    const approvedVisitors = await VisitorModel.getApprovedVisitors();
    res.status(200).json(approvedVisitors);
  } catch (error) {
    console.error("❌ Error fetching approved visitors:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
