import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import {
  fetchAllDepartments,
  fetchDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from "../models/department.model.js";

/* =========================
   GET ALL
========================= */
export const getAllDepartments = asyncHandler(async (req, res) => {
  const departments = await fetchAllDepartments();
  res.json(new ApiResponse(200, departments, "Departments fetched"));
});

/* =========================
   GET ONE
========================= */
export const getDepartment = asyncHandler(async (req, res) => {
  const department = await fetchDepartmentById(req.params.id);
  if (!department) throw new ApiError(404, "Department not found");

  res.json(new ApiResponse(200, department));
});

/* =========================
   CREATE
========================= */
export const addDepartment = asyncHandler(async (req, res) => {
  const { department_name } = req.body;
  if (!department_name) {
    throw new ApiError(400, "Department name is required");
  }

  const id = await createDepartment(req.body);
  res.status(201).json(
    new ApiResponse(201, { department_id: id }, "Department created")
  );
});

/* =========================
   UPDATE
========================= */
export const editDepartment = asyncHandler(async (req, res) => {
  await updateDepartment(req.params.id, req.body);
  res.json(new ApiResponse(200, null, "Department updated"));
});

/* =========================
   DELETE
========================= */
export const removeDepartment = asyncHandler(async (req, res) => {
  await deleteDepartment(req.params.id);
  res.json(new ApiResponse(200, null, "Department deleted"));
});
