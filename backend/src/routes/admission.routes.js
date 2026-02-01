import { Router } from "express";
import {
  getAllAdmissions,
  getAdmission,
  getPatientAdmissions,
  addAdmission,
  discharge,
  removeAdmission
} from "../controllers/admission.controller.js";

const router = Router();

router.get("/", getAllAdmissions);
router.get("/:id", getAdmission);
router.get("/patient/:patientId", getPatientAdmissions);

router.post("/", addAdmission);
router.put("/discharge/:id", discharge);
router.delete("/:id", removeAdmission);

export default router;   // ✅ THIS LINE IS REQUIRED
