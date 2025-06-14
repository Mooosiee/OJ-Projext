import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

export default function SolveProblem() {
  const currentUser = useSelector((state) => state.user.user);
  const { id } = useParams();
  const [selectedLanguage, setSelectedLanguage] = useState("cpp"); // State for language selection
  
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
  const templates = {
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code goes here\n    return 0;\n}`,
    py: `# Your Python code goes here\nprint("Hello from Python!")`,
    java: `// Your Java code goes here\n// Ensure your class name is Main if submitting to a typical OJ system\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}`,
  };
  setCode(templates[selectedLanguage]);
}, [selectedLanguage]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await fetch(`https://og-oj-backend.onrender.com/backend/problems/${id}`,{
          method : "GET",
          credentials: "include", 
        });
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
     if (!currentUser) {
    alert("Login to submit code!");
    return;
  }
    setisLoadingSub(true);
    setSubVerdict("");
    setsubTestResult([]);
    setCustomOutput(""); // Clear custom customOarea when submitting officially
    setError("");
    try {
      const res = await fetch("https://og-oj-backend.onrender.com/backend/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language : selectedLanguage,
          problemId: id,
          code,
        }),
        credentials: "include",
      });

      const data = await res.json(); // Expected: { verdict, testResults,
      //  customO(customOutput from compiler, should be null/ignored here) }
      console.log(data);
      setSubVerdict(data.finalVerdict || "Verdict not available");
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
     if (!currentUser) {
    alert("Login to run code!");
    return;
  }
    setCustomOutput("");
    setisLoadingCustomRun(true);
    setError("");
    try {
      const res = await fetch("https://og-oj-backend.onrender.com/backend/custom-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          //problemId: id, - not needed for custom input
          selectedLanguage, // will make it dynamic to support more langs
          code,
          input // This is the custom input from the textarea-not needed for submit button
        }),
        credentials: "include",
      });

      const data = await res.json();  // Expected: { output: "...", error: "..." 
      if(data.success === false){
        setCustomOutput(data.message);
        return;
      }
      setCustomOutput(data.output);
      
    } catch (error) {
      setError(error.response?.data?.error || "Error running code");
    } finally {
      setisLoadingCustomRun(false);
    }
  };


  if (!problem) return <div className="bg-background min-h-screen flex items-center justify-center text-text-primary text-xl">Loading problem...</div>;
  if (problem?.error) return <div className="bg-background min-h-screen flex items-center justify-center text-error text-xl p-6">Error: {problem.error}</div>;

  return (
    <div className="flex h-screen pt-2 bg-background text-text-primary"> {/* Main page background and text */}
      {/* Left Side - Problem Description */}
      <div className="flex-1 p-6 overflow-y-auto border-r border-border bg-surface shadow-lg"> {/* Surface bg for left panel, themed border */}
        <h1 className="text-3xl font-semibold text-primary mb-4">{problem.name}</h1>
        <p className="mt-2 whitespace-pre-wrap text-text-secondary leading-relaxed mb-3">{problem.description}</p>
        <p className="italic whitespace-pre-wrap text-text-secondary text-sm ">
          Author : {problem.userRef?.username || "Unknow Author"}</p>
        <div className="flex flex-col mt-8 mb-4 gap-4">
          <div className="border border-border p-3 rounded-md bg-background">
            <h3 className="font-semibold text-text-primary mb-1">Input Format</h3>
            <pre className="italic whitespace-pre-wrap text-text-secondary text-sm">
              {problem.inputFormat}
            </pre>
          </div>
          <div className="border border-border p-3 rounded-md bg-background">
            <h3 className="font-semibold text-text-primary mb-1">Output Format</h3>
            <pre className="italic whitespace-pre-wrap text-text-secondary text-sm">
              {problem.outputFormat}
            </pre>
          </div>
        </div>

        <div className="border border-border p-3 rounded-md bg-background mb-4">
            <h3 className="font-semibold text-text-primary mb-1">Constraints</h3>
            <pre className="whitespace-pre-wrap text-text-secondary text-sm">{problem.constraints}</pre>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border p-3 rounded-md bg-background">
            <h3 className="font-semibold text-text-primary mb-1">Sample Input</h3>
            <pre className="whitespace-pre-wrap text-text-secondary text-sm">{problem.sampleInput}</pre>
            </div>
            <div className="border border-border p-3 rounded-md bg-background">
            <h3 className="font-semibold text-text-primary mb-1">Sample Output</h3>
            <pre className="whitespace-pre-wrap text-text-secondary text-sm">{problem.sampleOutput}</pre>
            </div>
        </div>
      </div>

      {/* Right Side - Editor and UI */}
      <div className="mx-2 flex-1 flex flex-col max-w-[50%] bg-surface p-2 shadow-lg rounded-lg"> {/* Surface bg for right panel */}
        {/* Language Selector Placeholder -Will Add when i implement language selection */}
        <div className="mb-2">
            <label htmlFor="language-select" className="block mb-1 text-sm font-medium text-text-secondary">Language:</label>
            <select id="language-select" 
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-background border border-border text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            disabled={isLoadingSub || isLoadingCustomRun}>
                <option value="cpp">C++</option>
                <option value="py">Python</option>
                <option value="java">Java</option>
            </select>
        </div> 

        <Editor
          height="35vh"
          defaultLanguage="cpp" // This will be overridden by 'language' prop if you add language state
          language={selectedLanguage} // Example if you add language selection state
          defaultValue={`#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code goes here\n    return 0;\n}`}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark" // vs-dark is already good for dark themes
          options={{ 
            minimap: { enabled: false },
            fontSize: 14, // Slightly larger font
            wordWrap: "on", // Enable word wrap
            scrollBeyondLastLine: false,
          }}
        />
        <div className="my-2"> {/* Consistent margin */}
          <label htmlFor="custom-input-area" className="block mb-1 text-sm font-medium text-text-secondary">Custom Input:</label>
          <textarea
            id="custom-input-area"
            rows={2} // Increased rows slightly
            className="w-full bg-background border border-border text-text-primary p-1.5 rounded-lg text-sm focus:ring-primary focus:border-primary placeholder-text-secondary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter custom input..."
            disabled={isLoadingSub || isLoadingCustomRun}
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 mb-2"> {/* Increased space-x */}
          <button
            onClick={handleRun}
            disabled={isLoadingSub || isLoadingCustomRun}
            className={`flex-1 text-white py-2.5 px-4 border-none rounded-lg cursor-pointer transition duration-150 ease-in-out font-medium
                        ${isLoadingCustomRun ? "bg-gray-700 opacity-70" : "bg-custom_btn hover:bg-opacity-80 focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-gray-500"}`}
            title="Run your code with the custom input below (does not submit)"
          >
            {isLoadingCustomRun ? "Running..." : "Run Code"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoadingSub || isLoadingCustomRun}
            className={`flex-1 text-white py-2.5 px-4 border-none rounded-lg cursor-pointer transition duration-150 ease-in-out font-medium
                      ${isLoadingSub ? "bg-blue-800 opacity-70" : "bg-primary hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary"}`}
            title="Submit your code for official evaluation against all test cases"
          >
            {isLoadingSub ? "Submitting..." : "Submit Code"}
          </button>
        </div>

       {/* Results Area */}
        <div className="mt-auto flex flex-col overflow-y-auto pt-4 border-t border-border" style={{ flexGrow: 1 }}> {/* Added top border */}
           {/* Display Submission Verdict */}
           {subVerdict && (
            <div
              className={`py-2.5 px-4 mb-3 rounded-lg text-lg font-semibold text-white text-center shadow
                          ${subVerdict === "Accepted" ? "bg-success" : // Use theme color
                            subVerdict.toLowerCase().includes("error") || subVerdict === "Verdict not available" || subVerdict === "N/A" ? "bg-warning text-background" : // Use theme color
                            "bg-error" // Use theme color (For Wrong Answer, TLE, MLE, etc.)
                          }`}
            >
              Verdict: {subVerdict} {/* Removed "Verdict: " prefix as it's clear from context */}
            </div>
          )}

          {/* Display General Submission Error if any, and if not already part of verdict */}
          {error && !subVerdict.toLowerCase().includes("error") && ( // 'error' is your general error state
            <div className="bg-error/20 text-error p-3 mb-3 rounded-lg text-sm border border-error"> {/* Subtle error bg */}
            {/* strong tag : tells browsers, screen readers, and search engines that this text is important. */}
                <strong>Error:</strong> {error}
            </div>
          )}

           {/* Display Output from Custom Run */}
          {customOutput && (
            <div className="mb-4">
              <h3 className="text-text-primary mb-1 text-sm font-medium">Output (from Custom Input):</h3>
              <pre className="bg-background border border-border text-green-400 p-3 text-xs min-h-[60px] whitespace-pre-wrap rounded-md shadow-sm">
                {customOutput}
              </pre>
            </div>
          )}

           {/* Display Detailed Test Results from Submission */}
          {subTestResult.length > 0 && (
            <div className="mb-2">
              <h3 className="text-text-primary mb-2 text-sm font-medium">Test Case Results:</h3>
              {subTestResult.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 mb-2 rounded-md text-xs shadow-sm border-l-4
                              ${result.passed && !result.error ? "bg-green-500/10 border-success" : "bg-red-500/10 border-error"}`}
                >
                  <div className="text-text-primary font-semibold mb-1">
                    Test Case {index + 1}:{" "}
                    <span className={`${result.passed && !result.error ? "text-success" : "text-error"}`}>
                      {result.passed && !result.error
                        ? "Passed"
                        : `Failed ${result.error ? `(${result.error})` : ''}`
                      }
                    </span>
                  </div>
                  {(!result.passed || result.error) && (
                    <div className="mt-1.5 text-text-secondary space-y-1 font-mono text-[11px] leading-relaxed"> {/* Smaller font for details */}
                      <div><span className="text-gray-500">Input:    </span> <pre className="inline bg-background/50 p-1 rounded">{result.input}</pre></div>
                      <div><span className="text-gray-500">Expected: </span> <pre className="inline bg-background/50 p-1 rounded">{result.expected}</pre></div>
                      <div><span className="text-gray-500">Actual:   </span> <pre className="inline bg-background/50 p-1 rounded">{result.actual}</pre></div>
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
