import { db } from "../db/index.js";

/* =========================
   FETCH ALL
========================= */
export const fetchAllDepartments = async () => {
  const [rows] = await db.execute(`
    SELECT
      d.department_id,
      d.department_name,
      d.floor_number,
      d.phone,
      d.description,
      d.head_doctor_id,
      CONCAT(doc.first_name, ' ', doc.last_name) AS head_doctor_name
    FROM departments d
    LEFT JOIN doctors doc ON doc.doctor_id = d.head_doctor_id
    ORDER BY d.department_id ASC
  `);
  return rows;
};

/* =========================
   FETCH ONE
========================= */
export const fetchDepartmentById = async (id) => {
  const [[row]] = await db.execute(
    `SELECT * FROM departments WHERE department_id = ?`,
    [id]
  );
  return row;
};

/* =========================
   CREATE
========================= */
export const createDepartment = async (data) => {
  const {
    department_name,
    head_doctor_id,
    floor_number,
    phone,
    description
  } = data;

  const [result] = await db.execute(
    `INSERT INTO departments
     (department_name, head_doctor_id, floor_number, phone, description)
     VALUES (?, ?, ?, ?, ?)`,
    [
      department_name,
      head_doctor_id || null,
      floor_number || null,
      phone || null,
      description || null
    ]
  );

  return result.insertId;
};

/* =========================
   UPDATE
========================= */
export const updateDepartment = async (id, data) => {
  const {
    department_name,
    head_doctor_id,
    floor_number,
    phone,
    description
  } = data;

  await db.execute(
    `UPDATE departments
     SET department_name = ?,
         head_doctor_id = ?,
         floor_number = ?,
         phone = ?,
         description = ?
     WHERE department_id = ?`,
    [
      department_name,
      head_doctor_id || null,
      floor_number || null,
      phone || null,
      description || null,
      id
    ]
  );
};

/* =========================
   DELETE
========================= */
export const deleteDepartment = async (id) => {
  await db.execute(
    `DELETE FROM departments WHERE department_id = ?`,
    [id]
  );
};
