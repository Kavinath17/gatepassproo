const pool = require("../config/db");

const StaffModel = {
  create: async (data) => {
    const query = `
            INSERT INTO staff (staff_code, name, email, password, department, designation, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      data.staff_code,
      data.name,
      data.email,
      data.password,
      data.department,
      data.designation,
      data.phone,
    ];
    const [result] = await pool.execute(query, values);
    return result;
  },
  findByEmail: async (email) => {
    const query = `SELECT * FROM staff WHERE email = ?`;
    const [rows] = await pool.execute(query, [email]);
    return rows[0];
  },
};

module.exports = StaffModel;
