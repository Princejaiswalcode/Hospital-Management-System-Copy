import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { findUserByUsername } from "../models/user.model.js";
import { getDoctorByUserId } from "../models/doctor.model.js";
import { getPatientByUserId } from "../models/patient.model.js";

/* =========================
   LOGIN CONTROLLER
========================= */
export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  /* ---------- Validation ---------- */
  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  /* ---------- Fetch user ---------- */
  const users = await findUserByUsername(username);

  if (!users || users.length === 0) {
    throw new ApiError(401, "Invalid credentials");
  }

  const user = users[0];

  /* ---------- Verify password ---------- */
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  /* ---------- Role Mapping ---------- */
  let doctor_id = null;
  let patient_id = null;

  if (user.role === "doctor") {
    const doctor = await getDoctorByUserId(user.user_id);
    doctor_id = doctor?.doctor_id || null;
  }

  if (user.role === "patient") {
    const patient = await getPatientByUserId(user.user_id);
    patient_id = patient?.patient_id || null;
  }

  /* ---------- Generate JWT ---------- */
  const token = jwt.sign(
    {
      user_id: user.user_id,
      role: user.role,
      doctor_id,
      patient_id
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  /* ---------- Response ---------- */
  res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          role: user.role,
          full_name: user.full_name,
          doctor_id,
          patient_id
        }
      },
      "Login successful"
    )
  );
});
