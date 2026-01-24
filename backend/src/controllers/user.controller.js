import { findUserByUserId, findUserByUsername } from "../models/user.model.js";
import{ApiError} from "../utils/ApiError.js";
import{ApiResponse} from "../utils/ApiResponse.js";
import{asyncHandler} from "../utils/asyncHandler.js";

const findUserByName=asyncHandler(async(req,res)=>{
    const {username}=req.body;

    if(!username?.trim()){
        throw new ApiError(404,'Invalid username');
    }

    const user=await findUserByUsername(username);

    if(!user){
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200,user,"User found successfully")
    );
});

const findUserById=asyncHandler(async(req,res)=>{
    const {user_id}=req.body;

    if(!user_id?.trim()){
        throw new ApiError(404,'Invalid username');
    }

    const result=await findUserByUserId(user_id);

    return res.status(200)
    .json(new ApiResponse(200,result,"User found successfully"))
});

export {
    findUserById,
    findUserByName
}