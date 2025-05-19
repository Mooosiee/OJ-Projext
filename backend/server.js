const express = require("express");
const app = express();


app.post("/register",(req,res) => {
    //get all data from frontend
    const{firstName,lastName,email,password} = req.body;
    //check all the data should exist
    if(!(firstName && lastName && email && password)){
        res.status(400).send("Please enter all the information");
    }
});

app.listen(5000,() => {
   console.log("Server is listening on port 5000");
});