import mongoose, { Schema } from "mongoose";
 
const otpSchema=new Schema({
    user:{
        type:[Schema.Types.ObjectId],
        ref:"User",
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    },
},{timestamps:true})

export default mongoose.model("OTP",otpSchema)