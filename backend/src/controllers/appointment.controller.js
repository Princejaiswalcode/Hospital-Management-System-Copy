import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import {
  getAllAppointments,
  getDoctorAppointments,
  getPatientAppointments,
  createAppointment,
  updateAppointmentStatus
} from "../models/appointment.model.js";

/* =========================
   GET ALL APPOINTMENTS
   Admin / Reception / Nurse
========================= */
export const getAllAppointmentsController = asyncHandler(async (req, res) => {
  const data = await getAllAppointments();
  res.json(new ApiResponse(200, data, "Appointments fetched"));
});

/* =========================
   DOCTOR APPOINTMENTS
========================= */
export const getDoctorAppointmentsController = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  const data = await getDoctorAppointments(user_id);
  res.json(new ApiResponse(200, data, "Doctor appointments fetched"));
});

/* =========================
   PATIENT APPOINTMENTS
========================= */
export const getPatientAppointmentsController = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  const data = await getPatientAppointments(user_id);
  res.json(new ApiResponse(200, data, "Patient appointments fetched"));
});

/* =========================
   CREATE APPOINTMENT
========================= */
export const createAppointmentController = asyncHandler(async (req, res) => {
  const id = await createAppointment(req.body);
  res.status(201).json(
    new ApiResponse(201, { appointment_id: id }, "Appointment created")
  );
});

/* =========================
   UPDATE STATUS
========================= */
export const updateAppointmentStatusController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  await updateAppointmentStatus(id, status);
  res.json(new ApiResponse(200, null, "Status updated"));
});
