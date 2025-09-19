import mongoose, { Schema} from "mongoose";

const passwordResetTokenSchema=new Schema({
    user:{
        type:[Schema.Types.ObjectId],
        ref:"User",
        required:true
    },
    token:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    },
},{timestamps:true})

export default mongoose.model("PasswordResetToken",passwordResetTokenSchema)