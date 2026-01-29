import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { db } from "../db/index.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const { role, user_id } = req.user;

  let data = {};

  /* ================= ADMIN DASHBOARD ================= */
  if (role === "admin") {
    const [[patients]] = await db.execute(
      "SELECT COUNT(*) AS total FROM patients"
    );
    const [[doctors]] = await db.execute(
      "SELECT COUNT(*) AS total FROM doctors"
    );
    const [[appointments]] = await db.execute(
      "SELECT COUNT(*) AS total FROM appointments"
    );
    const [[admissions]] = await db.execute(
      "SELECT COUNT(*) AS total FROM admissions WHERE discharge_date IS NULL"
    );

    data = {
      totalPatients: patients.total,
      totalDoctors: doctors.total,
      totalAppointments: appointments.total,
      admittedPatients: admissions.total,
    };
  }

  /* ================= DOCTOR DASHBOARD ================= */
  else if (role === "doctor") {
    const [[appointments]] = await db.execute(
      "SELECT COUNT(*) AS total FROM appointments WHERE doctor_id = ?",
      [user_id]
    );

    const [[treatments]] = await db.execute(
      "SELECT COUNT(*) AS total FROM treatments WHERE doctor_id = ?",
      [user_id]
    );

    data = {
      myAppointments: appointments.total,
      treatmentsCompleted: treatments.total,
    };
  }

  /* ================= NURSE DASHBOARD ================= */
  else if (role === "nurse") {
    const [[admitted]] = await db.execute(
      "SELECT COUNT(*) AS total FROM admissions WHERE discharge_date IS NULL"
    );

    const [[beds]] = await db.execute(
      "SELECT SUM(total_beds) AS totalBeds, SUM(available_beds) AS availableBeds FROM wards"
    );

    data = {
      admittedPatients: admitted.total,
      totalBeds: beds.totalBeds || 0,
      availableBeds: beds.availableBeds || 0,
    };
  }

  /* ================= RECEPTION DASHBOARD ================= */
  else if (role === "reception") {
    const [[patients]] = await db.execute(
      "SELECT COUNT(*) AS total FROM patients"
    );

    const [[todayAppointments]] = await db.execute(
      `SELECT COUNT(*) AS total
       FROM appointments
       WHERE appointment_date = CURDATE()`
    );

    data = {
      totalPatients: patients.total,
      todaysAppointments: todayAppointments.total,
    };
  }

  /* ================= ACCOUNTS DASHBOARD ================= */
  else if (role === "accounts") {
    const [[pendingBills]] = await db.execute(
      "SELECT COUNT(*) AS total FROM bills WHERE payment_status = 'Pending'"
    );

    const [[totalRevenue]] = await db.execute(
      "SELECT SUM(total_amount) AS total FROM bills WHERE payment_status = 'Paid'"
    );

    data = {
      pendingBills: pendingBills.total,
      totalRevenue: totalRevenue.total || 0,
    };
  }

  /* ================= PATIENT DASHBOARD ================= */
  else if (role === "patient") {
    const [[appointments]] = await db.execute(
      "SELECT COUNT(*) AS total FROM appointments WHERE patient_id = ?",
      [user_id]
    );

    const [[bills]] = await db.execute(
      "SELECT COUNT(*) AS total FROM bills WHERE patient_id = ? AND payment_status = 'Pending'",
      [user_id]
    );

    data = {
      myAppointments: appointments.total,
      pendingBills: bills.total,
    };
  }

  else {
    throw new ApiError(403, "Invalid role");
  }

  res.status(200).json(
    new ApiResponse(200, data, "Dashboard loaded successfully")
  );
});
