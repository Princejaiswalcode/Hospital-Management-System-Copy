import { db } from "../db/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getDashboardStats = asyncHandler(async (req, res) => {

  const [[patients]] = await db.execute(
    "SELECT COUNT(*) AS totalPatients FROM patients"
  );

  const [[doctors]] = await db.execute(
    "SELECT COUNT(*) AS totalDoctors FROM doctors"
  );

  const [[nurses]] = await db.execute(
    "SELECT COUNT(*) AS totalNurses FROM nurses"
  );

  const [[appointments]] = await db.execute(
    "SELECT COUNT(*) AS todayAppointments FROM appointments WHERE appointment_date = CURDATE()"
  );

  const [[admissions]] = await db.execute(
    "SELECT COUNT(*) AS admittedPatients FROM admissions WHERE discharge_date IS NULL"
  );

  const [[wards]] = await db.execute(
    "SELECT COUNT(*) AS totalWards FROM wards"
  );

  res.status(200).json(
    new ApiResponse(200, {
      totalPatients: patients.totalPatients,
      totalDoctors: doctors.totalDoctors,
      totalNurses: nurses.totalNurses,
      todayAppointments: appointments.todayAppointments,
      admittedPatients: admissions.admittedPatients,
      totalWards: wards.totalWards
    }, "Dashboard data fetched successfully")
  );
});
