const db = require("../config/db");
const SecurityModel = require("../models/SecurityModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerSecurity = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!email.endsWith("@shanmugha.edu.in")) {
    return res.status(400).json({ message: "Only college email is allowed!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const securityData = { name, email, password: hashedPassword, phone };
    await SecurityModel.create(securityData);
    res.status(201).json({ message: "Security registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.loginSecurity = async (req, res) => {
  const { email, password } = req.body;

  try {
    const security = await SecurityModel.findByEmail(email);
    if (!security)
      return res.status(404).json({ message: "Security staff not found!" });

    const validPassword = await bcrypt.compare(password, security.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid password!" });

    const token = jwt.sign(
      { id: security.id, email: security.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.getSecurityProfile = async (req, res) => {
  try {
    console.log("Fetching Security Profile...");
    console.log("User Details:", req.user);

    const securityId = req.user.id;
    console.log("Extracted Security ID:", securityId);

    if (!securityId) {
      return res.status(400).json({ message: "Invalid security ID" });
    }

    const query = `SELECT id, name, email, phone FROM security WHERE id = ?`;

    console.log("Executing database query...");
    const [security] = await db.execute(query, [securityId]);

    console.log("Query executed. Security data:", security);

    if (security.length === 0) {
      console.log("Security staff not found");
      return res.status(404).json({ message: "Security staff not found" });
    }

    console.log("Security Profile fetched successfully");
    res.json(security[0]);
  } catch (error) {
    console.error("Error fetching security profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// exports.getSecurityProfile = async (req, res) => {
//   try {
//     const securityId = req.user.id;
//     const query = `SELECT id, name, email, phone FROM security WHERE id = ?`;
//     db.query(query, [securityId], (err, results) => {
//       if (err)
//         return res.status(500).json({ message: "Database error", error: err });
//       if (results.length === 0)
//         return res.status(404).json({ message: "Security staff not found" });
//       res.json(results[0]);
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };
