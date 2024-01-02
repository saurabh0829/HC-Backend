import express from "express";
import cookieParser from "cookie-parser";        //to access user' cookies from my server and do some crud operation on them
import cors from "cors";

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}));                    // app.use is used for middlewares

app.use(express.json({limit : "20kb"}));        // to limit the json size
app.use(express.urlencoded({extended : true, limit : "20kb"}))   // to encode the url special character, extended is used for nested objects
app.use(express.static("public"))  
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js';

//routes 
app.use("/api/v1/users", userRouter)        //https:localhost:8000/api/v1/users/register

export { app }