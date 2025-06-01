import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

export default function SolveProblem() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleRun = async () => {
    setIsLoading(true);
    setOutput("");
    setTestResults([]);

    try {
      const res = await fetch("/backend/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: id,
          code,
          input,
        }),
      });

      const data = await res.json();
      setOutput(data.output || "No output");
      if (data.testResults) {
        setTestResults(data.testResults);
      }
    } catch (error) {
      setOutput(error.response?.data?.error || "Error running code");
    } finally {
      setIsLoading(false);
    }
  };

  if (!problem) return <div>Loading problem...</div>;
  if (problem?.error) return <div>Error: {problem.error}</div>;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left Side - Problem Description */}
      <div
      
        style={{
          flex: 1,
          padding: "24px",
          overflowY: "auto",
          borderRight: "1px solid #eee",
        }}
      >
        <h1 className="text-2xl font-semibold">{problem.name}</h1>
        <p className="mt-2 whitespace-pre-wrap">{problem.description}</p>
        <div
          className="flex flex-col mt-8 mb-4 "
        >
          <div className="border border-l-border px-1">
            <h3 className="font-medium">Input Format</h3>
            <pre className="italic whitespace-pre-wrap" >{problem.inputFormat}</pre>
          </div>
          <div className="mt-3 border border-l-border px-1">
            <h3 className="font-medium">Output Format</h3>
            <pre className="italic whitespace-pre-wrap">{problem.outputFormat}</pre>
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
      <div
        style={{
          flex: 1,
          display: "flex", 
          maxWidth : "50%",
          flexDirection: "column",
          background: "#1e1e1e",
          padding: "24px",
        }}
      >
        <Editor
          height="40vh"
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

        <div style={{ margin: "16px 0" }}>
          <textarea
            rows={4}
            style={{
              width: "100%",
              background: "#222",
              color: "#fff",
              border: "1px solid #444",
              padding: 8,
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter custom input here..."
          />
        </div>

        <button
          onClick={handleRun}
          disabled={isLoading}
          style={{
            background: isLoading ? "#666" : "#007acc",
            color: "#fff",
            padding: "8px 16px",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            marginBottom: "16px",
          }}
        >
          {isLoading ? "Running..." : "Run Code"}
        </button>

        <div style={{ marginTop: "auto" }}>
          <h3 style={{ color: "#fff", marginBottom: "8px" }}>Output:</h3>
          <pre
            style={{
              background: "#222",
              color: "#0f0",
              padding: "12px",
              minHeight: "60px",
              whiteSpace: "pre-wrap",
              marginBottom: "16px",
            }}
          >
            {output}
          </pre>

          {testResults.length > 0 && (
            <div>
              <h3 style={{ color: "#fff", marginBottom: "8px" }}>
                Test Results:
              </h3>
              {testResults.map((result, index) => (
                <div
                  key={index}
                  style={{
                    background: result.passed ? "#1a4314" : "#4a0f0f",
                    padding: "12px",
                    marginBottom: "8px",
                    borderRadius: "4px",
                  }}
                >
                  <div style={{ color: "#fff" }}>
                    Test Case {index + 1}:{" "}
                    {result.passed ? "✓ Passed" : "✗ Failed"}
                  </div>
                  {!result.passed && (
                    <div style={{ marginTop: "8px" }}>
                      <div style={{ color: "#ccc" }}>Input:</div>
                      <pre style={{ color: "#fff" }}>{result.input}</pre>
                      <div style={{ color: "#ccc" }}>Expected:</div>
                      <pre style={{ color: "#fff" }}>{result.expected}</pre>
                      <div style={{ color: "#ccc" }}>Actual:</div>
                      <pre style={{ color: "#fff" }}>{result.actual}</pre>
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
