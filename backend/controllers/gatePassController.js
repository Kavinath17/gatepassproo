const GatePassModel = require("../models/GatePassModel");
const sendEmail = require("../utils/sendEmail");
const db = require("../config/db");

exports.getStudentGatePasses = async (req, res) => {
  const { student_id } = req.params;

  try {
    const passes = await GatePassModel.findByStudentId(student_id);
    res.json(passes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Function to get all pending gate passes
exports.getPendingGatePasses = async (req, res) => {
  try {
    const pendingPasses = await GatePassModel.findAllPendingPasses();
    res.json(pendingPasses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getGatePassesForSecurity = async (req, res) => {
  try {
    const [passes] = await db.execute(
      `SELECT gp.*, s.name AS student_name, s.sin_number, s.department 
       FROM gate_pass gp 
       JOIN students s ON gp.student_id = s.id 
       WHERE gp.status IN ('Approved', 'Exited') 
       ORDER BY gp.date DESC, gp.time DESC`
    );

    res.json(passes);
  } catch (error) {
    console.error("❌ Error fetching gate passes for security:", error);
    res.status(500).json({ message: "Server error", error });
  }
}; 
// Function to update the status of a gate pass
exports.updateGatePassStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await GatePassModel.updateStatus(id, status);
    res.json({ message: "Gate pass status updated!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.getPendingApprovals = async (req, res) => {
  const { role } = req.params; // role = "class_advisor", "hod", "principal", "warden"

  try {
    const pendingPasses = await GatePassModel.getPendingApprovals(role);
    res.json(pendingPasses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getApprovedGatePasses = async (req, res) => {
  try {
    const [passes] = await db.execute(
      "SELECT gp.*, s.name AS student_name, s.sin_number, s.department FROM gate_pass gp JOIN students s ON gp.student_id = s.id WHERE gp.status = 'Approved'"
    );

    res.json(passes);
  } catch (error) {
    console.error("❌ Error fetching approved gate passes:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
// Function for security to verify gate pass
exports.verifyGatePass = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await GatePassModel.updateSecurityVerification(id, status);
    res.json({ message: `Gate pass ${status} by security.` });
  } catch (error) {
    console.error("Error in verifyGatePass:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.submitGatePass = async (req, res) => {
  try {
    const { student_id, reason, date, time } = req.body;

    // Fetch Student Details
    const [student] = await db.execute(
      "SELECT name, sin_number, email, department, type FROM students WHERE id = ?",
      [student_id]
    );

    if (student.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { name, sin_number, email, department, type } = student[0];

    // Fetch Class Advisor Email
    const [advisor] = await db.execute(
      "SELECT email FROM staff WHERE designation = 'class_advisor' AND department = ?",
      [department]
    );

    if (advisor.length === 0) {
      return res.status(404).json({ message: "Class Advisor not found" });
    }
    console.log("📧 Sending email to:", advisor[0].email); // ✅ Check the fetched email

    const staffEmail = advisor[0].email;

    // Store gate pass request
    const [insertResult] = await db.execute(
      "INSERT INTO gate_pass (student_id, reason, date, time, status, student_type) VALUES (?, ?, ?, ?, 'Pending', ?)",
      [student_id, reason, date, time, type]
    );

    const gatePassId = insertResult.insertId; // Get inserted gate pass ID

    // Send Email Notification
    await sendEmail(
      staffEmail,
      "Gate Pass Approval Request",
      `
        <p>🏫 <b>Gate Pass Request</b></p>
        <p><b>Student Name:</b> ${name}</p>
        <p><b>SIN Number:</b> ${sin_number}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Reason:</b> ${reason}</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Time:</b> ${time}</p>
        <p><b>Student Type:</b> ${type}</p>
        <p>Please review and approve this request in the Gate Pass Management System.</p>
      `
    );

    res.status(201).json({
      message: "Gate pass submitted successfully and email sent for approval",
      gatePassId,
    });
  } catch (error) {
    console.error("Error submitting gate pass:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Function to approve/reject gate pass
exports.approveGatePass = async (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;

  try {
    const validRoles = ["class_advisor", "hod", "principal", "warden"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    console.log(`✅ Processing approval by: ${role} for Gate Pass ID: ${id}`);

    // Update approval field
    await db.execute(`UPDATE gate_pass SET ${role}_approval = ? WHERE id = ?`, [
      status,
      id,
    ]);

    if (status === "Rejected") {
      await db.execute(
        "UPDATE gate_pass SET status = 'Rejected' WHERE id = ?",
        [id]
      );
      console.log(`❌ Gate pass ${id} rejected by ${role}`);
      return res.json({ message: `Gate pass Rejected by ${role}` });
    }

    // Fetch updated gate pass and student details
    const [result] = await db.execute(
      `
      SELECT gp.student_id, gp.reason, gp.date, gp.time,
             gp.class_advisor_approval, gp.hod_approval, gp.principal_approval, gp.warden_approval, gp.student_type,
             s.name AS student_name, s.email AS student_email, s.sin_number
      FROM gate_pass gp
      JOIN students s ON gp.student_id = s.id
      WHERE gp.id = ?
    `,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Gate Pass not found" });
    }

    const {
      student_id,
      student_name,
      student_email,
      reason,
      date,
      time,
      sin_number,
      class_advisor_approval,
      hod_approval,
      principal_approval,
      warden_approval,
      student_type,
    } = result[0];

    console.log("📊 Current Approval Status:");
    console.log("   - Class Advisor:", class_advisor_approval);
    console.log("   - HOD:", hod_approval);
    console.log("   - Principal:", principal_approval);
    console.log("   - Warden:", warden_approval);
    console.log("   - Student Type:", student_type);

    const isEmpty = (val) => !val || val === "Pending";

    let finalStatus = "Pending";
    let nextApprover = "";
    let nextEmail = "";

    if (class_advisor_approval === "Approved" && isEmpty(hod_approval)) {
      nextApprover = "hod";
    } else if (
      class_advisor_approval === "Approved" &&
      hod_approval === "Approved" &&
      isEmpty(principal_approval)
    ) {
      nextApprover = "principal";
    } else if (
      principal_approval === "Approved" &&
      student_type === "Hosteller" &&
      isEmpty(warden_approval)
    ) {
      nextApprover = "warden";
    } else if (
      class_advisor_approval === "Approved" &&
      hod_approval === "Approved" &&
      principal_approval === "Approved" &&
      (student_type === "Day Scholar" ||
        (student_type === "Hosteller" && warden_approval === "Approved"))
    ) {
      finalStatus = "Approved";
    }

    console.log(`🔹 Next Approver: ${nextApprover || "None (Final Approval)"}`);

    // Update gate pass status
    await db.execute("UPDATE gate_pass SET status = ? WHERE id = ?", [
      finalStatus,
      id,
    ]);

    if (nextApprover) {
      const [nextResult] = await db.execute(
        "SELECT email FROM staff WHERE designation = ?",
        [nextApprover]
      );
      if (nextResult.length > 0) {
        nextEmail = nextResult[0].email;

        const formattedMail = `
          <h2>🏫 Gate Pass Request</h2>
          <p><strong>Student Name:</strong> ${student_name}</p>
          <p><strong>SIN Number:</strong> ${sin_number}</p>
          <p><strong>Email:</strong> ${student_email}</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
        `;

        await sendEmail(
          nextEmail,
          "New Gate Pass Approval Request",
          formattedMail
        );
        console.log(`📧 Email sent to ${nextEmail}`);
      }
    } else if (finalStatus === "Approved") {
      await sendEmail(
        student_email,
        "Gate Pass Approved",
        `<p>Your gate pass request has been approved!</p>`
      );
      console.log(`📧 Final approval sent to student: ${student_email}`);
    }

    res.json({ message: `Gate pass ${status} by ${role}` });
  } catch (error) {
    console.error("❌ Error updating gate pass:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.exitGatePass = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if gate pass is approved
    const [result] = await db.execute(
      "SELECT student_id, status FROM gate_pass WHERE id = ?",
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Gate Pass not found" });
    }

    const { student_id, status } = result[0];

    if (status !== "Approved") {
      return res.status(400).json({ message: "Gate pass not approved yet" });
    }

    // Set exit time and update status
    await db.execute(
      "UPDATE gate_pass SET exit_time = NOW(), status = 'Exited' WHERE id = ?",
      [id]
    );

    // Fetch student email
    const [student] = await db.execute(
      "SELECT email FROM students WHERE id = ?",
      [student_id]
    );

    if (student.length > 0) {
      await sendEmail(
        student[0].email,
        "Gate Pass Exit Confirmed",
        "<p>You have exited the campus. Safe travels!</p>"
      );
    }

    res.json({ message: "Exit confirmed by Security" });
  } catch (error) {
    console.error("❌ Error confirming exit:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// exports.approveGatePass = async (req, res) => {
//   const { id } = req.params; // Gate Pass ID
//   const { role, status } = req.body;

//   try {
//     const validRoles = ["class_advisor", "hod", "principal", "warden"];
//     if (!validRoles.includes(role)) {
//       return res.status(400).json({ message: "Invalid role" });
//     }

//     // Update the approval field
//     await db.execute(`UPDATE gate_pass SET ${role}_approval = ? WHERE id = ?`, [
//       status,
//       id,
//     ]);

//     // If rejected, set overall status
//     if (status === "Rejected") {
//       await db.execute(
//         "UPDATE gate_pass SET status = 'Rejected' WHERE id = ?",
//         [id]
//       );
//       return res.json({ message: `Gate pass Rejected by ${role}` });
//     }

//     // Fetch updated approvals
//     const [result] = await db.execute(
//       "SELECT student_id, class_advisor_approval, hod_approval, principal_approval, warden_approval, student_type FROM gate_pass WHERE id = ?",
//       [id]
//     );

//     if (result.length === 0) {
//       return res.status(404).json({ message: "Gate Pass not found" });
//     }

//     const {
//       student_id,
//       class_advisor_approval,
//       hod_approval,
//       principal_approval,
//       warden_approval,
//       student_type,
//     } = result[0];

//     let finalStatus = "Pending";
//     let nextApprover = "";

//     if (class_advisor_approval === "Approved" && !hod_approval) {
//       nextApprover = "hod";
//     } else if (hod_approval === "Approved" && !principal_approval) {
//       nextApprover = "principal";
//     } else if (
//       principal_approval === "Approved" &&
//       student_type === "Hosteller" &&
//       !warden_approval
//     ) {
//       nextApprover = "warden";
//     } else if (
//       class_advisor_approval === "Approved" &&
//       hod_approval === "Approved" &&
//       principal_approval === "Approved" &&
//       (student_type === "Day Scholar" ||
//         (student_type === "Hosteller" && warden_approval === "Approved"))
//     ) {
//       finalStatus = "Approved";
//     }

//     // Update overall status
//     await db.execute("UPDATE gate_pass SET status = ? WHERE id = ?", [
//       finalStatus,
//       id,
//     ]);

//     // Fetch next approver email
//     if (nextApprover) {
//       const [nextApproverResult] = await db.execute(
//         "SELECT email FROM staff WHERE designation = ?",
//         [nextApprover]
//       );

//       if (nextApproverResult.length > 0) {
//         const nextEmail = nextApproverResult[0].email;
//         await sendEmail(
//           nextEmail,
//           "New Gate Pass Approval Request",
//           `<p>You have a new gate pass approval request. Please review it in the system.</p>`
//         );
//       }
//     } else if (finalStatus === "Approved") {
//       // Send final approval email to student
//       const [student] = await db.execute(
//         "SELECT email FROM students WHERE id = ?",
//         [student_id]
//       );

//       if (student.length > 0) {
//         await sendEmail(
//           student[0].email,
//           "Gate Pass Approved",
//           "<p>Your gate pass request has been approved!</p>"
//         );
//       }
//     }

//     res.json({ message: `Gate pass ${status} by ${role}` });
//   } catch (error) {
//     console.error("Error updating gate pass:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };
// Function to submit gate pass
// exports.submitGatePass = async (req, res) => {
//   try {
//     const { student_id, reason, date, time } = req.body; // Removed isHosteller

//     // Fetch Student Details (Name, SIN Number, Email, Department, Type)
//     const [student] = await db.execute(
//       "SELECT name, sin_number, email, department, type FROM students WHERE id = ?",
//       [student_id]
//     );

//     if (student.length === 0) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     const { name, sin_number, email, department, type } = student[0]; // 'type' is 'dayscholar' or 'hosteller'

//     // Fetch Class Advisor Email based on Student’s Department
//     const [advisor] = await db.execute(
//       "SELECT email FROM staff WHERE designation = 'class_advisor' AND department = ?",
//       [department]
//     );

//     if (advisor.length === 0) {
//       return res.status(404).json({ message: "Class Advisor not found" });
//     }

//     const staffEmail = advisor[0].email; // Extract Class Advisor's email

//     // Store gate pass request in the database
//     await db.execute(
//       "INSERT INTO gate_pass (student_id, reason, date, time, status, student_type) VALUES (?, ?, ?, ?, 'Pending', ?)",
//       [student_id, reason, date, time, type] // Using 'type' instead of 'isHosteller'
//     );

//     // Send Email Notification to Class Advisor
//     const subject = "Gate Pass Approval Request";
//     const emailText = `
//       🏫 Gate Pass Request 🏫

//       Student Name: ${name}
//       SIN Number: ${sin_number}
//       Email: ${email}
//       Reason: ${reason}
//       Date: ${date}
//       Time: ${time}
//       Student Type: ${type}  <!-- Will show "dayscholar" or "hosteller" -->

//       Please review and approve the request in the Gate Pass Management System.
//     `;

//     await sendEmail(staffEmail, subject, emailText);

//     res.status(201).json({
//       message: "Gate pass submitted successfully and email sent for approval",
//     });
//   } catch (error) {
//     console.error("Error submitting gate pass:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // Function to fetch student's gate passes

// // Function to approve/reject gate pass based on role
// exports.approveGatePass = async (req, res) => {
//   const { id } = req.params; // Gate Pass ID from URL params
//   const { role, status } = req.body; // role = "class_advisor", "hod", "principal", "warden"

//   try {
//     const validRoles = ["class_advisor", "hod", "principal", "warden"];
//     if (!validRoles.includes(role)) {
//       return res.status(400).json({ message: "Invalid role" });
//     }

//     // Update the approval field dynamically based on role
//     const updateQuery = `UPDATE gate_pass SET ${role}_approval = ? WHERE id = ?`;
//     await db.execute(updateQuery, [status, id]);

//     // If rejected, set the overall status to "Rejected"
//     if (status === "Rejected") {
//       await db.execute(
//         "UPDATE gate_pass SET status = 'Rejected' WHERE id = ?",
//         [id]
//       );
//       return res.json({ message: `Gate pass Rejected by ${role}` });
//     }

//     // Fetch updated approvals and student type
//     const [result] = await db.execute(
//       "SELECT class_advisor_approval, hod_approval, principal_approval, warden_approval, student_type FROM gate_pass WHERE id = ?",
//       [id]
//     );

//     if (result.length > 0) {
//       const {
//         class_advisor_approval,
//         hod_approval,
//         principal_approval,
//         warden_approval,
//         student_type,
//       } = result[0];

//       let finalStatus = "Pending";

//       // If all required approvals are "Approved", update status
//       if (
//         class_advisor_approval === "Approved" &&
//         hod_approval === "Approved" &&
//         principal_approval === "Approved" &&
//         (student_type === "Day Scholar" ||
//           (student_type === "Hosteller" && warden_approval === "Approved"))
//       ) {
//         finalStatus = "Approved";
//       }

//       // Update overall status if all approvals are done
//       await db.execute("UPDATE gate_pass SET status = ? WHERE id = ?", [
//         finalStatus,
//         id,
//       ]);
//     }

//     res.json({ message: `Gate pass ${status} by ${role}` });
//   } catch (error) {
//     console.error("Error updating gate pass:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// exports.approveGatePass = async (req, res) => {
//   const { id } = req.params; // Gate Pass ID from URL params
//   const { role, status } = req.body; // role = "class_advisor", "hod", "principal", "warden"

//   try {
//     const validRoles = ["class_advisor", "hod", "principal", "warden"];
//     if (!validRoles.includes(role)) {
//       return res.status(400).json({ message: "Invalid role" });
//     }

//     // Update the specific approval field in the database
//     const updateQuery = `UPDATE gate_pass SET ${role}_approval = ? WHERE id = ?`;
//     await db.execute(updateQuery, [status, id]);

//     // Check if all required approvals are "Approved"
//     const [result] = await db.execute(
//       "SELECT class_advisor_approval, hod_approval, principal_approval, warden_approval, student_type FROM gate_pass WHERE id = ?",
//       [id]
//     );

//     if (result.length > 0) {
//       const {
//         class_advisor_approval,
//         hod_approval,
//         principal_approval,
//         warden_approval,
//         student_type,
//       } = result[0];

//       let finalStatus = "Pending";
//       if (
//         class_advisor_approval === "Approved" &&
//         hod_approval === "Approved" &&
//         principal_approval === "Approved" &&
//         (student_type === "Day Scholar" ||
//           (student_type === "Hosteller" && warden_approval === "Approved"))
//       ) {
//         finalStatus = "Approved";
//       }

//       // Update the overall status if all approvals are done
//       await db.execute("UPDATE gate_pass SET status = ? WHERE id = ?", [
//         finalStatus,
//         id,
//       ]);
//     }

//     res.json({ message: `Gate pass ${status} by ${role}` });
//   } catch (error) {
//     console.error("Error updating gate pass:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };
// exports.approveGatePass = async (req, res) => {
//   const { id } = req.params;
//   const { role, status } = req.body; // role = "class_advisor", "hod", "principal", "warden"

//   try {
//     const validRoles = ["class_advisor", "hod", "principal", "warden"];

//     if (!validRoles.includes(role)) {
//       return res.status(400).json({ message: "Invalid role" });
//     }

//     await GatePassModel.updateApproval(id, role, status);
//     res.json({ message: `Gate pass ${status} by ${role}` });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// Function to fetch pending approvals for a specific role

// const GatePassModel = require("../models/GatePassModel");
// const sendEmail = require("../utils/sendEmail");
// const db = require("../config/db");

// exports.applyGatePass = async (req, res) => {
//   const { student_id, reason, date, time, isHosteller } = req.body;

//   try {
//     await GatePassModel.create({ student_id, reason, date, time, isHosteller });
//     res.status(201).json({ message: "Gate pass applied successfully!" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// exports.getStudentGatePasses = async (req, res) => {
//   const { student_id } = req.params;

//   try {
//     const passes = await GatePassModel.findByStudentId(student_id);
//     res.json(passes);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// exports.getPendingGatePasses = async (req, res) => {
//   try {
//     const pendingPasses = await GatePassModel.findAllPendingPasses();
//     res.json(pendingPasses);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// exports.updateGatePassStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   try {
//     await GatePassModel.updateStatus(id, status);
//     res.json({ message: "Gate pass status updated!" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };
// exports.approveGatePass = async (req, res) => {
//   const { id } = req.params;
//   const { role, status } = req.body; // role = "class_advisor", "hod", "principal", "warden"

//   try {
//     const validRoles = ["class_advisor", "hod", "principal", "warden"];

//     if (!validRoles.includes(role)) {
//       return res.status(400).json({ message: "Invalid role" });
//     }

//     await GatePassModel.updateApproval(id, role, status);
//     res.json({ message: `Gate pass ${status} by ${role}` });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// exports.getPendingApprovals = async (req, res) => {
//   const { role } = req.params; // role = "class_advisor", "hod", "principal", "warden"

//   try {
//     const pendingPasses = await GatePassModel.getPendingApprovals(role);
//     res.json(pendingPasses);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };
// // gatePassController.js
// exports.verifyGatePass = async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   try {
//     // Update the security verification status in the database
//     await GatePassModel.updateSecurityVerification(id, status);

//     res.json({ message: `Gate pass ${status} by security.` });
//   } catch (error) {
//     console.error("Error in verifyGatePass:", error); // Log the error to the console
//     res
//       .status(500)
//       .json({ message: "Server error", error: error.message || error });
//   }
// };

// // Function to submit gate pass
// exports.submitGatePass = async (req, res) => {
//   try {
//     const { reason, date, time } = req.body;
//     const studentId = req.user.id; // Extract from authMiddleware

//     // Fetch Student & Staff Details from DB
//     const [student] = await db.execute(
//       "SELECT name, email FROM students WHERE id = ?",
//       [studentId]
//     );
//     const [staff] = await db.execute(
//       "SELECT email FROM staff WHERE designation = 'class_advisor' LIMIT 1"
//     );

//     if (student.length === 0 || staff.length === 0) {
//       return res.status(404).json({ message: "Student or Staff not found" });
//     }

//     const studentName = student[0].name;
//     const studentEmail = student[0].email;
//     const staffEmail = staff[0].email;

//     // Store gate pass request in the database
//     await db.execute(
//       "INSERT INTO gate_pass (student_id, reason, date, time, status) VALUES (?, ?, ?, ?, 'Pending')",
//       [studentId, reason, date, time]
//     );

//     // Send Email Notification to Staff
//     const subject = "Gate Pass Approval Request";
//     const emailText = `Dear Staff,

//     A new Gate Pass request has been submitted by ${studentName} (${studentEmail}).
//     Reason: ${reason}
//     Date & Time: ${date} at ${time}

//     Please review and approve the request.

//     Regards,
//     Gate Pass Management System`;

//     await sendEmail(staffEmail, subject, emailText);

//     res.status(201).json({
//       message: "Gate pass submitted successfully and email sent for approval",
//     });
//   } catch (error) {
//     console.error("Error submitting gate pass:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// exports.verifyGatePass = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Fetch the gate pass details based on the ID
//     const gatePass = await GatePassModel.findById(id);

//     // Check if the gate pass has been approved by all relevant parties
//     if (
//       gatePass.status === "Approved" &&
//       gatePass.warden_approval === "Approved"
//     ) {
//       // Update status to 'Verified' after Security verifies
//       await GatePassModel.updateStatus(id, "Verified");
//       res.json({ message: "Gate pass successfully verified by Security!" });
//     } else {
//       res.status(400).json({ message: "Gate pass is not fully approved yet." });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// const GatePassModel = require("../models/GatePassModel");

// exports.applyGatePass = async (req, res) => {
//   const { student_id, reason, date, time } = req.body;

//   try {
//     await GatePassModel.create({ student_id, reason, date, time });
//     res.status(201).json({ message: "Gate pass applied successfully!" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// exports.getStudentGatePasses = async (req, res) => {
//   const { student_id } = req.params;

//   try {
//     const passes = await GatePassModel.findByStudentId(student_id);
//     res.json(passes);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// exports.updateGatePassStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   try {
//     await GatePassModel.updateStatus(id, status);
//     res.json({ message: "Gate pass status updated!" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };
