import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

export default function SolveProblem() {
  const { id } = useParams();
  // States for "Submit Code" results
  const [subVerdict, setSubVerdict] = useState("");
  const [subTestResult, setsubTestResult] = useState([]);
  const [error, setError] = useState("");
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  // State for "Run Code"
  const [input, setInput] = useState(""); // This is for the custom input textarea
  // State for "Run Code" (custom input) results
  const [customOutput, setCustomOutput] = useState("");
  // Loading states
  const [isLoadingSub, setisLoadingSub] = useState(false);
  const [isLoadingCustomRun, setisLoadingCustomRun] = useState(false); //for "Run Code" button

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await fetch(`/backend/problems/${id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch problem");
        }
        const data = await res.json();
        setProblem(data);
      } catch (error) {
        console.error("Fetch error:", error.response?.data || error.message);
        setProblem({ error: "Failed to load problem" });
      }
    };

    fetchProblem();
  }, [id]);

  const handleSubmit = async () => {
    setisLoadingSub(true);
    setSubVerdict("");
    setsubTestResult([]);
    setCustomOutput(""); // Clear custom customOarea when submitting officially
    setError("");
    try {
      const res = await fetch("/backend/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: id,
          code,
          //input,// This is the custom input from the textarea-not needed for submit button
        }),
        credentials: "include",
      });

      const data = await res.json(); // Expected: { verdict, testResults,
      //  customO(customOutput from compiler, should be null/ignored here) }
      setSubVerdict(data.verdict || "Verdict not available");
      if (data.testResults) {
        setsubTestResult(data.testResults);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Error running code");
      setSubVerdict("Error");
    } finally { //Is used to execute code regardless of whether an exception was raised or not in the try block.
      setisLoadingSub(false);
    }
  };
  const handleRun = async () => {
    setCustomOutput("");
    setisLoadingCustomRun(true);
    setError("");
    try {
      const res = await fetch("/backend/custom-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          //problemId: id, - not needed for custom input
          language : "cpp", // will make it dynamic to support more langs
          code,
          input // This is the custom input from the textarea-not needed for submit button
        })
      });

      const data = await res.json();  // Expected: { output: "...", error: "..." 
      if(data.success === false){
        setCustomOutput(data.message);
      }
      setCustomOutput(data.output);
      
    } catch (error) {
      setError(error.response?.data?.error || "Error running code");
    } finally {
      setisLoadingCustomRun(false);
    }
  };

  if (!problem) return <div>Loading problem...</div>;
  if (problem?.error) return <div>Error: {problem.error}</div>;

  return (
    <div className="flex h-screen pt-2 ">
      {/* Left Side - Problem Description */}
      <div className="flex-1 p-6 overflow-y-auto border-r border-gray-200 ">
        <h1 className="text-2xl font-semibold">{problem.name}</h1>
        <p className="mt-2 whitespace-pre-wrap">{problem.description}</p>
        <div className="flex flex-col mt-8 mb-4 ">
          <div className="border border-l-border px-1">
            <h3 className="font-medium">Input Format</h3>
            <pre className="italic whitespace-pre-wrap">
              {problem.inputFormat}
            </pre>
          </div>
          <div className="mt-3 border border-l-border px-1">
            <h3 className="font-medium">Output Format</h3>
            <pre className="italic whitespace-pre-wrap">
              {problem.outputFormat}
            </pre>
          </div>
        </div>
        <h3 className="font-semibold">Constraints</h3>
        <pre>{problem.constraints}</pre>
        <div className="mt-3 px-2 border border-l-border">
          <h3 className="font-medium">Sample Input</h3>
          <pre className="whitespace-pre-wrap">{problem.sampleInput}</pre>
        </div>
        <div className="mt-3 px-2 border border-l-border">
          <h3 className="font-medium">Sample Output</h3>
          <pre className="whitespace-pre-wrap">{problem.sampleOutput}</pre>
        </div>
      </div>

      {/* Right Side - Editor and UI */}
      <div className="mx-2 flex-1 flex flex-col max-w-[50%] bg-[#1e1e1e] p-5">
        <Editor
          height="calc(40vh - 20px)" // Adjusted height slightly for better fit
          defaultLanguage="cpp"
          defaultValue={`#include <iostream>
using namespace std;

int main() {
    // your code goes here
    return 0;
}`}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
          options={{ minimap: { enabled: false } }}
        />
        <div className="my-2">
          <textarea
            rows={2}
            className="w-full bg-[#222222] text-white border border-[#444444] p-2 rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter custom input here..."
            disabled={isLoadingSub || isLoadingCustomRun} //textarea will be disabled
            //why is this useful?-
          />
        </div>
        {/*Buttons*/}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={handleRun}
            disabled={isLoadingSub || isLoadingCustomRun}
            className={`flex-1 text-white py-2 px-4 border-none rounded cursor-pointer 
                        ${
                          isLoadingCustomRun
                            ? "bg-gray-700"
                            : "bg-gray-500 hover:bg-gray-400"
                        }`}
            title="Run your code with the custom input below (does not submit)"
          >
            {isLoadingCustomRun ? "Running..." : "Run Code"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoadingSub || isLoadingCustomRun}
            className={`flex-1 text-white py-2 px-4 border-none rounded cursor-pointer
                      ${
                        isLoadingSub
                          ? "bg-gray-700"
                          : "bg-[#007acc] hover:bg-[#005fa3]"
                      }`}
            title="Submit your code for official evaluation against all test cases"
            //title shows a small tooltip on hover
            // gives helpful hints to users, especially for icons or buttons that may not be immediately obvious.
          >
            {isLoadingSub ? "Submitting..." : "Submit Code"}
          </button>
        </div>
       {/* Results Area: Uses flex-grow to take remaining space and provides its own scroll if needed */}
        <div className="mt-auto flex flex-col overflow-y-auto" style={{ flexGrow: 1 }}>
           {/* Display Submission Verdict */}
           {subVerdict && (
            <div
              className={`py-2 px-4 mb-3 rounded text-lg font-semibold text-white text-center
                          ${subVerdict === "Accepted" ? "bg-green-600" :
                            subVerdict.toLowerCase().includes("error") || subVerdict === "Verdict not available" || subVerdict === "N/A" ? "bg-yellow-500 text-black" :
                            "bg-red-600" // For Wrong Answer, TLE, MLE, etc.
                          }`}
            >
              {subVerdict}
            </div>
          )}

          {/* Display General Submission Error if any, and if not already part of verdict */}
          {error && !subVerdict.toLowerCase().includes("error") && (
            <div className="bg-red-700 text-white p-3 mb-3 rounded text-sm">
                <strong>Submission Error:</strong> {error}
            </div>
          )}

           {/* Display Output from Custom Run */}
          {customOutput && (
            <div className="mb-3">
              <h3 className="text-white mb-1 text-sm">Output:</h3>
              <pre className="bg-[#222222] text-[#00ff00] p-2 text-xs min-h-[40px] whitespace-pre-wrap rounded">
                {customOutput}
              </pre>
            </div>
          )}
           {/* Display Detailed Test Results from Submission */}
          {subTestResult.length > 0 && (
            <div className="mb-2"> {/* Added mb-2 for spacing at the very bottom */}
              <h3 className="text-white mb-1 text-sm">Test Case Results:</h3>
              {subTestResult.map((result, index) => (
                <div
                  key={index}
                  className={`p-2 mb-2 rounded text-xs  // Reduced padding and margin for tighter fit
                              ${result.passed && !result.error ? "bg-[#1a4314]" : "bg-[#4a0f0f]"}`}
                >
                  <div className="text-white font-medium">
                    Test Case {index + 1}:{" "}
                    {result.passed && !result.error
                      ? "Passed"
                      : `Failed ${result.error ? `(Error: ${result.error})` : ''}`
                    }
                  </div>
                  {/* Show details if not passed or if there's an error message for the test case */}
                  {(!result.passed || result.error) && (
                    <div className="mt-1 text-gray-300">
                      <div className="font-mono"><span className="text-gray-500">Input:</span> {result.input}</div>
                      <div className="font-mono"><span className="text-gray-500">Expected:</span> {result.expected}</div>
                      <div className="font-mono"><span className="text-gray-500">Actual:</span> {result.actual}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
