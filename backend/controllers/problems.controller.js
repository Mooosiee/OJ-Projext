import Problem from "../models/Problem.js";
export const createProblems = async (req, res, next) => {
  try {
    const problems = await Problem.create({
      ...req.body,
      userRef: req.user.id,}); // <-- Set userRef from the authenticated user! not from the request body 
      // Ensure that the userRef is set to the authenticated user's ID
      // (for security).Your verifyToken middleware should put the user’s ID on req.user._id.
    return res.status(201).json(problems);
  } catch (error) {
    next(error);
  }
};

export const getAllProblems = async (req, res, next) => {
    try{
      const problems = await Problem.find().populate("userRef", "username");
      res.status(200).json(problems);
    }catch(error) {
      next(error);
    }
};

// export const getUserProblems = async (req, res, next) => {
//    if(req.params.id !== req.user.id) {
//      try{
//          const problems = await Problem.find({userRef: req.params.id});
//          res.status(200).json({problems});
//      }catch(error) {
//        next(error);
//      }
// }
// };