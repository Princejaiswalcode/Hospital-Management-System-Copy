import { Router } from "express";
import {
  fetchAllBills,
  fetchMyBills,
  createNewBill,
  payBill
} from "../controllers/billing.controller.js";

const router = Router();

// Admin / Accounts
router.get("/", fetchAllBills);
router.post("/", createNewBill);
router.patch("/:bill_id/pay", payBill);

// Patient
router.get("/my", fetchMyBills);

export default router;
