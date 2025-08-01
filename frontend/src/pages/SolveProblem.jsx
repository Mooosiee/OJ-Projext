import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Preloader from "../components/Preloader";
import ReactMarkdown from 'react-markdown';
import { GradientBackground } from '../components/GradientBackground'; // Assuming you have this component

// Placeholder Icons for Verdicts
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);


export default function SolveProblem() {
  const currentUser = useSelector((state) => state.user.user);
  const { id } = useParams();
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [isLoading, setIsLoading] = useState(true);
  const [subVerdict, setSubVerdict] = useState("");
  const [subTestResult, setsubTestResult] = useState([]);
  const [error, setError] = useState("");
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const [isLoadingSub, setisLoadingSub] = useState(false);
  const [Submitted, setSubmitted] = useState(false);
  const [isLoadingAIReview, setisLoadingAIReview] = useState(false);
  const [AIReview, setAIReview] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isLoadingCustomRun, setisLoadingCustomRun] = useState(false);

  useEffect(() => {
    const templates = {
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code goes here\n    return 0;\n}`,
      py: `# Your Python code goes here\nprint("Hello from Python!")`,
      java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}`,
    };
    setCode(templates[selectedLanguage]);
  }, [selectedLanguage]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/backend/problems/${id}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setProblem(data);
      } catch (error) {
        setProblem({ error: "Failed to load problem" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

    const handleSubmit = async () => {
    if (!currentUser) return alert("Login to submit code!");
    setisLoadingSub(true);
    setSubVerdict("");
    setsubTestResult([]);
    setCustomOutput("");
    setError("");
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/backend/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: selectedLanguage, problemId: id, code }),
        credentials: "include",
      });
      const data = await res.json();
      setSubVerdict(data.finalVerdict || "Verdict not available");
      if (data.testResults) setsubTestResult(data.testResults);
      setSubmitted(true);
    } catch (error) {
      setError("Error running code");
      setSubVerdict("Error");
    } finally {
      setisLoadingSub(false);
    }
  };

  const handleRun = async () => {
    if (!currentUser) return alert("Login to run code!");
    if (!input) return alert("Provide input to run code!");
    setCustomOutput("");
    setisLoadingCustomRun(true);
    setError("");
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/backend/custom-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: selectedLanguage, code, input }),
        credentials: "include",
      });
      const data = await res.json();
      setCustomOutput(data.output);
    } catch (error) {
      setError("Error running code");
    } finally {
      setisLoadingCustomRun(false);
    }
  };

  const handleReview = async () => {
    setisLoadingAIReview(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/backend/ai-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const reviewData = await res.json();
      setAIReview(reviewData.review || "No Review Received");
      setShowReviewModal(true);
    } catch (error) {
      setError("Error reviewing code");
    } finally {
      setisLoadingAIReview(false);
    }
  };

  if (isLoading) return <Preloader />;
  if (problem?.error) return <div className="bg-background min-h-screen flex items-center justify-center text-error text-xl p-6">Error: {problem.error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-ii/90 via-black to-black text-text-primary pt-16">
        <div className="flex flex-col lg:flex-row gap-4 px-4 sm:px-6 lg:px-8">
            {/* Left - Description */}
            <div className="lg:w-1/2 bg-black/30 backdrop-blur-xl p-6 rounded-xl shadow-lg">
                <h1 className="font-playwrite text-2xl sm:text-3xl font-bold text-purple-400 mb-4">{problem.name}</h1>
                <p className="whitespace-pre-wrap text-text-secondary leading-relaxed mb-4">{problem.description}</p>
                <p className="italic text-sm text-text-secondary mb-6">Author: {problem.userRef?.username || "Unknown Author"}</p>

                {["inputFormat", "outputFormat", "constraints"].map((field) => (
                    <div key={field} className="mt-4 bg-white/5 p-4 rounded-lg">
                        <h3 className="font-semibold text-white mb-2 capitalize">{field.replace("Format", " Format")}</h3>
                        <pre className="whitespace-pre-wrap text-sm text-text-secondary font-mono">{problem[field]}</pre>
                    </div>
                ))}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {["sampleInput", "sampleOutput"].map((field) => (
                        <div key={field} className="bg-white/5 p-4 rounded-lg">
                            <h3 className="font-semibold text-white mb-2 capitalize">{field.replace("sample", "Sample ")}</h3>
                            <pre className="whitespace-pre-wrap text-sm text-text-secondary font-mono">{problem[field]}</pre>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right - Code + Run + Output */}
            <div className="lg:w-1/2 flex flex-col gap-4">
                <div className="bg-black/30 backdrop-blur-xl p-4 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <select 
                            value={selectedLanguage} 
                            onChange={(e) => setSelectedLanguage(e.target.value)} 
                            className="bg-black/50 text-white font-semibold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="cpp">C++</option>
                            <option value="py">Python</option>
                            <option value="java">Java</option>
                        </select>
                        <div className="flex gap-2">
                            <button 
                                onClick={handleRun} 
                                disabled={isLoadingSub || isLoadingCustomRun} 
                                className="bg-white/10 text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-500/50 transition-colors disabled:opacity-50"
                            >
                                {isLoadingCustomRun ? "Running..." : "Run"}
                            </button>
                            <button 
                                onClick={handleSubmit} 
                                disabled={isLoadingSub || isLoadingCustomRun} 
                                className="bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-50"
                            >
                                {isLoadingSub ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                    <Editor
                        height="40vh"
                        language={selectedLanguage}
                        value={code}
                        onChange={(v) => setCode(v || "")}
                        theme="vs-dark"
                        options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: "on", scrollBeyondLastLine: false, background: "#00000000" }}
                    />
                </div>
                
                <div className="bg-black/30 backdrop-blur-xl p-4 rounded-xl shadow-lg flex-grow">
                     <label className="block text-sm font-semibold text-text-secondary mb-2">Custom Input:</label>
                    <textarea 
                        rows={3} 
                        className="w-full bg-white/5 text-white p-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                    />

                    {subVerdict && (
                        <div className={`mt-4 p-3 text-center text-white font-bold rounded-lg ${subVerdict === "Accepted" ? "bg-green-500/80" : "bg-red-500/80"}`}>
                           {subVerdict === "Accepted" ? <CheckCircleIcon/> : <XCircleIcon/>} Verdict: {subVerdict}
                        </div>
                    )}

                    {error && !subVerdict.toLowerCase().includes("error") && (
                        <div className="bg-red-500/20 text-red-300 p-3 mt-4 rounded-lg border border-red-500/50 text-sm">
                            <strong>Error:</strong> {error}
                        </div>
                    )}
                    
                    {customOutput && (
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-text-secondary mb-2">Output (Custom Input):</h3>
                            <pre className="bg-white/5 text-green-400 border border-transparent p-3 rounded-lg whitespace-pre-wrap font-mono">{customOutput}</pre>
                        </div>
                    )}

                    {subTestResult.length > 0 && (
                        <div className="mt-4 space-y-2">
                             {subTestResult.map((res, i) => (
                                <div key={i} className={`p-3 rounded-lg border-l-4 ${res.passed && !res.error ? "bg-green-500/10 border-green-500" : "bg-red-500/10 border-red-500"}`}>
                                    <div className="text-sm font-semibold flex justify-between">
                                        <span>Test Case {i + 1}</span>
                                        <span className={res.passed && !res.error ? "text-green-400" : "text-red-400"}>
                                            {res.passed ? "Passed" : "Failed"}
                                        </span>
                                    </div>
                                    {(!res.passed || res.error) && (
                                      <div className="text-xs text-text-secondary mt-2 space-y-1 font-mono">
                                          <div><span className="text-gray-400">Input: </span> <pre className="inline bg-black/20 p-1 rounded">{res.input}</pre></div>
                                          <div><span className="text-gray-400">Expected: </span> <pre className="inline bg-black/20 p-1 rounded">{res.expected}</pre></div>
                                          <div><span className="text-gray-400">Actual: </span> <pre className="inline bg-black/20 p-1 rounded">{res.actual}</pre></div>
                                      </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {Submitted && (
                      <div className="mt-4 text-center">
                        <button onClick={handleReview} className="bg-white/10 text-purple-300 font-semibold px-6 py-2 rounded-lg hover:bg-purple-500/50 hover:text-white transition-colors">
                          {isLoadingAIReview ? "Reviewing..." : "Get AI Review"}
                        </button>
                      </div>
                    )}
                </div>
            </div>
        </div>

        {showReviewModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 p-6 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                    <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 text-3xl font-bold text-white/50 hover:text-white transition-colors">×</button>
                    <h2 className="text-xl font-bold text-purple-400 mb-4">AI Code Review</h2>
                    <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
                       <ReactMarkdown>{AIReview}</ReactMarkdown>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}