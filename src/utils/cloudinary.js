import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) return null;
    // upload the file on cloudinary
    const reponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",      // automatically detect the file type
    });
    console.log("File has been uploaded", reponse.url); // uploaded file link is given
    return response
  } catch (error) {
    fs.unlinkSync(localFilePath)        // remove the locally saved temporary file as the upload operation got failed
  }
};

cloudinary.v2.uploader.upload(
  "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" },
  function (error, result) {
    console.log(result);
  }
);
