const db = require("../config/db");
const StudentModel = require("../models/StudentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
console.log("Database connection established:", !!db);

exports.registerStudent = async (req, res) => {
  const {
    name,
    email,
    password,
    year,
    sin_number,
    department,
    phone,
    dob,
    address,
    type,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !year ||
    !sin_number ||
    !department ||
    !phone ||
    !dob ||
    !address ||
    !type
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  if (!email.endsWith("@shanmugha.edu.in")) {
    return res.status(400).json({ message: "Only college email is allowed!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const studentData = {
      name,
      email,
      password: hashedPassword,
      year,
      sin_number,
      department,
      phone,
      dob,
      address,
      type,
    };
    await StudentModel.create(studentData);
    res.status(201).json({ message: "Student registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await StudentModel.findByEmail(email);
    if (!student)
      return res.status(404).json({ message: "Student not found!" });

    const validPassword = await bcrypt.compare(password, student.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid password!" });

    const token = jwt.sign(
      { id: student.id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.getStudentProfile = async (req, res) => {
  try {
    console.log("Profile API hit"); // Check if API is getting called

    const startTime = Date.now(); // Start time tracking

    const studentId = req.user.id; // Extract user ID from authMiddleware
    console.log("Extracted Student ID:", studentId);

    if (!studentId) {
      console.log("Error: Student ID is missing from request");
      return res
        .status(400)
        .json({ message: "Invalid request. Student ID missing." });
    }

    const query = `SELECT id, name, email, year, sin_number, department, phone, dob, address, type FROM students WHERE id = ?`;

    console.log("Executing database query...");
    const [student] = await db.execute(query, [studentId]); // Replaced `pool` with `db`

    console.log(
      "Database query executed, time taken:",
      Date.now() - startTime,
      "ms"
    );

    if (student.length === 0) {
      console.log("Student not found");
      return res.status(404).json({ message: "Student not found" });
    }

    console.log("Profile fetched successfully:", student[0]);
    res.json(student[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// exports.getStudentProfile = async (req, res) => {
//   try {
//     const studentId = req.user.id; // Extract user ID from authMiddleware
//     const query = `SELECT id, name, email, year, sin_number, department, phone, dob, address, type FROM students WHERE id = ?`;
//     db.query(query, [studentId], (err, results) => {
//       if (err)
//         return res.status(500).json({ message: "Database error", error: err });
//       if (results.length === 0)
//         return res.status(404).json({ message: "Student not found" });
//       res.json(results[0]);
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };
