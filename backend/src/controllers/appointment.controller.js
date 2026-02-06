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
========================= */
export const getAllAppointmentsController = asyncHandler(async (req, res) => {
  const data = await getAllAppointments();
  res.status(200).json(data);
});

/* =========================
   DOCTOR APPOINTMENTS
========================= */
export const getDoctorAppointmentsController = asyncHandler(async (req, res) => {
  if (!req.user?.doctor_id) {
    throw new ApiError(403, "Doctor access only");
  }

  const data = await getDoctorAppointments(req.user.doctor_id);
  res.status(200).json(data);
});

/* =========================
   PATIENT APPOINTMENTS
========================= */
export const getPatientAppointmentsController = asyncHandler(async (req, res) => {
  if (!req.user?.patient_id) {
    throw new ApiError(403, "Patient access only");
  }

  const data = await getPatientAppointments(req.user.patient_id);
  res.status(200).json(data);
});

/* =========================
   CREATE APPOINTMENT
========================= */
export const createAppointmentController = asyncHandler(async (req, res) => {
  const {
    patient_id,
    doctor_id,
    appointment_date,
    appointment_time
  } = req.body;

  if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
    throw new ApiError(400, "Missing required fields");
  }

  const id = await createAppointment(req.body);

  res.status(201).json(
    new ApiResponse(201, { appointment_id: id }, "Appointment created")
  );
});

/* =========================
   UPDATE STATUS
========================= */
export const updateAppointmentStatusController = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  await updateAppointmentStatus(req.params.id, status);
  res.json(new ApiResponse(200, null, "Status updated"));
});
