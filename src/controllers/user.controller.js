import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  // validation - not empty
  // check if user already exists: username and email
  // check for images and avatar
  // upload them on cloudinary, avatar is uploaded properly or not
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response

  const { fullName, email, userName, password } = req.body;
  //   console.log("email:", email);
  //   if (fullName === "") {
  //     throw new ApiError(400, "fullname is requird"); //similarly create other fields validation
  //   }

  // another method
  if (
    [fullName, userName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are compulsory");
  }

  const existedUser = User.findOne({
    $or: [{ userName }, { email }], //array of boject field required to be checked
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username exists!!");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0].path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // to upload coverimage and avatar on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // since avatar is a required field , need to check whether the avatar is uploaded or not
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // creating the user object
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", // if the coverimage is not uploaded then leave it empty, since it is not a required field and also not checked like avatar
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
)

});
export { registerUser };
