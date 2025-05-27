import Problem from "../models/Problem.js";
export const createProblems = async (req, res, next) => {
  try {
    const problems = await Problem.create(req.body
      // userRef: req.user._id, // <-- Set userRef from the authenticated user!
    );
    return res.status(201).json(problems);
  } catch (error) {
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