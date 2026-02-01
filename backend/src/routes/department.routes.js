import { Router } from "express";
import {
  getAllDepartments,
  getDepartment,
  addDepartment,
  editDepartment,
  removeDepartment
} from "../controllers/department.controller.js";

const router = Router();

router.get("/", getAllDepartments);
router.get("/:id", getDepartment);
router.post("/", addDepartment);
router.put("/:id", editDepartment);
router.delete("/:id", removeDepartment);

export default router;
