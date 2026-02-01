import { db } from "../db/index.js";

/* =========================
   WARD QUERIES
========================= */

export const getAllWards = async () => {
  const [rows] = await db.execute(`
    SELECT *
    FROM wards
    ORDER BY ward_name
  `);
  return rows;
};

export const getWardById = async (id) => {
  const [[row]] = await db.execute(
    `SELECT * FROM wards WHERE ward_id = ?`,
    [id]
  );
  return row;
};

export const createWard = async (data) => {
  const {
    ward_name,
    ward_type,
    total_beds,
    available_beds,
    department_id,
    floor_number
  } = data;

  const [result] = await db.execute(
    `INSERT INTO wards
     (ward_name, ward_type, total_beds, available_beds, department_id, floor_number)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      ward_name,
      ward_type,
      total_beds,
      available_beds,
      department_id,
      floor_number
    ]
  );

  return result.insertId;
};

export const updateWardBeds = async (id, available_beds) => {
  await db.execute(
    `UPDATE wards SET available_beds = ? WHERE ward_id = ?`,
    [available_beds, id]
  );
};
