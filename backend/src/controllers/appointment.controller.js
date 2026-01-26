
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  getAllAppointments,
  getDoctorAppointments,
  getPatientAppointments,
  createAppointment,
  updateAppointmentStatus
} from "../models/appointment.model.js";

/* =========================
   GET APPOINTMENTS (ROLE BASED)
========================= */
export const fetchAppointments = asyncHandler(async (req, res) => {
  const { role, user_id } = req.user;

  let data;

  if (role === "doctor") {
    data = await getDoctorAppointments(user_id);
  } else if (role === "patient") {
    data = await getPatientAppointments(user_id);
  } else {
    data = await getAllAppointments(); // admin / reception / nurse
  }

  res.json(new ApiResponse(200, data));
});

/* =========================
   CREATE APPOINTMENT
========================= */
export const addAppointment = asyncHandler(async (req, res) => {
  const id = await createAppointment(req.body);

  res.status(201).json(
    new ApiResponse(201, { appointment_id: id }, "Appointment created")
  );
});

/* =========================
   UPDATE STATUS
========================= */
export const changeAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  await updateAppointmentStatus(req.params.id, status);
  res.json(new ApiResponse(200, null, "Status updated"));
});
