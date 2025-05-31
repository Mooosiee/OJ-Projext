import express from "express";
import compilerRouter from "./compiler.route.js";

const app = express();

app.use(express.json());
app.use("/compiler",compilerRouter);


app.listen(8000,() => {
    console.log("Server is running on PORT 8000");
})