import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DBconnection = async () => {
const MONGO_URI = process.env.MONGODB_URL;
    try{
       await mongoose.connect(MONGO_URI);
       console.log("DB connection is established");
    }
    catch(error){
       console.log("Error while connecting to MongoDB",error);
    }
};
export { DBconnection };

