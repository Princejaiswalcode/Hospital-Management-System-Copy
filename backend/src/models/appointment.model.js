import { db } from "../db/index.js";

/* =========================
   GET ALL APPOINTMENTS
========================= */
export const getAllAppointments = async () => {
  const [rows] = await db.execute(`
    SELECT
      a.appointment_id,
      CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
      CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
      a.appointment_date,
      a.appointment_time,
      a.status,
      a.reason,
      a.notes
    FROM appointments a
    JOIN patients p ON a.patient_id = p.patient_id
    JOIN doctors d ON a.doctor_id = d.doctor_id
    ORDER BY a.appointment_date DESC
  `);
  return rows;
};

/* =========================
   DOCTOR APPOINTMENTS
========================= */
export const getDoctorAppointments = async (doctor_id) => {
  const [rows] = await db.execute(`
    SELECT
      appointment_id,
      appointment_date,
      appointment_time,
      status,
      reason,
      notes
    FROM appointments
    WHERE doctor_id = ?
    ORDER BY appointment_date DESC
  `, [doctor_id]);

  return rows;
};

/* =========================
   PATIENT APPOINTMENTS
========================= */
export const getPatientAppointments = async (patient_id) => {
  const [rows] = await db.execute(`
    SELECT
      appointment_id,
      appointment_date,
      appointment_time,
      status,
      reason,
      notes
    FROM appointments
    WHERE patient_id = ?
    ORDER BY appointment_date DESC
  `, [patient_id]);

  return rows;
};

/* =========================
   CREATE APPOINTMENT
========================= */
export const createAppointment = async (data) => {
  const {
    patient_id,
    doctor_id,
    appointment_date,
    appointment_time,
    reason,
    notes
  } = data;

  const [result] = await db.execute(
    `INSERT INTO appointments
     (patient_id, doctor_id, appointment_date, appointment_time, reason, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [patient_id, doctor_id, appointment_date, appointment_time, reason, notes]
  );

  return result.insertId;
};

/* =========================
   UPDATE STATUS
========================= */
export const updateAppointmentStatus = async (id, status) => {
  await db.execute(
    `UPDATE appointments SET status = ? WHERE appointment_id = ?`,
    [status, id]
  );
};
