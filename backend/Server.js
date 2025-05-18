const express = require("express");
const app = express();

app.get("/",(req,res) => {
    res.send("Hello World");
});
app.post("/register",(req,res) => {
    //get all the data from the frontend
    const{firstName,lastName,email,password} = req.body;
    //check that all the data should exist
    if(!(firstName && lastName && email && password)){
        return res.status(400).send("Please enter all the information");
    }
    //check if the user already exists
    //hashing or encrypt the password
    //save the user in the db
    //generate a token for user and send it
});

app.listen(5000,() =>{
    console.log("Server is listening on port number 5000");
});