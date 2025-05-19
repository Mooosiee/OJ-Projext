const express = require("express");
const app = express();
const {DBconnection} = require("./database/db");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

DBconnection();

app.get("/",(req,res) => {
    res.send("Hello World");
});

app.post("/register",async (req,res) => {
    console.log(req.body);
    res.send("Recieved");
    try{
    //get all data from frontend
    const{firstName,lastName,email,password} = req.body;
    //check all the data should exist
    if(!(firstName && lastName && email && password)){
        return res.status(400).send("Please enter all the information");
    }
    //check if the user exists
    const existing_user = await User.findOne({email});
    if(existing_user){
        return res.status(400).send("User already exists with the same email");
    }
    //add more validations

    //hashing/encrypt the password
    const hashedPassword = await bcrypt.hash(password,10);

    //save the user in the db
    const user = await User.create({
        firstName,
        lastName,
        email,
        password : hashedPassword,
    });
    //generate a token for user and send it
    const token = jwt.sign({id:user._id,email},process.env.SECRET_KEY,{
        expiresIn :  '1h',
    });
    user.token = token;
    user.password = undefined;
    //send the token
    return res.status(200).json({message : 'You have succesfully registered!',user});
    
} catch(error){
    console.log(error);
}
});

app.post("/login",async (req,res) => {
    try{
        //get all the user data
        const{email,password} = req.body;
        //check all the user data exists
        if(!(email && password)){
            return res.status(400).send("Please enter all the information");
        }
        //find user in database
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).send("User not found!");
        }
        //match the password
        const enteredpass = await bcrypt.compare(password,user.password);
        if(!enteredpass){
            return res.status(401).send("Password is incorrect");
        }
        const token = jwt.sign({id : user._id},process.env.SECRET_KEY,{
            expiresIn:'1d',
        });
        user.token = token;
        user.password = undefined;
        //store cookies
        const options = {
            expires: new Date(Date.now()+ 1 * 24 * 60 *60),
            httpOnly: true,
        };
        //send the token
        return res.status(200).cookie("token",token,options).json({message:'You have succesfully logged in!',
            success:true,
            token,
        });
    } catch(error){
        console.log(error);
    }
})
app.listen(process.env.PORT,() => {
   console.log(`Server is listening on port ${process.env.PORT}!`);
   
});