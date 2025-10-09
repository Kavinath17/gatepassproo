require("dotenv").config();
const sendEmail = require("./utils/sendEmail");

sendEmail(
  "your_email@example.com", // Replace with a real email to test
  "Test Email from GPMS",
  "This is a test email from the Gate Pass Management System."
)
  .then(() => console.log("✅ Test email sent successfully!"))
  .catch((err) => console.error("❌ Error sending email:", err));
