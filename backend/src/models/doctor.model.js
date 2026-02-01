import { db } from "../db/index.js";

export const fetchDoctors = async () => {
  const [rows] = await db.execute(`
    SELECT d.*, dep.department_name
    FROM doctors d
    LEFT JOIN departments dep ON dep.department_id = d.department_id
    ORDER BY doctor_id DESC
  `);
  return rows;
};

export const fetchDoctorById = async (id) => {
  const [[row]] = await db.execute(
    "SELECT * FROM doctors WHERE doctor_id = ?",
    [id]
  );
  return row;
};

export const insertDoctor = async (data) => {
  const {
    user_id, first_name, last_name, specialization,
    phone, email, license_number, joining_date, department_id
  } = data;

  const [res] = await db.execute(`
    INSERT INTO doctors
    (user_id, first_name, last_name, specialization, phone, email, license_number, joining_date, department_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    user_id, first_name, last_name, specialization,
    phone, email, license_number, joining_date, department_id
  ]);

  return res.insertId;
};

export const updateDoctorById = async (id, data) => {
  const {
    first_name, last_name, specialization,
    phone, email, department_id
  } = data;

  await db.execute(`
    UPDATE doctors
    SET first_name=?, last_name=?, specialization=?, phone=?, email=?, department_id=?
    WHERE doctor_id=?
  `, [
    first_name, last_name, specialization,
    phone, email, department_id, id
  ]);
};

export const deleteDoctorById = async (id) => {
  await db.execute("DELETE FROM doctors WHERE doctor_id=?", [id]);
};


export const getDoctorByUserId = async (user_id) => {
  const [[row]] = await db.execute(
    `SELECT *
     FROM doctors
     WHERE user_id = ?`,
    [user_id]
  );

  return row;
};
