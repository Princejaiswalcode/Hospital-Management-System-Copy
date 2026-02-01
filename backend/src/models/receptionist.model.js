import { db } from "../db/index.js";

/* =========================
   FETCH
========================= */

export const fetchAllReceptionists = async () => {
  const [rows] = await db.execute(`
    SELECT
      receptionist_id,
      first_name,
      last_name,
      phone,
      email,
      shift,
      joining_date
    FROM receptionists
    ORDER BY receptionist_id DESC
  `);
  return rows;
};

export const fetchReceptionistById = async (id) => {
  const [[row]] = await db.execute(
    `SELECT * FROM receptionists WHERE receptionist_id = ?`,
    [id]
  );
  return row;
};

export const getReceptionistByUserId = async (user_id) => {
  const [[row]] = await db.execute(
    `SELECT * FROM receptionists WHERE user_id = ?`,
    [user_id]
  );
  return row;
};

/* =========================
   CREATE
========================= */

export const createReceptionist = async (data) => {
  const {
    user_id,
    first_name,
    last_name,
    phone,
    email,
    shift,
    joining_date
  } = data;

  const [result] = await db.execute(
    `INSERT INTO receptionists
     (user_id, first_name, last_name, phone, email, shift, joining_date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      first_name,
      last_name,
      phone,
      email,
      shift,
      joining_date
    ]
  );

  return result.insertId;
};

/* =========================
   UPDATE
========================= */

export const updateReceptionist = async (id, data) => {
  const {
    first_name,
    last_name,
    phone,
    email,
    shift
  } = data;

  await db.execute(
    `UPDATE receptionists
     SET first_name=?, last_name=?, phone=?, email=?, shift=?
     WHERE receptionist_id=?`,
    [first_name, last_name, phone, email, shift, id]
  );
};

/* =========================
   DELETE
========================= */

export const deleteReceptionist = async (id) => {
  await db.execute(
    `DELETE FROM receptionists WHERE receptionist_id=?`,
    [id]
  );
};
