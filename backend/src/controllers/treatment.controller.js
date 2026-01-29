import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  createTreatment,
  getTreatmentsByPatient
} from "../models/treatment.model.js";

/* =========================
   CREATE TREATMENT (Doctor only)
========================= */
export const addTreatment = asyncHandler(async (req, res) => {
  if (req.user.role !== "doctor") {
    throw new ApiError(403, "Only doctors can add treatments");
  }

  const doctor_id = req.user.user_id; // 🔥 FIX HERE
  const {
    patient_id,
    diagnosis,
    prescription,
    treatment_cost,
    follow_up_date
  } = req.body;

  if (!patient_id || !diagnosis) {
    throw new ApiError(400, "Patient ID and diagnosis required");
  }

  const treatmentId = await createTreatment({
    patient_id,
    doctor_id,
    diagnosis,
    prescription,
    treatment_cost,
    follow_up_date
  });

  res.status(201).json(
    new ApiResponse(
      201,
      { treatment_id: treatmentId },
      "Treatment added successfully"
    )
  );
});

/* =========================
   PATIENT VIEW TREATMENTS
========================= */
export const getMyTreatments = asyncHandler(async (req, res) => {
  const treatments = await getTreatmentsByPatient(req.user.user_id);

  res.json(
    new ApiResponse(200, treatments, "Treatments fetched")
  );
});
