const pool = require("../config/db");

const GatePassModel = {
  create: async (data) => {
    const query = `
      INSERT INTO gate_pass (student_id, reason, date, time, status, class_advisor_approval, hod_approval, principal_approval, warden_approval)
      VALUES (?, ?, ?, ?, 'Pending', 'Pending', 'Pending', 'Pending', ?)
    `;

    const values = [
      data.student_id,
      data.reason,
      data.date,
      data.time,
      data.isHosteller ? "Pending" : null, // Warden approval only for hostellers
    ];

    const [result] = await pool.execute(query, values);
    return result;
  },

  findByStudentId: async (student_id) => {
    const query = `
      SELECT gp.*, s.name, s.sin_number, s.department, s.phone 
      FROM gate_pass gp
      JOIN students s ON gp.student_id = s.id
      WHERE gp.student_id = ?
    `;

    const [rows] = await pool.execute(query, [student_id]);
    return rows;
  },

  findAllPendingPasses: async () => {
    const query = `
      SELECT gp.*, s.name, s.sin_number, s.department, s.phone 
      FROM gate_pass gp
      JOIN students s ON gp.student_id = s.id
      WHERE gp.status = 'Pending'
    `;

    const [rows] = await pool.execute(query);
    return rows;
  },

  updateStatus: async (id, status) => {
    const query = `UPDATE gate_pass SET status = ? WHERE id = ?`;
    const [result] = await pool.execute(query, [status, id]);
    return result;
  },

  updateApproval: async (id, role, status) => {
    const query = `UPDATE gate_pass SET ${role}_approval = ? WHERE id = ?`;
    const values = [status, id];
    await pool.execute(query, values);
  },

  getPendingApprovals: async (role) => {
    const query = `
    SELECT gp.*, s.name, s.sin_number, s.department, s.phone 
    FROM gate_pass gp
    JOIN students s ON gp.student_id = s.id
    WHERE gp.${role}_approval = 'Pending'
  `;

    const [rows] = await pool.execute(query);
    return rows;
  },
  updateSecurityVerification: async (id, status) => {
    const query = `UPDATE gate_pass SET security_verification = ? WHERE id = ?`;
    const values = [status, id];
    const [result] = await pool.execute(query, values);

    if (result.affectedRows === 0) {
      throw new Error(`Gate pass with ID ${id} not found or already updated.`);
    }
    return result;
  },

  // updateSecurityVerification: async (id) => {
  //   const query = `UPDATE gate_pass SET security_verification = 'Verified' WHERE id = ?`;
  //   const values = [id];
  //   await pool.execute(query, values);
  // },
};

module.exports = GatePassModel;
// const pool = require("../config/db");

// const GatePassModel = {
//   create: async (data) => {
//     const query = `
//             INSERT INTO gate_pass (student_id, reason, date, time, status)
//             VALUES (?, ?, ?, ?, 'Pending')`;
//     const values = [data.student_id, data.reason, data.date, data.time];
//     const [result] = await pool.execute(query, values);
//     return result;
//   },
//   findByStudentId: async (student_id) => {
//     const query = `SELECT * FROM gate_pass WHERE student_id = ?`;
//     const [rows] = await pool.execute(query, [student_id]);
//     return rows;
//   },
//   updateStatus: async (id, status) => {
//     const query = `UPDATE gate_pass SET status = ? WHERE id = ?`;
//     const [result] = await pool.execute(query, [status, id]);
//     return result;
//   },
// };

// module.exports = GatePassModel;
