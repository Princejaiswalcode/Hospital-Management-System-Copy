import { Router } from "express";
import {
  getAllNurses,
  getNurse,
  addNurse,
  editNurse,
  removeNurse
} from "../controllers/nurse.controller.js";

const router = Router();

/* Admin / Reception */
router.get("/", getAllNurses);
router.get("/:id", getNurse);
router.post("/", addNurse);
router.put("/:id", editNurse);
router.delete("/:id", removeNurse);

export default router;
