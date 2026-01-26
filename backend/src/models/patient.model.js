import { db } from "../db/index.js";

/* =========================
   GET ALL PATIENTS
========================= */
export const getAllPatients = async () => {
  const [rows] = await db.execute(`
    SELECT
      patient_id,
      first_name,
      last_name,
      gender,
      date_of_birth,
      TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age,
      phone,
      email
    FROM patients
    ORDER BY patient_id DESC
  `);
  return rows;
};

/* =========================
   GET PATIENT BY ID
========================= */
export const getPatientById = async (id) => {
  const [[row]] = await db.execute(`
    SELECT
      patient_id,
      first_name,
      last_name,
      gender,
      date_of_birth,
      TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age,
      phone,
      email
    FROM patients
    WHERE patient_id = ?
  `, [id]);

  return row;
};

/* =========================
   GET PATIENT BY USER ID
========================= */
export const getPatientByUserId = async (user_id) => {
  const [[row]] = await db.execute(`
    SELECT
      patient_id,
      first_name,
      last_name,
      gender,
      date_of_birth,
      TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age,
      phone,
      email
    FROM patients
    WHERE user_id = ?
  `, [user_id]);

  return row;
};

/* =========================
   CREATE PATIENT
========================= */
export const createPatient = async (data) => {
  const {
    user_id,
    first_name,
    last_name,
    gender,
    date_of_birth,
    phone,
    email
  } = data;

  const [result] = await db.execute(
    `INSERT INTO patients
     (user_id, first_name, last_name, gender, date_of_birth, phone, email)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [user_id, first_name, last_name, gender, date_of_birth, phone, email]
  );

  return result.insertId;
};

/* =========================
   UPDATE PATIENT
========================= */
export const updatePatient = async (id, data) => {
  const {
    first_name,
    last_name,
    gender,
    date_of_birth,
    phone,
    email
  } = data;

  await db.execute(
    `UPDATE patients
     SET first_name = ?,
         last_name = ?,
         gender = ?,
         date_of_birth = ?,
         phone = ?,
         email = ?
     WHERE patient_id = ?`,
    [first_name, last_name, gender, date_of_birth, phone, email, id]
  );
};
