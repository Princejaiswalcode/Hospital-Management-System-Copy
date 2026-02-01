import { Router } from "express";
import {
  fetchAllSalaryPayments,
  fetchSalaryByEmployee,
  addSalaryPayment
} from "../controllers/salary.controller.js";

const router = Router();

router.get("/", fetchAllSalaryPayments);
router.get("/employee/:employee_id", fetchSalaryByEmployee);
router.post("/", addSalaryPayment);

export default router;
