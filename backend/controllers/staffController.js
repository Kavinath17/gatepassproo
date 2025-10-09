const db = require("../config/db");
const StaffModel = require("../models/StaffModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerStaff = async (req, res) => {
  const { staff_code, name, email, password, department, designation, phone } =
    req.body;

  if (!email.endsWith("@shanmugha.edu.in")) {
    return res.status(400).json({ message: "Only college email is allowed!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const staffData = {
      staff_code,
      name,
      email,
      password: hashedPassword,
      department,
      designation,
      phone,
    };
    await StaffModel.create(staffData);
    res.status(201).json({ message: "Staff registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.loginStaff = async (req, res) => {
  const { email, password } = req.body;

  try {
    const staff = await StaffModel.findByEmail(email);
    if (!staff) return res.status(404).json({ message: "Staff not found!" });

    const validPassword = await bcrypt.compare(password, staff.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid password!" });

    const token = jwt.sign(
      { id: staff.id, email: staff.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.getStaffProfile = async (req, res) => {
  try {
    console.log("Fetching Staff Profile..."); // Debugging step
    console.log("User Details:", req.user); // Check if req.user is correctly populated

    const staffId = req.user.id; // Ensure ID is correctly extracted
    console.log("Extracted Staff ID:", staffId);

    if (!staffId) {
      return res.status(400).json({ message: "Invalid staff ID" });
    }

    const query = `SELECT id, staff_code, name, email, department, designation, phone FROM staff WHERE id = ?`;

    console.log("Executing database query...");
    const [staff] = await db.execute(query, [staffId]);

    console.log("Query executed. Staff data:", staff);

    if (staff.length === 0) {
      console.log("Staff not found");
      return res.status(404).json({ message: "Staff not found" });
    }

    console.log("Staff Profile fetched successfully");
    res.json(staff[0]);
  } catch (error) {
    console.error("Error fetching staff profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
// exports.getStaffProfile = async (req, res) => {
//   try {
//     const staffId = req.user.id;
//     const query = `SELECT id, staff_code, name, email, department, designation, phone FROM staff WHERE id = ?`;
//     db.query(query, [staffId], (err, results) => {
//       if (err)
//         return res.status(500).json({ message: "Database error", error: err });
//       if (results.length === 0)
//         return res.status(404).json({ message: "Staff not found" });
//       res.json(results[0]);
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };
