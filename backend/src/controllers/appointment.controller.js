import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import {createAppointment, getTodaysAppointments, updateAppointmentStatus} from '../models/appointment.model';

const createappointment=asyncHandler(async(req,res)=>{
    const {patient_id,doctor_id,appointment_date,appointment_time,appointment_type,status}=req.body;

    if(!patient_id)throw new ApiError(400, "patient_id is required");
    if(!doctor_id)throw new ApiError(400,'doctor id is required');
    if(!appointment_date)throw new ApiError(400, "appointment_date is required");
    if(!appointment_time)throw new ApiError(400, "appointment_time is required");
    if(!appointment_type)throw new ApiError(400, "appointment_type is required");
    if(!status || !status.trim())throw new ApiError(400, "status is required");

    const appointment=await createAppointment(patient_id,doctor_id,appointment_date,appointment_time,appointment_type,status);

    return res.status(200).json(
        new ApiResponse(200,appointment,'appoitment created successfully')
    )
})

const todaysAppointments=asyncHandler(async(req,res)=>{
    const date=new Date();
    const monthName=date.getMonth()+1;
    const appointments=await getTodaysAppointments(date,monthName);

    return res.status(200).json(
        new ApiResponse(200,appointments,'Apponitments fetched successfully')
    )
})

const updateStatus=asyncHandler(async(req,res)=>{
    const {appointment_id,status}=req.body

    if(!appointment_id)throw new ApiError(400, "appointment id is required");
    if(!status || !status.trim())throw new ApiError(400, "status is required");

    const updatedAppointment=await updateAppointmentStatus(appointment_id,status);

    return res.status(200).json(
        new ApiResponse(200,updatedAppointment,'appointment updated successfully')
    )
})

export {
    createappointment,
    todaysAppointments,
    updateStatus
}