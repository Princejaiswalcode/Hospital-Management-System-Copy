import { asyncHandler } from "../utils/asyncHandler.js";
import * as Doctor from "../models/doctor.model.js";

export const getAllDoctors = asyncHandler(async (_, res) => {
  res.json(await Doctor.fetchDoctors());
});

export const getDoctorById = asyncHandler(async (req, res) => {
  res.json(await Doctor.fetchDoctorById(req.params.id));
});

export const createDoctor = asyncHandler(async (req, res) => {
  const id = await Doctor.insertDoctor(req.body);
  res.status(201).json({ doctor_id: id });
});

export const updateDoctor = asyncHandler(async (req, res) => {
  await Doctor.updateDoctorById(req.params.id, req.body);
  res.json({ message: "Doctor updated" });
});

export const deleteDoctor = asyncHandler(async (req, res) => {
  await Doctor.deleteDoctorById(req.params.id);
  res.json({ message: "Doctor deleted" });
});
