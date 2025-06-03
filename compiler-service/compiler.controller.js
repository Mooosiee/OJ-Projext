import { errorHandler } from "../backend/utils/error.js";
import { generateFile } from "./generateFile.js";
import { executeCpp } from "./executeCpp.js";
import { generateInputFile } from "./generateInputFile.js";
export const submitCompiler = async (req, res, next) => {
  console.log("--- COMPILER SERVICE /compiler/run HIT ---");
  const { language = "cpp",code, input, testcases } = req.body;
  if (code === undefined) {
    return next(errorHandler(400, "Code is required"));
  }
  try {
    const filePath = generateFile(language, code);
    //for now , only submitting code so custom output is null;
    const customOutput = null; //await executeCpp(filePath, inputfilePath);
    // Only run custom input if 'input' is provided AND not empty
    if (input !== undefined && input !== null && input.trim() !== "") {
      console.log("Compiler Service: Processing custom input run...");
      const inputfilePath =  generateInputFile(input);
      customOutput = await executeCpp(filePath, inputfilePath); // This is output of custom input
      console.log("Compiler Service: Custom input run output:", customOutput);
    } else {
      console.log(
        "Compiler Service: No custom input provided or it's empty. Skipping custom input run."
      );
    }
    // You might still want to compile the code here to catch compilation errors early
    // and set 'overallMessageForClient'.
    // For simplicity, we'll assume executeCpp handles compilation checks.
    //Run testcases
    const testResults = [];
    for (const tc of testcases) {
      try {
        const tcInputPath =  generateInputFile(tc.input);
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
      output: customOutput, // This will be null if no custom input was run
      testResults,
      verdict: testResults.every((t) => t.passed) ? "Accepted" : "Wrong Answer",
    });
  } catch (error) {
    next(error);
  }
};

export const runCompiler = async (req,res,next) => {
    const { language = "cpp", code, input = "" } = req.body; // Default input to empty string
    if (!code) {
    console.error("Compiler Service (run-custom): Code is missing.");
    return next(errorHandler(400, "Code is required"));
  }
  console.log(`Compiler Service (run-custom): Lang: ${language}, Code: ${code.substring(0,50)}..., Input: ${input}`);
  try{
    const filePath =  generateFile(language, code);
    console.log(`Compiler Service (run-custom): File generated: ${filePath}`);
    const inputFilePath =  generateInputFile(input); // Pass the custom input
    console.log(`Compiler Service (run-custom): Input file generated: ${inputFilePath}`);
    console.log("Compiler Service (run-custom): Executing code...");
    const executionOutput = await executeCpp(filePath, inputFilePath); // executeCpp should return stdout (and potentially stderr separately or combined)
    console.log("Compiler Service (run-custom): Execution finished. Output:", executionOutput);
    res.json({
      output: executionOutput.trim(), // Trim whitespace from output
      error: null, // No specific execution error to report if executeCpp completed
    });

    
  }catch(error){
    console.error("--- ERROR IN COMPILER SERVICE run-custom ---");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // Try to provide more specific error feedback
    // 'error' might have 'stdout' or 'stderr' if it's from executeCpp
    const outputFromError = error.stdout || error.stderr || "";
    res.status(500).json({ // Send 500 or a more specific code if known (e.g., 400 for compilation error)
      output: outputFromError.trim(),
      error: error.message || "An internal error occurred in the compiler service during custom run.",
    });

  }
};


