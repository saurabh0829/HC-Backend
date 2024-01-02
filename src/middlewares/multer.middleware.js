import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb)     //specifies the directory where the uploaded files will be stored
    {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb)        // specifies the name of the uploaded file 
    {
      cb(null, file.originalname)
    }
  })
  
  export const upload = multer({ 
    storage, 
})