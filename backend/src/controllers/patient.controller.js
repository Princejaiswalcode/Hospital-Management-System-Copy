import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  getAllPatients,
  getPatientById,
  getPatientByUserId,
  createPatient,
  updatePatient
} from "../models/patient.model.js";

/* =========================
   GET ALL PATIENTS
========================= */
export const fetchPatients = asyncHandler(async (req, res) => {
  const patients = await getAllPatients();
  res.json(new ApiResponse(200, patients, "Patients fetched"));
});

/* =========================
   GET PATIENT BY ID
========================= */
export const fetchPatient = asyncHandler(async (req, res) => {
  const patient = await getPatientById(req.params.id);

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  res.json(new ApiResponse(200, patient));
});

/* =========================
   GET SELF (PATIENT)
========================= */
export const fetchMyProfile = asyncHandler(async (req, res) => {
  const patient = await getPatientByUserId(req.user.user_id);

  if (!patient) {
    throw new ApiError(404, "Patient profile not found");
  }

  res.json(new ApiResponse(200, patient));
});

/* =========================
   CREATE PATIENT
========================= */
export const addPatient = asyncHandler(async (req, res) => {
  const patientId = await createPatient(req.body);
  res.status(201).json(
    new ApiResponse(201, { patient_id: patientId }, "Patient created")
  );
});

/* =========================
   UPDATE PATIENT
========================= */
export const editPatient = asyncHandler(async (req, res) => {
  await updatePatient(req.params.id, req.body);
  res.json(new ApiResponse(200, null, "Patient updated"));
});
