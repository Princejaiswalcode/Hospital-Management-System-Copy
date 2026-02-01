import { db } from "../db/index.js";

/* =========================
   FETCH
========================= */

export const fetchAllNurses = async () => {
  const [rows] = await db.execute(`
    SELECT 
      n.nurse_id,
      n.first_name,
      n.last_name,
      n.phone,
      n.email,
      n.shift,
      n.joining_date,
      d.department_name
    FROM nurses n
    LEFT JOIN departments d ON d.department_id = n.department_id
    ORDER BY n.nurse_id DESC
  `);
  return rows;
};

export const fetchNurseById = async (id) => {
  const [[row]] = await db.execute(
    `SELECT * FROM nurses WHERE nurse_id = ?`,
    [id]
  );
  return row;
};

export const getNurseByUserId = async (user_id) => {
  const [[row]] = await db.execute(
    `SELECT * FROM nurses WHERE user_id = ?`,
    [user_id]
  );
  return row;
};

/* =========================
   CREATE
========================= */

export const createNurse = async (data) => {
  const {
    user_id,
    first_name,
    last_name,
    phone,
    email,
    shift,
    joining_date,
    department_id
  } = data;

  const [result] = await db.execute(
    `INSERT INTO nurses
     (user_id, first_name, last_name, phone, email, shift, joining_date, department_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      first_name,
      last_name,
      phone,
      email,
      shift,
      joining_date,
      department_id
    ]
  );

  return result.insertId;
};

/* =========================
   UPDATE
========================= */

export const updateNurse = async (id, data) => {
  const {
    first_name,
    last_name,
    phone,
    email,
    shift,
    department_id
  } = data;

  await db.execute(
    `UPDATE nurses
     SET first_name=?, last_name=?, phone=?, email=?, shift=?, department_id=?
     WHERE nurse_id=?`,
    [first_name, last_name, phone, email, shift, department_id, id]
  );
};

/* =========================
   DELETE
========================= */

export const deleteNurse = async (id) => {
  await db.execute(`DELETE FROM nurses WHERE nurse_id=?`, [id]);
};
