import { Router } from "express";
import {
  fetchAllWards,
  fetchWardById,
  addWard,
  updateAvailableBeds
} from "../controllers/ward.controller.js";

const router = Router();

router.get("/", fetchAllWards);
router.get("/:id", fetchWardById);
router.post("/", addWard);
router.put("/:id/beds", updateAvailableBeds);

export default router;
