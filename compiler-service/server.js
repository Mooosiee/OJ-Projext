import express from "express";
import compilerRouter from "./compiler-service/compiler.route.js";

const app = express();

app.use(express.json());
app.use("/backend/compiler",compilerRouter);


app.listen(8000,() => {
    console.log("Server is running on PORT 8000");
})