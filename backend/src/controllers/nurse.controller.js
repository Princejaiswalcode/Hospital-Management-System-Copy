import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import {
  fetchAllNurses,
  fetchNurseById,
  createNurse,
  updateNurse,
  deleteNurse
} from "../models/nurse.model.js";

/* =========================
   GET ALL
========================= */
export const getAllNurses = asyncHandler(async (req, res) => {
  const nurses = await fetchAllNurses();
  res.json(new ApiResponse(200, nurses, "Nurses fetched"));
});

/* =========================
   GET BY ID
========================= */
export const getNurse = asyncHandler(async (req, res) => {
  const nurse = await fetchNurseById(req.params.id);
  if (!nurse) throw new ApiError(404, "Nurse not found");

  res.json(new ApiResponse(200, nurse));
});

/* =========================
   CREATE
========================= */
export const addNurse = asyncHandler(async (req, res) => {
  const id = await createNurse(req.body);
  res.status(201).json(new ApiResponse(201, { nurse_id: id }, "Nurse added"));
});

/* =========================
   UPDATE
========================= */
export const editNurse = asyncHandler(async (req, res) => {
  await updateNurse(req.params.id, req.body);
  res.json(new ApiResponse(200, null, "Nurse updated"));
});

/* =========================
   DELETE
========================= */
export const removeNurse = asyncHandler(async (req, res) => {
  await deleteNurse(req.params.id);
  res.json(new ApiResponse(200, null, "Nurse deleted"));
});
