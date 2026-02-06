import { db } from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* =========================
   DASHBOARD CONTROLLER
========================= */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const { role, user_id } = req.user;

  let data = {};     // counts
  let lists = {};    // lists (optional)

  /* =========================
     ADMIN
  ========================= */
  if (role === "admin") {
    const [[totalPatients]] = await db.execute(
      "SELECT COUNT(*) AS count FROM patients"
    );

    const [[todayAppointments]] = await db.execute(
      "SELECT COUNT(*) AS count FROM appointments WHERE appointment_date = CURDATE()"
    );

    const [[admittedPatients]] = await db.execute(
      "SELECT COUNT(*) AS count FROM admissions WHERE discharge_date IS NULL"
    );

    const [[pendingBills]] = await db.execute(
      "SELECT COUNT(*) AS count FROM bills WHERE payment_status = 'Pending'"
    );

    data = {
      totalPatients: totalPatients.count,
      todayAppointments: todayAppointments.count,
      admittedPatients: admittedPatients.count,
      pendingBills: pendingBills.count
    };

    /* -------- Lists -------- */
    const [recentPatients] = await db.execute(
      `SELECT first_name, last_name
       FROM patients
       ORDER BY patient_id DESC
       LIMIT 5`
    );

    const [upcomingAppointments] = await db.execute(
      `SELECT p.first_name, p.last_name, a.appointment_date, a.appointment_time
       FROM appointments a
       JOIN patients p ON p.patient_id = a.patient_id
       WHERE a.appointment_date >= CURDATE()
       ORDER BY a.appointment_date, a.appointment_time
       LIMIT 5`
    );

    const [wardOccupancy] = await db.execute(
      `SELECT ward_name, total_beds, available_beds FROM wards`
    );

    const [recentBills] = await db.execute(
      `SELECT p.first_name, p.last_name, b.total_amount, b.payment_status
       FROM bills b
       JOIN patients p ON p.patient_id = b.patient_id
       ORDER BY b.bill_date DESC
       LIMIT 5`
    );

    lists = {
      recentPatients,
      upcomingAppointments,
      wardOccupancy,
      recentBills
    };
  }

  /* =========================
     DOCTOR
  ========================= */
  if (role === "doctor") {
    const [[doctor]] = await db.execute(
      "SELECT doctor_id FROM doctors WHERE user_id = ?",
      [user_id]
    );

    const doctorId = doctor?.doctor_id || null;

    const [[todayAppointments]] = await db.execute(
      "SELECT COUNT(*) AS count FROM appointments WHERE doctor_id = ? AND appointment_date = CURDATE()",
      [doctorId]
    );

    const [[totalPatients]] = await db.execute(
      "SELECT COUNT(DISTINCT patient_id) AS count FROM appointments WHERE doctor_id = ?",
      [doctorId]
    );

    const [[treatmentsCompleted]] = await db.execute(
      "SELECT COUNT(*) AS count FROM treatments WHERE doctor_id = ?",
      [doctorId]
    );

    data = {
      todayAppointments: todayAppointments.count,
      totalPatients: totalPatients.count,
      treatmentsCompleted: treatmentsCompleted.count
    };
  }

  /* =========================
     NURSE
  ========================= */
  if (role === "nurse") {
    const [[admittedPatients]] = await db.execute(
      "SELECT COUNT(*) AS count FROM admissions WHERE discharge_date IS NULL"
    );

    const [[totalBeds]] = await db.execute(
      "SELECT SUM(total_beds) AS count FROM wards"
    );

    data = {
      admittedPatients: admittedPatients.count,
      totalBeds: totalBeds.count || 0
    };
  }

  /* =========================
     RECEPTION
  ========================= */
  if (role === "reception") {
    const [[totalPatients]] = await db.execute(
      "SELECT COUNT(*) AS count FROM patients"
    );

    const [[todayAppointments]] = await db.execute(
      "SELECT COUNT(*) AS count FROM appointments WHERE appointment_date = CURDATE()"
    );

    data = {
      totalPatients: totalPatients.count,
      todayAppointments: todayAppointments.count
    };
  }

  /* =========================
     ACCOUNTS
  ========================= */
  if (role === "accounts") {
    const [[pendingBills]] = await db.execute(
      "SELECT COUNT(*) AS count FROM bills WHERE payment_status = 'Pending'"
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
      "SELECT patient_id FROM patients WHERE user_id = ?",
      [user_id]
    );

    const patientId = patient?.patient_id || null;

    const [[upcomingAppointments]] = await db.execute(
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
      upcomingAppointments: upcomingAppointments.count,
      pendingBills: pendingBills.count
    };
  }

  res.json(
    new ApiResponse(200, { ...data, lists }, "Dashboard loaded successfully")
  );
});
