const mysql = require("mysql2/promise"); // Use promise-based version
const dotenv = require("dotenv");

dotenv.config();

// Use createPool() instead of createConnection()
const db = mysql.createPool({
  host: process.env.DB_HOST, // Example: "localhost"
  user: process.env.DB_USER, // Example: "root"
  password: process.env.DB_PASS, // Your MySQL password
  database: process.env.DB_NAME, // Example: "gate_pass_system"
  waitForConnections: true,
  connectionLimit: 10, // Allows multiple connections
  queueLimit: 0,
});

// Test the database connection with async/await
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log("Connected to MySQL database!");
    connection.release(); // Release connection back to the pool
  } catch (err) {
    console.error("Database connection failed: ", err);
  }
}

testConnection();

module.exports = db;
// const mysql = require("mysql2");
// const dotenv = require("dotenv");

// dotenv.config();

// // Use createPool() instead of createConnection()
// const db = mysql.createPool({
//   host: process.env.DB_HOST, // Example: "localhost"
//   user: process.env.DB_USER, // Example: "root"
//   password: process.env.DB_PASS, // Your MySQL password
//   database: process.env.DB_NAME, // Example: "gate_pass_system"
//   waitForConnections: true,
//   connectionLimit: 10, // Allows multiple connections
//   queueLimit: 0,
// });

// // Test the database connection
// db.getConnection((err, connection) => {
//   if (err) {
//     console.error("Database connection failed: ", err);
//     return;
//   }
//   console.log("Connected to MySQL database!");
//   connection.release(); // Release connection back to the pool
// });

// module.exports = db;
// const mysql = require("mysql2");
// const dotenv = require("dotenv");
// dotenv.config();
// const db = mysql.createConnection({
//   host: process.env.DB_HOST, // Example: "localhost"
//   user: process.env.DB_USER, // Example: "root"
//   password: process.env.DB_PASS, // Your MySQL password
//   database: process.env.DB_NAME, // Example: "gate_pass_system"
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Database connection failed: ", err);
//     return;
//   }
//   console.log("Connected to MySQL database!");
// });

// module.exports = db;
