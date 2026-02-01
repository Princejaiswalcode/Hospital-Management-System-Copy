import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getAllWards,
  getWardById,
  createWard,
  updateWardBeds
} from "../models/ward.model.js";

/* =========================
   WARD CONTROLLERS
========================= */

export const fetchAllWards = asyncHandler(async (req, res) => {
  const data = await getAllWards();
  res.json({ success: true, data });
});

export const fetchWardById = asyncHandler(async (req, res) => {
  const ward = await getWardById(req.params.id);
  res.json({ success: true, data: ward });
});

export const addWard = asyncHandler(async (req, res) => {
  const id = await createWard(req.body);
  res.status(201).json({
    success: true,
    message: "Ward created",
    ward_id: id
  });
});

export const updateAvailableBeds = asyncHandler(async (req, res) => {
  const { available_beds } = req.body;
  await updateWardBeds(req.params.id, available_beds);
  res.json({ success: true, message: "Ward updated" });
});
