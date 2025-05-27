import Problem from "../models/Problem.js";
export const createProblems = async (req, res, next) => {
  try {
    const problems = await Problem.create(req.body);
    return res.status(201).json(problems);
  } catch (error) {
    next(error);
  }
};
