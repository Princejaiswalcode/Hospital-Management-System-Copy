import { Router } from "express";
import {
  fetchAllPatients,
  fetchPatientById,
  fetchMyPatientProfile,
  addPatient,
  editPatient,
  removePatient
} from "../controllers/patient.controller.js";

const router = Router();

/* =========================
   ADMIN / RECEPTION
========================= */
router.get("/", fetchAllPatients);
router.get("/:id", fetchPatientById);
router.post("/", addPatient);
router.put("/:id", editPatient);
router.delete("/:id", removePatient);

/* =========================
   PATIENT SELF PROFILE
========================= */
router.get("/me/profile", fetchMyPatientProfile);

export default router;
