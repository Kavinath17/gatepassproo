const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const authenticateUser = (req, res, next) => {
  const authHeader = req.header("Authorization");

  // Check if Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  // Extract the token (remove 'Bearer ')
  const token = authHeader.split(" ")[1];

  try {
    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ message: "Server configuration error: Missing JWT_SECRET" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next(); // Proceed to next middleware/controller
  } catch (error) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = { authenticateUser };
// const jwt = require("jsonwebtoken");

// // Middleware to verify JWT token
// const authenticateUser = (req, res, next) => {
//   const token = req.header("Authorization");
//   if (!token) {
//     return res
//       .status(401)
//       .json({ message: "Access Denied. No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach user data to request
//     next(); // Proceed to next middleware/controller
//   } catch (error) {
//     res.status(400).json({ message: "Invalid Token" });
//   }
// };

// module.exports = { authenticateUser };
