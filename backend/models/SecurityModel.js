const pool = require("../config/db");

const SecurityModel = {
  create: async (data) => {
    const query = `
            INSERT INTO security (name, email,  password, phone)
            VALUES (?, ?, ?, ?)`;
    const values = [data.name, data.email, data.password, data.phone];
    const [result] = await pool.execute(query, values);
    return result;
  },
  findByEmail: async (email) => {
    const query = `SELECT * FROM security WHERE email = ?`;
    const [rows] = await pool.execute(query, [email]);
    return rows[0];
  },
};

module.exports = SecurityModel;
