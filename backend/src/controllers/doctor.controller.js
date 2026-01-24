import { createDoctor,getDoctorList } from "../models/doctor.model.js";
import{ApiError} from "../utils/ApiError.js";
import{ApiResponse} from "../utils/ApiResponse.js";
import{asyncHandler} from "../utils/asyncHandler.js";

const createdoctor=asyncHandler(async(req,res)=>{
    const {first_name,last_name,specialization,phone_number,email}=req.body;
    
    if(!first_name || !first_name.trim())throw new ApiError(400, "First name is required");
    if(!last_name || !last_name.trim())throw new ApiError(400, "Last name is required");
    if(!specialization || specialization.trim())throw new ApiError(400, "Specialization is required");
    if(!phone_number)throw new ApiError(400, "Phone number is required");
    if(!email || !email.trim())throw new ApiError(400, "email is required");

    const doctor=await createDoctor(first_name,last_name,specialization,phone_number,email);

    return res.status(200).json(
        new ApiResponse(200,doctor,"doctor created successfully")
    )
})


const getListOfDoctors=asyncHandler(async(req,res)=>{
    const doctors=await getDoctorList();

    if(!doctors?.length)throw new ApiError(404,'no doctor found');

    return res.status(200).json(
        new ApiResponse(200,doctors,'doctors fetched successfully')
    )
})

export {
    createdoctor,
    getListOfDoctors
}