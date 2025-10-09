require("dotenv").config();
const express = require("express");
const db = require("./config/db"); // Import MySQL connection
const app = require("./app"); // Import app.js

const listEndpoints = require("express-list-endpoints"); // Import the package

const PORT = process.env.PORT || 5000;

// Log all registered API routes
console.log("Registered API Endpoints:", listEndpoints(app));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// const express = require("express");
// // const db = require("./config/db");
// require("dotenv").config(); // Import database connection
// // const app = require("./app");
// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(express.json());

// // Simple test route
// app.get("/", (req, res) => {
//   res.send("Gate Pass Management System Backend is Running!");
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// require("dotenv").config();
// const express = require("express");
// const db = require("./config/db"); // Import MySQL connection
// const app = require("./app"); // Import app.js

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
