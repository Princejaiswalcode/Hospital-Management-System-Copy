import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
  getAllPatients,
  getPatientById,
  getPatientByUserId,
  createPatient,
  updatePatient,
  deletePatient
} from "../models/patient.model.js";

/* =========================
   GET ALL PATIENTS
========================= */
export const fetchAllPatients = asyncHandler(async (req, res) => {
  const patients = await getAllPatients();
  res.status(200).json(new ApiResponse(200, patients));
});

/* =========================
   GET PATIENT BY ID
========================= */
export const fetchPatientById = asyncHandler(async (req, res) => {
  const patient = await getPatientById(req.params.id);

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  res.status(200).json(new ApiResponse(200, patient));
});

/* =========================
   GET LOGGED-IN PATIENT PROFILE
========================= */
export const fetchMyPatientProfile = asyncHandler(async (req, res) => {
  const patient = await getPatientByUserId(req.user.user_id);

  if (!patient) {
    throw new ApiError(404, "Patient profile not found");
  }

  res.status(200).json(new ApiResponse(200, patient));
});

/* =========================
   CREATE PATIENT
========================= */
export const addPatient = asyncHandler(async (req, res) => {
  const patientId = await createPatient(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, { patient_id: patientId }, "Patient created"));
});

/* =========================
   UPDATE PATIENT
========================= */
export const editPatient = asyncHandler(async (req, res) => {
  await updatePatient(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, {}, "Patient updated"));
});

/* =========================
   DELETE PATIENT
========================= */
export const removePatient = asyncHandler(async (req, res) => {
  await deletePatient(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, "Patient deleted"));
});
