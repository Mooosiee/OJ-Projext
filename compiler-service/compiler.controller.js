import { generateFile } from "./generateFile.js";
import { generateInputFile } from "./generateInputFile.js";
import { executeCpp } from "./executeCpp.js";
import { executePython } from "./executePython.js";
import { executeJava } from "./executeJava.js";


// helper to get appropriate executor function
const getExecutor = (language) => {
  switch (language) {
    case "cpp":
      return executeCpp;
    case "py":
      return executePython;
    case "java":
      return executeJava;
    default:
      throw new Error("Unsupported language");
  }
};

export const submitCompiler = async (req, res) => {
  console.log("--- COMPILER SERVICE /compiler/run HIT ---");
  const { language = "cpp", code, testcases = [] } = req.body;
  console.log(language);
  
  if (code === undefined) {
    return res.status(400).json({ error: "Code is required" });
  }

  try {
    const filePath = generateFile(language, code);
    const execute = getExecutor(language);
    
    // Checking Each Testcase
    const testResults = [];
    for (const tc of testcases) {
      try {
        const tcInputPath = generateInputFile(tc.input);
        const result = await execute(filePath, tcInputPath);
        console.log(result);
        
        const passed = result.stdout.trim() === tc.output.trim();
        console.log(passed);
        console.log(result.stdout);
        
        const verdict = result.verdictHint === "Executed Successfully"
            ? (passed ? "Accepted" : "Wrong Answer")
            : result.verdictHint || "Unknown";

        testResults.push({
          input: tc.input,
          expected: tc.output,
          output: result.stdout,
          stderr: result.stderr,
          timedOut: result.timedOut,
          passed,
          verdict,
          error: null, // No error in success case
        });
        
        if (verdict !== "Accepted") {
          break; // Stopping on first non-Accepted result
        }
      } catch (error) {
        console.error("Test case execution error:", error);
        testResults.push({
          input: tc.input,
          expected: tc.output,
          output: error.stdout || "",
          stderr: error.stderr || "",
          timedOut: error.timedOut || false,
          passed: false,
          verdict: error.verdictHint || "Runtime Error",
          error: error.message,
        });
        break; // Stop on exception
      }
    }
    
    res.json({
      testResults,
      finalVerdict: testResults[testResults.length - 1]?.verdict || "Unknown",
      passedCount: testResults.filter((tc) => tc.verdict === "Accepted").length,
      totalTests: testcases.length,
    });
  } catch (error) {
    console.error("Error in submitCompiler:", error);
    res.status(500).json({ 
      error: "Internal server error during code submission." 
    });
  }
};

export const runCompiler = async (req, res) => {
  const { language, code, input = "" } = req.body;

  if (!code) {
    console.error("Compiler Service (run-custom): Code is missing.");
    return res.status(400).json({ error: "Code is required" });
  }

  console.log(
    `Compiler Service (run-custom): Lang: ${language}, Code: ${code.substring(
      0,
      50
    )}..., Input: ${input}`
  );

  try {
    const filePath = generateFile(language, code);
    const inputFilePath = generateInputFile(input);
    const execute = getExecutor(language);

    console.log(`Compiler Service (run-custom): File generated: ${filePath}`);
    console.log(
      `Compiler Service (run-custom): Input file generated: ${inputFilePath}`
    );

    console.log("Compiler Service (run-custom): Executing code...");
    const result = await execute(filePath, inputFilePath);
    console.log(
      "Compiler Service (run-custom): Execution finished. Output:",
      result
    );

    // Determine verdict for custom run
   
    const verdict = result.verdictHint || "Success";
    
    res.json({
      output: result.stdout || "",
      error: result.stderr || null,
      exitCode: result.exitCode,
      timedOut: result.timedOut,
      verdict,
    });
  } catch (error) {
    console.error("--- ERROR IN COMPILER SERVICE run-custom ---");
    console.error("Error message:", error.message);
    

    const outputFromError =
      error.stdout || error.stderr || error.error?.message || "Unknown error";

    res.status(500).json({
      output: outputFromError.trim(),
      error: error.message || "An internal error occurred in the compiler service during custom run.",
      verdict: error.verdictHint || "Execution Error",
    });
  }
};

