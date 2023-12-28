import mongoose, { Schema } from "mongoose";    //mongoose is alibrary and Schema is class
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";          // bcrypt is a library and hash is a function

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
        timestamps : true           // it is used to for created at & updated at field
    }
)

userSchema.pre("save", async function (next){           // this method will only be called when there is change in password field 
    if(!this.isModified("password")){
        return next()
    }
    this.password = bcrypt.hash(this.password, 10)
    next()
} )

// Another method, using callback to get the error and hashedPassword
// userSchema.pre("save", async function (next){           
//     if(!this.isModified("password")){
//         return next()
//     }
//     this.password = bcrypt.hash(this.password, 10, (err, hashedPassword)=>{
//         if (err) {
//             console.log("Error in hashing the password", err);
//         } 
//         else {
//             console.log("Hashed Password", hashedPassword);
//         }
//     })
//     next()
// } )


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)      // first is normal password, second is the encrypted password
}

userSchema.methods.generateAccessToken = function(){         // this will generate the token
    return jwt.sign(                                                
        {                                                   // jwt.sign(payload, secretOrPvtKey, [options, callback])
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
    return jwt.sign(                                                
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