import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import {
  fetchAllReceptionists,
  fetchReceptionistById,
  createReceptionist,
  updateReceptionist,
  deleteReceptionist
} from "../models/receptionist.model.js";

/* =========================
   GET ALL
========================= */
export const getAllReceptionists = asyncHandler(async (req, res) => {
  const data = await fetchAllReceptionists();
  res.json(new ApiResponse(200, data, "Receptionists fetched"));
});

/* =========================
   GET ONE
========================= */
export const getReceptionist = asyncHandler(async (req, res) => {
  const receptionist = await fetchReceptionistById(req.params.id);
  if (!receptionist) throw new ApiError(404, "Receptionist not found");

  res.json(new ApiResponse(200, receptionist));
});

/* =========================
   CREATE
========================= */
export const addReceptionist = asyncHandler(async (req, res) => {
  const id = await createReceptionist(req.body);
  res.status(201).json(
    new ApiResponse(201, { receptionist_id: id }, "Receptionist created")
  );
});

/* =========================
   UPDATE
========================= */
export const editReceptionist = asyncHandler(async (req, res) => {
  await updateReceptionist(req.params.id, req.body);
  res.json(new ApiResponse(200, null, "Receptionist updated"));
});

/* =========================
   DELETE
========================= */
export const removeReceptionist = asyncHandler(async (req, res) => {
  await deleteReceptionist(req.params.id);
  res.json(new ApiResponse(200, null, "Receptionist deleted"));
});
