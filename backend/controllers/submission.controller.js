import Submission from "../models/Submission.js";
export const submitCode = async (req,res,next) => {
   try{
    const {problemId,code,input} = req.body;
    //Forward to compiler service
    const compilerRes = await axios.post('http://localhost:8000/compiler/run',{
      code,
      input,
      testcases : req.problem.testcases // get problem from middleware
    });
    //Save submission
    const submission = new Submission({
      user : req.user.id,
      problem : problemId,
      code,
      input,
      output : compilerRes.data.output,
      verdict: compilerRes.data.verdict
    });
    await submission.save();
    res.json(compilerRes.data);
   }catch(error){
      next(error);
   }
};