import { Router } from "express";
import {
  addTreatment,
  getMyTreatments
} from "../controllers/treatment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/* Doctor */
router.post("/", verifyJWT, addTreatment);

/* Patient */
router.get("/my", verifyJWT, getMyTreatments);

export default router;
