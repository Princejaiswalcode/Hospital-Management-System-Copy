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
  res.status(200).json(patients);
});

/* =========================
   GET PATIENT BY ID
========================= */
export const fetchPatientById = asyncHandler(async (req, res) => {
  const patient = await getPatientById(req.params.id);

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  res.status(200).json(patient);
});

/* =========================
   GET LOGGED-IN PATIENT PROFILE
========================= */
export const fetchMyPatientProfile = asyncHandler(async (req, res) => {
  const patient = await getPatientByUserId(req.user.user_id);

  if (!patient) {
    throw new ApiError(404, "Patient profile not found");
  }

  res.status(200).json(patient);
});

/* =========================
   CREATE PATIENT
========================= */
export const addPatient = asyncHandler(async (req, res) => {
  const {
    first_name,
    last_name,
    gender,
    date_of_birth,
    phone,
    email,
    address,
    blood_group,
    emergency_contact,
    status
  } = req.body;

  // required fields
  if (
    !first_name ||
    !gender ||
    !date_of_birth ||
    !phone ||
    !status
  ) {
    throw new ApiError(400, "Missing required fields");
  }

  const patientId = await createPatient({
    user_id: null, // admin-created patient
    first_name,
    last_name: last_name || null,
    gender,
    date_of_birth,
    phone,
    email: email || null,
    address,
    blood_group: blood_group || null,
    emergency_contact: emergency_contact || null,
    status
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { patient_id: patientId },
        "Patient created successfully"
      )
    );
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
