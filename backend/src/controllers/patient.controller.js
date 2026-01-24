import { createPatient,listPatient,updatePatient } from "../models/patient.model.js";
import{ApiError} from "../utils/ApiError.js";
import{ApiResponse} from "../utils/ApiResponse.js";
import{asyncHandler} from "../utils/asyncHandler.js";

const createpatient=asyncHandler(async(req,res)=>{
    const {first_name,last_name,age,gender,contact_number,address,status}=req.body;
    
    if(!first_name || !first_name.trim())throw new ApiError(400, "First name is required");
    if(!last_name || !last_name.trim())throw new ApiError(400, "Last name is required");
    if(!age)throw new ApiError(400, "Age is required");
    if(typeof age !== "number" || age <= 0 || age > 120)throw new ApiError(400, "Age must be a valid number between 1 and 120");
    if(!gender)throw new ApiError(400, "Gender is required");
    if(!contact_number)throw new ApiError(400, "Contact number is required");
    if(!address || !address.trim())throw new ApiError(400, "Address is required");
    if(!status || !status.trim())throw new ApiError(400, "Patient status is required");
    const patient=await createPatient(first_name,last_name,age,gender,contact_number,address,status);

    return res.status(200).json(
        new ApiResponse(200,patient,'Patient Created Successfully')
    )
})

const getPatientList=asyncHandler(async(req,res)=>{
    const patientList=await listPatient();

    if(!patientList?.length)throw new ApiError(400,'No Patient Found');

    return res.status(200).json(
        new ApiResponse(200,patientList,'Patients details fetched successfully ')
    )
})

const updatepatient=asyncHandler(async(req,res)=>{
    const {patient_id,first_name,last_name,contact_number,address,status}=req.body

    if (!patient_id)throw new ApiError(400, "Patient ID is required");
    if(!first_name || !first_name.trim())throw new ApiError(400, "First name is required");
    if(!last_name || !last_name.trim())throw new ApiError(400, "Last name is required");
    if(!contact_number)throw new ApiError(400, "Contact number is required");
    if(!address || !address.trim())throw new ApiError(400, "Address is required");
    if(!status || !status.trim())throw new ApiError(400, "Patient status is required");
    const updatedPatient=await updatePatient(patient_id,first_name,last_name,contact_number,address,status)

    return res.status(200).json(
        new ApiResponse(200,updatedPatient,'Patient updated successfully')
    )
})

export {
    createpatient,
    getPatientList,
    updatepatient
}