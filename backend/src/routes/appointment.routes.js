import { Router } from "express";
import {
  fetchAppointments,
  addAppointment,
  changeAppointmentStatus
} from "../controllers/appointment.controller.js";

const router = Router();
router.get("/", fetchAppointments);
router.post("/", addAppointment);
router.patch("/:id/status", changeAppointmentStatus);

export default router;
