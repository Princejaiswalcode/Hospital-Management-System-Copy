import { Router } from "express";
import {
  getAllAppointmentsController,
  getDoctorAppointmentsController,
  getPatientAppointmentsController,
  createAppointmentController,
  updateAppointmentStatusController
} from "../controllers/appointment.controller.js";

const router = Router();

router.get("/", getAllAppointmentsController);
router.get("/doctor", getDoctorAppointmentsController);
router.get("/patient", getPatientAppointmentsController);
router.post("/", createAppointmentController);
router.patch("/:id/status", updateAppointmentStatusController);

export default router;
