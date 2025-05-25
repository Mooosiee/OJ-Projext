import express from "express";
import { DBconnection } from "./db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
//import compilerRouter from "./routes/compiler.route.js";
dotenv.config();
const app = express();

 app.use(cors());
 app.use(cookieParser());
 app.use(express.json());
app.use(express.urlencoded({extended:true}));

DBconnection();

app.use("/backend/auth",authRouter);
//app.use("/backend/compiler",compilerRouter);
// app.use("/backend/user",)
app.use((err,req,res,next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'; 
    return res.status(statusCode).json({
        success: false,
        statusCode,message
    });
})


app.listen(process.env.PORT,() => {
   console.log(`Server is listening on port ${process.env.PORT}!`);
   
});