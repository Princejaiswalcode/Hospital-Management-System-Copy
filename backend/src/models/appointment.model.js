import { db } from "../db/index.js";

/* =========================
   GET ALL APPOINTMENTS
========================= */
export const getAllAppointments = async () => {
  const [rows] = await db.execute(`
    SELECT
      a.appointment_id,
      a.patient_id,
      CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
      a.doctor_id,
      CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
      a.appointment_date,
      a.appointment_time,
      a.status,
      a.reason,
      a.notes
    FROM appointments a
    JOIN patients p ON p.patient_id = a.patient_id
    JOIN doctors d ON d.doctor_id = a.doctor_id
    ORDER BY a.appointment_date DESC, a.appointment_time DESC
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
    `
    INSERT INTO appointments
      (patient_id, doctor_id, appointment_date, appointment_time, status, reason, notes)
    VALUES (?, ?, ?, ?, 'Scheduled', ?, ?)
    `,
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
