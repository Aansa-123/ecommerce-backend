import mongoose,{Schema} from "mongoose";

const brandSchema=new Schema({
    name:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

export default mongoose.model("Brand",brandSchema);