import express from "express";
import compilerRouter from "./compiler.route.js";
import cors from "cors";
import {startScheduledCleanup} from "./scheduler.js"
const app = express();

app.use(express.json());
app.use("/compiler",compilerRouter);
app.use(cors({
  origin: 'http://localhost:5000' // Only allow main backend
}));

// Add timeout to executeCpp.js


app.listen(8000,() => {
    console.log("Server is running on PORT 8000");
});
 // --- Start the scheduled cleanup tasks : After server starts listening---
  startScheduledCleanup(); // <--- CALL THE FUNCTION