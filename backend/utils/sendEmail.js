const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent) => {
  try {
    console.log(`📧 Preparing to send email to: ${to}`);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: true, // Ensures the connection is secure
    });

    const mailOptions = {
      from: `"Gate Pass System" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent, // Email body in HTML format
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}: ${info.response}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error.message);
  }
};

module.exports = sendEmail;
// const nodemailer = require("nodemailer");

// const sendEmail = async (to, subject, htmlContent) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER, // from: `"${studentName}" <${process.env.EMAIL_USER}>`,
//       to: to,
//       subject: subject,
//       html: htmlContent, // Using HTML format
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("✅ Email sent successfully: " + info.response);
//   } catch (error) {
//     console.error("❌ Error sending email:", error);
//   }
// };

// module.exports = sendEmail;
// const nodemailer = require("nodemailer");
// const pool = require("../config/db"); // Ensure correct DB connection

// const sendEmail = async (
//   student_id,
//   to,
//   subject,
//   reason,
//   date,
//   time,
//   isHosteller
// ) => {
//   try {
//     // Fetch student details from the database
//     const [student] = await pool.query(
//       "SELECT name, sin_number FROM students WHERE id = ?",
//       [student_id]
//     );

//     if (!student || student.length === 0) {
//       console.error("❌ Student not found in database.");
//       return;
//     }

//     const { name, sin_number } = student[0]; // Extract student details

//     // Email content with student details
//     const emailContent = `
//       🏫 Gate Pass Request 🏫

//       📌 **Student Details**
//       - **Name:** ${name}
//       - **SIN Number:** ${sin_number}

//       📌 **Gate Pass Request**
//       - **Reason:** ${reason}
//       - **Date:** ${date}
//       - **Time:** ${time}
//       - **Hosteller:** ${isHosteller ? "Yes" : "No"}

//       🔗 **Action Required:** Please review and approve this request in the Gate Pass Management System.
//     `;

//     // Configure email transport
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER, // College email
//         pass: process.env.EMAIL_PASS, // Email app password
//       },
//     });

//     // Mail options
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: to, // Class Advisor's email
//       subject: subject,
//       text: emailContent, // Email content with student details
//     };

//     // Send email
//     const info = await transporter.sendMail(mailOptions);
//     console.log("✅ Email sent successfully: " + info.response);
//   } catch (error) {
//     console.error("❌ Error sending email:", error);
//   }
// };

// module.exports = sendEmail;
// const nodemailer = require("nodemailer");

// const sendEmail = async (to, subject, text) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail", // or use SMTP settings of your email provider
//       auth: {
//         user: process.env.EMAIL_USER, // Your email (store in .env)
//         pass: process.env.EMAIL_PASS, // Your email password (store in .env)
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: to,
//       subject: subject,
//       text: text,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent: " + info.response);
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };

// module.exports = sendEmail;
