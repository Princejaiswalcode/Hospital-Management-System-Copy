import { db } from "../db/index.js";

/* =========================
   BILLING QUERIES
========================= */

// All bills (admin / accounts)
export const getAllBills = async () => {
  const [rows] = await db.execute(`
    SELECT
      b.bill_id,
      b.patient_id,
      CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
      b.total_amount,
      b.payment_status,
      b.bill_date,
      b.payment_date
    FROM bills b
    JOIN patients p ON p.patient_id = b.patient_id
    ORDER BY b.bill_date DESC
  `);
  return rows;
};

// Bills by patient
export const getBillsByPatientId = async (patient_id) => {
  const [rows] = await db.execute(
    `
    SELECT
      bill_id,
      total_amount,
      payment_status,
      bill_date,
      payment_date
    FROM bills
    WHERE patient_id = ?
    ORDER BY bill_date DESC
  `,
    [patient_id]
  );
  return rows;
};

// Create bill
export const createBill = async (data) => {
  const {
    patient_id,
    appointment_id,
    treatment_id,
    admission_id,
    total_amount,
    payment_status,
    bill_date
  } = data;

  const [result] = await db.execute(
    `
    INSERT INTO bills
    (patient_id, appointment_id, treatment_id, admission_id, total_amount, payment_status, bill_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
    [
      patient_id,
      appointment_id || null,
      treatment_id || null,
      admission_id || null,
      total_amount,
      payment_status,
      bill_date
    ]
  );

  return result.insertId;
};

// Mark bill as paid
export const markBillAsPaid = async (bill_id) => {
  await db.execute(
    `
    UPDATE bills
    SET payment_status = 'Paid',
        payment_date = CURDATE()
    WHERE bill_id = ?
  `,
    [bill_id]
  );
};
