import { errorHandler } from "../backend/utils/error.js";
import { generateFile } from "./generateFile.js";
import { executeCpp } from "./executeCpp.js";
import { generateInputFile } from "./generateInputFile.js";
export const runCompiler = async (req, res, next) => {
  const { code, input, testcases } = req.body;
  if (code === undefined) {
    return next(errorHandler(400, "Code is required"));
  }
  try {
    const filePath = generateFile(cpp, code);
    const inputfilePath = generateInputFile(input);
    const customOutput = await executeCpp(filePath, inputfilePath);
    //Run testcases
    const testResults = [];
    for (const tc of testcases) {
      try {
        const tcInputPath = generateInputFile(tc.input);
        const output = await executeCpp(filePath, tcInputPath);
        testResults.push({
          input: tc.input,
          expected: tc.output,
          actual: output,
          passed: output.trim() === tc.output.trim(),
        });
      } catch (error) {
        testResults.push({
          input: tc.input,
          error: error.message,
        });
      }
    }

    res.json({
      output: customOutput,
      testResults,
      verdict: testResults.every((t) => t.passed) ? "Accepted" : "Wrong Answer",
    });
  } catch (error) {
    next(error);
  }
};
