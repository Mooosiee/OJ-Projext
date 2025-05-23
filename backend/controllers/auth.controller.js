import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
export const register = async (req, res) => {
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
    const hashedPassword =bcrypt.hashSync(password, 10);

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
        return res.status(500).json(error.message);
  }};


export const login = async (req, res) => {
    try {
      //get all the user data
      const { email, password } = req.body;
      //check all the user data exists
      if (!(email && password)) {
        return res.status(400).send("Please enter all the information");
      }
      //find user in database
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).send("User not found!");
      }
      //match the password
      const enteredpass = await bcrypt.compare(password, user.password);
      if (!enteredpass) {
        return res.status(401).send("Password is incorrect");
      }
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "1d",
      });
      user.token = token;
      user.password = undefined;
      //store cookies
      const options = {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60),
        httpOnly: true,
      };
      //send the token
      return res
        .status(200)
        .cookie("token", token, options)
        .json({
          message: "You have succesfully logged in!",
          success: true,
          token,
        });
    } catch (error) {
      console.log(error);
    }
  };

