import { db } from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const { role, user_id } = req.user;
  let data = {};

  /* =========================
     ADMIN
  ========================= */
  if (role === "admin") {
    const [[patients]] = await db.execute(
      "SELECT COUNT(*) AS count FROM patients"
    );

    const [[todayAppointments]] = await db.execute(
      `SELECT COUNT(*) AS count
       FROM appointments
       WHERE appointment_date = CURDATE()`
    );

    const [[admitted]] = await db.execute(
      `SELECT COUNT(*) AS count
       FROM admissions
       WHERE discharge_date IS NULL`
    );

    const [[pendingBills]] = await db.execute(
      `SELECT COUNT(*) AS count
       FROM bills
       WHERE payment_status = 'Pending'`
    );

    data = {
      totalPatients: patients.count,
      todayAppointments: todayAppointments.count,
      admittedPatients: admitted.count,
      pendingBills: pendingBills.count
    };
  }

  /* =========================
     DOCTOR
  ========================= */
  if (role === "doctor") {
    const [[doctor]] = await db.execute(
      `SELECT doctor_id FROM doctors WHERE user_id = ?`,
      [user_id]
    );

    const doctorId = doctor?.doctor_id;

    const [[todayAppointments]] = await db.execute(
      `SELECT COUNT(*) AS count
       FROM appointments
       WHERE doctor_id = ? AND appointment_date = CURDATE()`,
      [doctorId]
    );

    const [[patients]] = await db.execute(
      `SELECT COUNT(DISTINCT patient_id) AS count
       FROM appointments
       WHERE doctor_id = ?`,
      [doctorId]
    );

    const [[treatments]] = await db.execute(
      `SELECT COUNT(*) AS count
       FROM treatments
       WHERE doctor_id = ?`,
      [doctorId]
    );

    data = {
      todayAppointments: todayAppointments.count,
      totalPatients: patients.count,
      treatmentsCompleted: treatments.count
    };
  }

  /* =========================
     NURSE
  ========================= */
  if (role === "nurse") {
    const [[admitted]] = await db.execute(
      `SELECT COUNT(*) AS count
       FROM admissions
       WHERE discharge_date IS NULL`
    );

    const [[beds]] = await db.execute(
      `SELECT SUM(total_beds) AS count FROM wards`
    );

    data = {
      admittedPatients: admitted.count,
      totalBeds: beds.count || 0
    };
  }

  /* =========================
     RECEPTION
  ========================= */
  if (role === "reception") {
    const [[patients]] = await db.execute(
      "SELECT COUNT(*) AS count FROM patients"
    );

    const [[appointments]] = await db.execute(
      `SELECT COUNT(*) AS count
       FROM appointments
       WHERE appointment_date = CURDATE()`
    );

    data = {
      totalPatients: patients.count,
      todayAppointments: appointments.count
    };
  }

  /* =========================
     ACCOUNTS
  ========================= */
  if (role === "accounts") {
    const [[pendingBills]] = await db.execute(
      `SELECT COUNT(*) AS count
       FROM bills
       WHERE payment_status = 'Pending'`
    );

    data = {
      pendingBills: pendingBills.count
    };
  }

  /* =========================
     PATIENT
  ========================= */
  if (role === "patient") {
    const [[patient]] = await db.execute(
      `SELECT patient_id FROM patients WHERE user_id = ?`,
      [user_id]
    );

    const patientId = patient?.patient_id;

    const [[appointments]] = await db.execute(
      `SELECT COUNT(*) AS count
       FROM appointments
       WHERE patient_id = ?
       AND appointment_date >= CURDATE()`,
      [patientId]
    );

    const [[pendingBills]] = await db.execute(
      `SELECT COUNT(*) AS count
       FROM bills
       WHERE patient_id = ?
       AND payment_status = 'Pending'`,
      [patientId]
    );

    data = {
      upcomingAppointments: appointments.count,
      pendingBills: pendingBills.count
    };
  }

  res.json(new ApiResponse(200, data, "Dashboard stats loaded"));
});
