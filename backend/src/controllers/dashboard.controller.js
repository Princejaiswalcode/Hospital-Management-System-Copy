import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { db } from "../db/index.js";

/* =========================
   ADMIN DASHBOARD
========================= */
const adminDashboard = async () => {
  const [[patients]] = await db.execute(
    "SELECT COUNT(*) AS totalPatients FROM patients"
  );

  const [[appointments]] = await db.execute(
    "SELECT COUNT(*) AS todayAppointments FROM appointments WHERE appointment_date = CURDATE()"
  );

  const [[admissions]] = await db.execute(
    "SELECT COUNT(*) AS admittedPatients FROM admissions WHERE discharge_date IS NULL"
  );

  const [[bills]] = await db.execute(
    "SELECT COUNT(*) AS pendingBills FROM bills WHERE payment_status = 'Pending'"
  );

  return {
    totalPatients: patients.totalPatients,
    todayAppointments: appointments.todayAppointments,
    admittedPatients: admissions.admittedPatients,
    pendingBills: bills.pendingBills,
  };
};

/* =========================
   MAIN DASHBOARD CONTROLLER
========================= */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const { role, user_id } = req.user;

  let data;
  switch (role) {
  case "admin":
    data = await adminDashboard();
    break;

  case "doctor":
    data = await doctorDashboard(user_id);
    break;

  case "nurse":
    data = await nurseDashboard();
    break;

  case "patient":
    data = await patientDashboard(user_id);
    break;

  case "reception":
    data = await receptionDashboard();
    break;

  case "accounts":
    data = await accountsDashboard();
    break;

  default:
    throw new ApiError(403, "Dashboard not available for this role");
}



  res.status(200).json(
    new ApiResponse(200, data, "Dashboard loaded successfully")
  );
});


//receptionist
const receptionDashboard = async () => {
  const [[totalPatients]] = await db.execute(
    "SELECT COUNT(*) AS count FROM patients"
  );

  const [[todayAppointments]] = await db.execute(
    "SELECT COUNT(*) AS count FROM appointments WHERE appointment_date = CURDATE()"
  );
  const [[newRegistrations]] = await db.execute(
  "SELECT COUNT(*) AS count FROM patients"
    );


  const [todaySchedule] = await db.execute(
    `SELECT appointment_time, reason
     FROM appointments
     WHERE appointment_date = CURDATE()
     ORDER BY appointment_time`
  );

  const [recentPatients] = await db.execute(
    `SELECT patient_id, first_name, last_name
     FROM patients
     ORDER BY patient_id DESC
     LIMIT 5`
  );

  return {
    stats: {
      totalPatients: totalPatients.count,
      todayAppointments: todayAppointments.count,
      newRegistrations: newRegistrations.count
    },
    todaySchedule,
    recentPatients
  };
};



//accounts
const accountsDashboard = async () => {
  const [[totalBills]] = await db.execute(
    "SELECT COUNT(*) AS count FROM bills"
  );

  const [[pendingBills]] = await db.execute(
    "SELECT COUNT(*) AS count FROM bills WHERE payment_status = 'Pending'"
  );

  const [[totalRevenue]] = await db.execute(
    "SELECT IFNULL(SUM(total_amount),0) AS sum FROM bills WHERE payment_status = 'Paid'"
  );

  const [recentBills] = await db.execute(
    `SELECT bill_id, patient_id, total_amount, bill_date
     FROM bills
     ORDER BY bill_date DESC
     LIMIT 5`
  );

  const [recentSalaryPayments] = await db.execute(
    `SELECT employee_id, amount, payment_date
     FROM salary_payments
     ORDER BY payment_date DESC
     LIMIT 5`
  );

  return {
    stats: {
      totalBills: totalBills.count,
      pendingBills: pendingBills.count,
      totalRevenue: totalRevenue.sum
    },
    recentBills,
    recentSalaryPayments
  };
};





//doctor
const doctorDashboard = async (user_id) => {
  // Find doctor_id using logged-in user_id
  const [[doctor]] = await db.execute(
    "SELECT doctor_id FROM doctors WHERE user_id = ?",
    [user_id]
  );

  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  const doctorId = doctor.doctor_id;

  const [[todayAppointments]] = await db.execute(
    `SELECT COUNT(*) AS count
     FROM appointments
     WHERE doctor_id = ? AND appointment_date = CURDATE()`,
    [doctorId]
  );

  const [[totalPatients]] = await db.execute(
    `SELECT COUNT(DISTINCT patient_id) AS count
     FROM appointments
     WHERE doctor_id = ?`,
    [doctorId]
  );

  const [[treatmentsCompleted]] = await db.execute(
    `SELECT COUNT(*) AS count
     FROM treatments
     WHERE doctor_id = ?`,
    [doctorId]
  );

  const [todaySchedule] = await db.execute(
    `SELECT appointment_time, reason
     FROM appointments
     WHERE doctor_id = ? AND appointment_date = CURDATE()`,
    [doctorId]
  );

  return {
    stats: {
      todayAppointments: todayAppointments.count,
      totalPatients: totalPatients.count,
      treatmentsCompleted: treatmentsCompleted.count
    },
    todaySchedule
  };
};



//nurse
const nurseDashboard = async () => {
  const [[admittedPatients]] = await db.execute(
    "SELECT COUNT(*) AS count FROM admissions WHERE discharge_date IS NULL"
  );

  const [[activeAdmissions]] = await db.execute(
    "SELECT COUNT(*) AS count FROM admissions"
  );

  const [[totalBeds]] = await db.execute(
    "SELECT SUM(total_beds) AS total FROM wards"
  );

  const [wardOccupancy] = await db.execute(
    `SELECT ward_name, total_beds, available_beds
     FROM wards`
  );

  return {
    stats: {
      admittedPatients: admittedPatients.count,
      activeAdmissions: activeAdmissions.count,
      totalBeds: totalBeds.total || 0
    },
    wardOccupancy
  };
};



//patient
const patientDashboard = async (user_id) => {
  const [[patient]] = await db.execute(
    "SELECT patient_id, first_name, last_name FROM patients WHERE user_id = ?",
    [user_id]
  );

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  const patientId = patient.patient_id;

  const [[upcomingAppointments]] = await db.execute(
    `SELECT COUNT(*) AS count
     FROM appointments
     WHERE patient_id = ? AND appointment_date >= CURDATE()`,
    [patientId]
  );

  const [[totalTreatments]] = await db.execute(
    `SELECT COUNT(*) AS count
     FROM treatments WHERE patient_id = ?`,
    [patientId]
  );

  const [[pendingBills]] = await db.execute(
    `SELECT COUNT(*) AS count
     FROM bills WHERE patient_id = ? AND payment_status = 'Pending'`,
    [patientId]
  );

  const [appointments] = await db.execute(
    `SELECT appointment_date, appointment_time
     FROM appointments
     WHERE patient_id = ?
     ORDER BY appointment_date`,
    [patientId]
  );

  return {
    profile: patient,
    stats: {
      upcomingAppointments: upcomingAppointments.count,
      totalTreatments: totalTreatments.count,
      pendingBills: pendingBills.count
    },
    appointments
  };
};
