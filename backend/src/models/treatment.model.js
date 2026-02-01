import { db } from "../db/index.js";

export const createTreatment = async ({
  appointment_id,
  patient_id,
  doctor_id,
  diagnosis,
  medicines
}) => {
  const [result] = await db.execute(
    `INSERT INTO treatments
     (appointment_id, patient_id, doctor_id, diagnosis, medicines)
     VALUES (?, ?, ?, ?, ?)`,
    [appointment_id, patient_id, doctor_id, diagnosis, medicines]
  );

  return result.insertId;
};

/* =========================
   GET PATIENT TREATMENTS
========================= */
export const getTreatmentsByPatient = async (patient_id) => {
  const [rows] = await db.execute(
    `SELECT 
        t.treatment_id,
        t.treatment_date,
        t.diagnosis,
        t.prescription,
        t.treatment_cost,
        t.follow_up_date,
        CONCAT(d.first_name,' ',d.last_name) AS doctor_name
     FROM treatments t
     JOIN doctors d ON d.doctor_id = t.doctor_id
     WHERE t.patient_id = ?
     ORDER BY t.treatment_date DESC`,
    [patient_id]
  );

  return rows;
};
