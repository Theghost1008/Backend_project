import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js"; 
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {apiResponse} from "../utils/apiResponse.js";

const registerUser = asyncHandler( async (req,res)=>{
    // res.status(200).json({
    //     message: "Hello kanitexe"
    // })
    
    //get user details from frontend
    //validation - not empty
    //check if user already exists: username, email
    //check for images, check for avatar
    //upload them to cloudinary 
    //create a user object - create entry in db
    //remove password and refreshToken field from resp
    //check for user creation 
    //return res

    const {fullName, email, username, password} = req.body
    console.log("email:", email);
    // if(fullName === "")
    // {
    //     throw new ApiError(400,"Fullname is required")
    // }
    // if(email === "")
    // {
    //     throw new ApiError(400,"email is required")
    // }
    // if(username === "")
    // {
    //     throw new ApiError(400,"username is required")
    // }
    // if(password === "")
    // {
    //     throw new ApiError(400,"password is required")
    // }
    if([fullName, email,username,password].some((field)=>field?.trim()===""))// if any of the fields returns true then the field is empty even after trimming
    {
        throw new ApiError(400, "All fields are compulsory")
    }
    const existedUser = User.findOne({
        $or: [{username},{email}]
    })
    if(existedUser)
    {
        throw new ApiError(409,"User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path // avatar[0] give first property gives object which gives us .path
    //multer gets file from user onto our server
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if(!avatarLocalPath)
    {
        throw new ApiError(400, "Avatar file is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const cover = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar)
    {
        throw new ApiError(400, "Avatar not uploaded on cloudinary");
    }
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        cover : cover?.url || "",// if coverimage is present then give url else empty
        email,
        password,
        username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(// before select we check if user is created or not
        "-password -refreshToken"// the field with "-" prefix will be removed
    )
    if(!createdUser)
    {
        throw new ApiError(500, "Something went wrong while registering the user");
    }
    
    return res.status(201).json(
        new apiResponse(200,createdUser,"User registered successfully")
    )
})

export {registerUser}