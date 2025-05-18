//importing required packages
const mongoose = require("mongoose");
const dotenv = require("dotenv"); 
dotenv.config();//initializes dotenv so your environment variables are available

const DBconnection = async () => {
    const MONGO_URI = process.env.MONGODB_URL;
    try{
        await mongoose.connect(MONGO_URI);
        console.log("DB connection established");
    }
    catch(error){
        console.log("Error while connecting to MongoDB",error);
    }
};
module.exports ={DBconnection};