import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { createTreatment } from "../models/treatment.model.js";
import { getDoctorByUserId } from "../models/doctor.model.js";

export const addTreatment = asyncHandler(async (req, res) => {
  // 🔐 JWT info
  const { user_id, role } = req.user;

  if (role !== "doctor") {
    throw new ApiError(403, "Only doctors can add treatments");
  }

  // 🔍 Find doctor_id from user_id
  const doctor = await getDoctorByUserId(user_id);
  if (!doctor) {
    throw new ApiError(404, "Doctor profile not found");
  }

  const { appointment_id, patient_id, diagnosis, medicines } = req.body;

  if (!appointment_id || !patient_id || !diagnosis) {
    throw new ApiError(400, "Required fields missing");
  }

  const treatmentId = await createTreatment({
    appointment_id,
    patient_id,
    doctor_id: doctor.doctor_id, // ✅ FIX
    diagnosis,
    medicines
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
