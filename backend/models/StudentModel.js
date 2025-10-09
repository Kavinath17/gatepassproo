const pool = require("../config/db");

const StudentModel = {
  create: async (data) => {
    const query = `
            INSERT INTO students (name, email, password, year, sin_number, department, phone, dob, address, type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      data.name,
      data.email,
      data.password,
      data.year,
      data.sin_number,
      data.department,
      data.phone,
      data.dob,
      data.address,
      data.type,
    ];
    const [result] = await pool.execute(query, values);
    return result;
  },
  findByEmail: async (email) => {
    const query = `SELECT * FROM students WHERE email = ?`;
    const [rows] = await pool.execute(query, [email]);
    return rows[0];
  },
};

module.exports = StudentModel;
