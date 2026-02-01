import { db } from "../db/index.js";

/* =========================
   SALARY QUERIES
========================= */

export const getAllSalaryPayments = async () => {
  const [rows] = await db.execute(`
    SELECT *
    FROM salary_payment
    ORDER BY payment_date DESC
  `);
  return rows;
};

export const getSalaryByEmployee = async (employee_id) => {
  const [rows] = await db.execute(
    `SELECT *
     FROM salary_payment
     WHERE employee_id = ?
     ORDER BY payment_date DESC`,
    [employee_id]
  );
  return rows;
};

export const createSalaryPayment = async (data) => {
  const {
    employee_id,
    employee_type,
    amount,
    payment_date,
    payment_month,
    payment_year,
    payment_method
  } = data;

  const [result] = await db.execute(
    `INSERT INTO salary_payment
     (employee_id, employee_type, amount, payment_date, payment_month, payment_year, payment_method)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      employee_id,
      employee_type,
      amount,
      payment_date,
      payment_month,
      payment_year,
      payment_method
    ]
  );

  return result.insertId;
};
