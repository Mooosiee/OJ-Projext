import express from "express";
import compilerRouter from "./compiler.route.js";
import cors from "cors";
import {startScheduledCleanup} from "./scheduler.js"
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
const allowedOrigin = ['https://og-oj-backend.onrender.com','http://localhost:5000']
app.use(
  cors({
    origin:allowedOrigin,
    //Only allowed deployed and local backend
  })
);


app.use("/compiler",compilerRouter);

//Listen on correct PORT for Render
//Render doesn’t expose custom ports like 8000.
const PORT = process.env.PORT || 8000;
app.listen(PORT,() => {
    console.log(`Server is running on PORT ${PORT}`);
});
 // --- Start the scheduled cleanup tasks : After server starts listening---
startScheduledCleanup(); // <--- CALL THE FUNCTION
