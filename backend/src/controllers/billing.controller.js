import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  getAllBills,
  getBillsByPatientId,
  createBill,
  markBillAsPaid
} from "../models/billing.model.js";

/* =========================
   GET ALL BILLS
========================= */
export const fetchAllBills = asyncHandler(async (req, res) => {
  const bills = await getAllBills();
  res.status(200).json(new ApiResponse(200, bills));
});

/* =========================
   PATIENT BILLS
========================= */
export const fetchMyBills = asyncHandler(async (req, res) => {
  const { patient_id } = req.user;

  if (!patient_id) {
    throw new ApiError(403, "Patient access only");
  }

  const bills = await getBillsByPatientId(patient_id);
  res.status(200).json(new ApiResponse(200, bills));
});

/* =========================
   CREATE BILL
========================= */
export const createNewBill = asyncHandler(async (req, res) => {
  const billId = await createBill(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, { bill_id: billId }, "Bill created"));
});

/* =========================
   PAY BILL
========================= */
export const payBill = asyncHandler(async (req, res) => {
  const { bill_id } = req.params;

  await markBillAsPaid(bill_id);

  res.status(200).json(new ApiResponse(200, null, "Bill paid successfully"));
});
