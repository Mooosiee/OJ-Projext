import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        default:null,
        required:true,
    },
    lastName:{
        type:String,
        default:null,
        required:true,
    },
    email: {
        type:String,
        default:null,
        required:true,
        unique: true,
    },
    password: {
        type:String,
        required:true,
    }
});
const User =  mongoose.model("User",userSchema);
export default User;