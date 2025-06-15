import Problem from "../models/Problem.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";

export const createProblems = async (req, res, next) => {
  try {
    const problems = await Problem.create({
      ...req.body,
      userRef: req.user.id,
    }); // <-- Set userRef from the authenticated user! not from the request body
    // Ensure that the userRef is set to the authenticated user's ID
    // (for security).Your verifyToken middleware should put the user’s ID on req.user._id.
    return res.status(201).json(problems);
  } catch (error) {
    next(error);
  }
};
export const getAllProblems = async (req, res, next) => {
  try {
    const problems = await Problem.find()
      .populate("userRef", "username")
      .lean(); //Makes each document a plain JS object

    const formattedProblems = problems.map((problem) => ({
      id: problem._id,
      name: problem.name,
      difficulty: problem.difficulty,
      tags: problem.tags,
      createdAt: problem.createdAt,
    }));

    res.status(200).json(formattedProblems);
  } catch (error) {
    next(error);
  }
};
export const getAProblem = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(errorHandler(400, "Invalid problem ID format"));
    }
    const problem = await Problem.findById(req.params.id)
      .populate("userRef", "username")
      .lean();
    if (!problem) {
      return next(errorHandler(404, "Problem not found"));
    }
    res.json({
      id: problem._id,
      name: problem.name,
      description: problem.description,
      inputFormat: problem.inputFormat,
      outputFormat: problem.outputFormat,
      constraints: problem.constraints,
      sampleInput: problem.sampleInput,
      sampleOutput: problem.sampleOutput,
      userRef: problem.userRef,
      testcases: problem.testcases,
      difficulty: problem.difficulty,
      tags: problem.tags,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProblem = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return next(errorHandler(400, "Invalid problem ID format"));
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      problemId,
      req.body, // This contains the updated fields from frontend
      { new: true } // So Mongo returns the updated document
    );

    if (!updatedProblem) {
      return next(errorHandler(404, "Problem not found"));
    }

    res.status(200).json(updatedProblem);
  } catch (error) {
    next(error);
  }
};
export const deleteProblem = async (req, res, next) => {
  try {
    const { problemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return next(errorHandler(400, "Invalid problem ID format"));
    }

    const deletedProblem = await Problem.findByIdAndDelete(problemId);
    console.log(deletedProblem);
    if (!deletedProblem) {
      return next(errorHandler(404, "Problem not found"));
    }

    res.status(200).json(deletedProblem);
  } catch (error) {
    next(error);
  }
};
