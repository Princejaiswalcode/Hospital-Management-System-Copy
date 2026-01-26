import { Router } from "express";
import {
  fetchPatients,
  fetchPatient,
  fetchMyProfile,
  addPatient,
  editPatient
} from "../controllers/patient.controller.js";

const router = Router();

router.get("/", fetchPatients);           // Admin / Reception / Nurse
router.get("/me", fetchMyProfile);         // Patient self
router.get("/:id", fetchPatient);          // Admin / Reception
router.post("/", addPatient);              // Admin / Reception
router.put("/:id", editPatient);           // Admin

export default router;
