import { db } from "../db/index.js";

/* =========================
   GET ALL PATIENTS
========================= */
export const getAllPatients = async () => {
  const [rows] = await db.execute(`
    SELECT
      patient_id,
      user_id,
      first_name,
      last_name,
      gender,
      date_of_birth,
      CASE
        WHEN date_of_birth IS NOT NULL
        THEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE())
        ELSE NULL
      END AS age,
      phone,
      email,
      address,
      blood_group,
      emergency_contact,
      status
    FROM patients
    ORDER BY patient_id DESC
  `);

  return rows;
};

/* =========================
   GET PATIENT BY ID
========================= */
export const getPatientById = async (id) => {
  const [[row]] = await db.execute(
    `
    SELECT
      patient_id,
      user_id,
      first_name,
      last_name,
      gender,
      date_of_birth,
      CASE
        WHEN date_of_birth IS NOT NULL
        THEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE())
        ELSE NULL
      END AS age,
      phone,
      email,
      address,
      blood_group,
      emergency_contact,
      status
    FROM patients
    WHERE patient_id = ?
    `,
    [id]
  );

  return row;
};

/* =========================
   GET PATIENT BY USER ID
========================= */
export const getPatientByUserId = async (user_id) => {
  const [[row]] = await db.execute(
    `
    SELECT
      patient_id,
      first_name,
      last_name,
      gender,
      date_of_birth,
      CASE
        WHEN date_of_birth IS NOT NULL
        THEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE())
        ELSE NULL
      END AS age,
      phone,
      email,
      address,
      blood_group,
      emergency_contact,
      status
    FROM patients
    WHERE user_id = ?
    `,
    [user_id]
  );

  return row;
};

/* =========================
   CREATE PATIENT (FULL INSERT)
========================= */
export const createPatient = async (data) => {
  const {
    user_id,
    first_name,
    last_name,
    gender,
    date_of_birth,
    phone,
    email,
    address,
    blood_group,
    emergency_contact,
    status
  } = data;

  const [result] = await db.execute(
    `
    INSERT INTO patients
      (user_id, first_name, last_name, gender, date_of_birth,
       phone, email, address, blood_group, emergency_contact, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      user_id,
      first_name,
      last_name,
      gender,
      date_of_birth,
      phone,
      email,
      address,
      blood_group,
      emergency_contact,
      status
    ]
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
    date_of_birth = null,
    phone,
    email,
    address,
    blood_group,
    emergency_contact,
    status
  } = data;

  await db.execute(
    `
    UPDATE patients
    SET
      first_name = ?,
      last_name = ?,
      gender = ?,
      date_of_birth = ?,
      phone = ?,
      email = ?,
      address = ?,
      blood_group = ?,
      emergency_contact = ?,
      status = ?
    WHERE patient_id = ?
    `,
    [
      first_name,
      last_name,
      gender,
      date_of_birth,
      phone,
      email,
      address,
      blood_group,
      emergency_contact,
      status,
      id
    ]
  );
};

/* =========================
   DELETE PATIENT
========================= */
export const deletePatient = async (id) => {
  await db.execute(
    `DELETE FROM patients WHERE patient_id = ?`,
    [id]
  );
};
