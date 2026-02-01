import { Router } from "express";
import {
  getAllReceptionists,
  getReceptionist,
  addReceptionist,
  editReceptionist,
  removeReceptionist
} from "../controllers/receptionist.controller.js";

const router = Router();

/* Admin only */
router.get("/", getAllReceptionists);
router.get("/:id", getReceptionist);
router.post("/", addReceptionist);
router.put("/:id", editReceptionist);
router.delete("/:id", removeReceptionist);

export default router;
