import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import { errorHandler } from "../utils/error.js";

export const updateUSER = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(403, "You can only update your own profile!"));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUSER = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(403, "You can only delete your own account!"));
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.clearCookie("token");
    res.status(200).json("User has been deleted successfully!");
  } catch (error) {
    next(error);
  }
};

export const getProblems = async (req, res, next) => {
  try {
    
    const { userId } = req.params;                   // userId:string 
    const userProblem = await Problem.find({ userRef: userId }); //gives me an array of problems
    res.status(200).json(userProblem);
    
  } catch (error) {
    next(error);
  }
};

export const getSubmissions = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userSubmission = await Submission.find({ user: userId}).populate(
      "problem"
    );
    res.status(200).json(userSubmission);
  } catch (error) {
    next(error);
  }
};
