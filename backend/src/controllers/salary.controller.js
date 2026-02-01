import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getAllSalaryPayments,
  getSalaryByEmployee,
  createSalaryPayment
} from "../models/salary.model.js";

/* =========================
   SALARY CONTROLLERS
========================= */

export const fetchAllSalaryPayments = asyncHandler(async (req, res) => {
  const data = await getAllSalaryPayments();
  res.json({ success: true, data });
});

export const fetchSalaryByEmployee = asyncHandler(async (req, res) => {
  const { employee_id } = req.params;
  const data = await getSalaryByEmployee(employee_id);
  res.json({ success: true, data });
});

export const addSalaryPayment = asyncHandler(async (req, res) => {
  const id = await createSalaryPayment(req.body);
  res.status(201).json({
    success: true,
    message: "Salary payment recorded",
    payment_id: id
  });
});
