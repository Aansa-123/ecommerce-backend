import mongoose,{Schema} from 'mongoose'; 

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isSuperAdmin:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});

export default mongoose.model('User',userSchema);
