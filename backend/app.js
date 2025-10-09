const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const studentRoutes = require("./routes/studentRoutes");
const staffRoutes = require("./routes/staffRoutes");
const securityRoutes = require("./routes/securityRoutes");
const gatePassRoutes = require("./routes/gatePassRoutes");
const visitorRoutes = require("./routes/visitorRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/gatepass", gatePassRoutes);
app.use("/api/visitors", visitorRoutes);

module.exports = app;
