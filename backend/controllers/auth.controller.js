import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
export const SignUp = async (req, res,next) => {
  try {
    //get all data from frontend
    const { username, email, password } = req.body;
    //check all the data should exist
    if (!(username && email && password)) {
      return res.status(400).send("Please enter all the information");
    }
    //check if the user exists:will be caught in error 

    //add more validations

    //hashing/encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    //save the user in the db
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    //generate a token for user and send it
    const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    user.token = token;
    user.password = undefined;
    //send the token
    return res
      .status(200)
      .json({ message: "You have succesfully registered!", user });
  } catch (error) {
        next(error);
  }};


export const login = async (req, res,next) => {
    try {
      //get all the user data
      const { email, password } = req.body;
    
      //find user in database        //key value after ES6
      const user = await User.findOne({ email });
      if (!user) {
        return next(errorHandler(404,"User not found!"));
      }
      //match the password
      const enteredpass = await bcrypt.compareSync(password, user.password);
      if (!enteredpass) {
        return next(errorHandler(401,"Wrong Credentials"));
      }
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "1d",
      });
      const { password: pass, ...rest } = user._doc;
      //store cookies
      
      //send the token
      return res
        .status(200)
        .cookie("token", token, {httpOnly:true})
        .json(rest);
    } catch (error) {
      next(error);
    }
  };

