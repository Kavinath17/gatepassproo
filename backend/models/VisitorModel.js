const pool = require("../config/db");

const VisitorModel = {
  create: async (visitorData) => {
    const {
      name,
      phone,
      reason,
      in_time,
      expected_exit_time,
      concerned_person_name,
      concerned_person_email,
    } = visitorData;

    return await pool.execute(
      `INSERT INTO visitors 
        (name, phone, reason, in_time, expected_exit_time, status, concerned_person_name, concerned_person_email)
        VALUES (?, ?, ?, ?, ?, 'Pending', ?, ?)`,
      [
        name,
        phone,
        reason,
        in_time,
        expected_exit_time,
        concerned_person_name,
        concerned_person_email,
      ]
    );
  },

  findStaffEmail: async (name, phone) => {
    const [result] = await pool.execute(
      "SELECT email FROM staff WHERE  phone = ?",
      [ phone]
    );
    // const [result] = await pool.execute(
    //   "SELECT email FROM staff WHERE name = ? AND phone = ?",
    //   [name, phone]
    // );
    return result.length > 0 ? result[0].email : null;
  },

  // ✅ NEW FUNCTION: Update visitor status (Approved / Rejected)
  updateStatus: async (id, status) => {
    const [result] = await pool.execute(
      "UPDATE visitors SET status = ? WHERE id = ?",
      [status, id]
    );
    return result;
  },

  getApprovedVisitors: async () => {
    const [rows] = await pool.execute(
      "SELECT * FROM visitors WHERE status = 'Approved' ORDER BY in_time DESC"
    );
    return rows;
  },
};

module.exports = VisitorModel;
// const pool = require("../config/db");

// const VisitorModel = {
//   create: async (visitorData) => {
//     const {
//       name,
//       phone,
//       reason,
//       in_time,
//       expected_exit_time,
//       concerned_person_name,
//       concerned_person_email,
//     } = visitorData;

//     return await pool.execute(
//       `INSERT INTO visitors
//         (name, phone, reason, in_time, expected_exit_time, status, concerned_person_name, concerned_person_email)
//         VALUES (?, ?, ?, ?, ?, 'Pending', ?, ?)`,
//       [
//         name,
//         phone,
//         reason,
//         in_time,
//         expected_exit_time,
//         concerned_person_name,
//         concerned_person_email,
//       ]
//     );
//   },

//   findStaffEmail: async (name, phone) => {
//     const [result] = await pool.execute(
//       "SELECT email FROM staff WHERE name = ? AND phone = ?",
//       [name, phone]
//     );
//     return result.length > 0 ? result[0].email : null;
//   },
// };

// module.exports = VisitorModel;
