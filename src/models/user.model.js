import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";

const userSchema = new Schema(
    {
        userName: {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true, 
            index : true        // it is used to make any field searchable
        },
        email: {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true
        },
        fullName: {
            type : String,
            required : true,
            trim : true, 
            index : true
        },
        avatar: {
            type : String,   // url is used by cloudinary
            required : true     
        },
        coverImage : {
            type : Stirng       // cloudinary url
        },
        watchHistory : [
            {
                type : Schema.Types.ObjectId,
                ref : "Video"
            }
        ],
        password : {
            type : String,
            required : [true, 'Password is required']
        },
        refreshToken : {
            type : String
        }

    }, 
    {
        timestamps : true
    }
)

userSchema.pre("save", async function (next){           // this method is only call when there is change in password field 
    if(!this.isModified("password")){
        return next()
    }
    this.password = bcrypt.hash(this.password, 10)
    next()
} )

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)      // first is normal password, second is the encrypted password
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(                                                // this will generate the token
        {
            _id : this._id,
            email : this.email,
            userName : this.userName,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
        )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(                                                // this will generate the token
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
        )
}

export const User = mongoose.model("User", userSchema)   // exports the user model which is using userSchema 