// EditProblem.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProblem() {
  const currentUser = useSelector((state) => state.user.user);
  const { problemId } = useParams();
  const [error, setError] = useState(null); // Initialize with null for better conditional rendering
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // For loading indicator during fetch

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    inputFormat: "",
    outputFormat: "",
    constraints: "",
    sampleInput: "",
    sampleOutput: "",
    difficulty: "easy", // Sensible default
    tags: "Array",      // Sensible default that matches one of your radio values
    testcases: "",
  });

  // Log formData whenever it changes, for debugging
  useEffect(() => {
    console.log("formData changed:", formData);
  }, [formData]);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId) {
        setError("Problem ID not found in URL.");
        setIsLoading(false);
        return;
      }
      console.log(`[EditProblem useEffect] Fetching problem with ID: ${problemId}`);
      setIsLoading(true); // Start loading before fetch
      setError(null); // Clear previous errors
      try {
        const res = await fetch(`/backend/problems/${problemId}`);
        const data = await res.json(); // This is the problem object from backend

        console.log("[EditProblem useEffect] Data received from backend:", data);

        if (!res.ok || data.success === false) {
          setError(data.message || `Failed to fetch problem data (Status: ${res.status})`);
          setIsLoading(false);
          return;
        }

        const formattedTestcases = data.testcases
          ? data.testcases.map((tc) => `${tc.input.trim()} | ${tc.output.trim()}`).join("\n")
          : "";

        // Ensure 'tags' from data is a string, provide a default if not.
        const tagFromData = (typeof data.tags === 'string' && data.tags.trim() !== '')
                            ? data.tags
                            : "Array"; // Default if backend tag is missing, empty, or not a string

        console.log("[EditProblem useEffect] Tag to be set from data:", tagFromData);

        setFormData({
          name: data.name || "",
          description: data.description || "",
          inputFormat: data.inputFormat || "",
          outputFormat: data.outputFormat || "",
          constraints: data.constraints || "",
          sampleInput: data.sampleInput || "",
          sampleOutput: data.sampleOutput || "",
          difficulty: data.difficulty || "easy",
          tags: tagFromData, // Explicitly set tags
          testcases: formattedTestcases,
          // Avoid spreading ...data directly if you want more control over defaults or transformations
        });
        
      } catch (err) {
        console.error("[EditProblem useEffect] Fetch error:", err);
        setError(err.message || "An error occurred while fetching problem data.");
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchProblem();
  }, [problemId]); // Dependency array ensures this runs when problemId changes

  const handleChange = (e) => {
    const { id, value, name, type } = e.target;
    if (type === "radio" && name === "tags") { // Be specific for tags radio
      setFormData(prevData => ({
        ...prevData,
        tags: value,
      }));
    } else if (id) { // For other inputs with an id
      setFormData(prevData => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Use isLoading for submit button as well
    setError(null);
    try {
      // ... (your existing test case validation logic - ensure setError is used for messages)
      if (formData.testcases.trim() === "") {
        alert("Test cases cannot be empty.");
        setError("Test cases cannot be empty."); // Set error state
        setIsLoading(false);
        return;
      }
      const lines = formData.testcases
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      const invalidTestCases = lines.find((line) => {
        const parts = line.split("|");
        return (
          parts.length !== 2 || parts[0].trim() === "" || parts[1].trim() === ""
        );
      });
      if (invalidTestCases) {
        const msg = "Invalid test case format. Each line should be 'input | output'.";
        alert(msg);
        setError(msg);
        setIsLoading(false);
        return;
      }
      // setError(false); // This was setError(false), should be setError(null) to clear
      setError(null);


      const parsedTestcases = formData.testcases
        .split("\n")
        .map((line) => line.split("|").map((s) => s.trim()))
        .filter((pair) => pair.length === 2 && pair[0] && pair[1])
        .map(([input, output]) => ({ input, output }));

      // Prepare payload, ensuring tags is an array if backend expects it
      const payload = {
        ...formData,
        tags: [formData.tags], // Assuming backend Problem schema has tags: [String]
        testcases: parsedTestcases,
        // userRef: currentUser._id, // userRef should NOT be updated by admin here.
                                   // Backend should handle permissions and not change original author.
      };
      // If userRef is part of formData due to spread, remove it before sending for update
      delete payload.userRef;
      delete payload._id; // Don't send _id in body for update
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;


      const res = await fetch(`/backend/problems/update/${problemId}`, { // Corrected endpoint
        method: "PUT", // Use PUT for updates
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const data = await res.json();

      if (data.success === false) {
        setError(data.message || "Failed to update problem.");
        setIsLoading(false);
        return;
      }
      // navigate(`/problems/${data._id}`); // data._id might not be returned on update, use problemId
      alert("Problem updated successfully!"); // Or use a success message state
      navigate(`/problem/${problemId}`); // Navigate to the problem view page
    } catch (error) {
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // console.log("formData.tags before return:", formData.tags); // This log is fine for checking render value

  if (isLoading && !formData.name) { // Show loading if fetching and name isn't populated yet
    return <div className="bg-background min-h-screen flex items-center justify-center text-text-primary text-xl">Loading problem...</div>;
  }
  
  // If there was an error during fetch and we don't have a problem name yet
  if (error && !formData.name && !isLoading) {
      return <div className="bg-background min-h-screen flex items-center justify-center text-error text-xl">Error: {error}</div>;
  }


  return (
    <main className="bg-background min-h-screen text-text-primary py-8 px-4">
      <div className="max-w-2xl mx-auto bg-surface p-6 md:p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">
          Update Problem
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium text-text-secondary">Problem Name</label>
            <input id="name" type="text" placeholder="e.g., Two Sum Challenge" value={formData.name} onChange={handleChange}
                   className="w-full p-3 bg-background border border-border text-text-primary rounded-lg text-sm focus:ring-primary focus:border-primary placeholder-text-secondary" required />
          </div>
          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-1 text-sm font-medium text-text-secondary">Problem Description</label>
            <textarea id="description" placeholder="Detailed description of the problem..." value={formData.description} onChange={handleChange}
                      className="w-full p-3 bg-background border border-border text-text-primary rounded-lg text-sm focus:ring-primary focus:border-primary placeholder-text-secondary min-h-[120px]" required rows={5} />
          </div>
          {/* Input Format */}
          <div>
            <label htmlFor="inputFormat" className="block mb-1 text-sm font-medium text-text-secondary">Input Format</label>
            <textarea id="inputFormat" placeholder="Describe the input format..." value={formData.inputFormat} onChange={handleChange}
                      className="w-full p-3 bg-background border border-border text-text-primary rounded-lg text-sm focus:ring-primary focus:border-primary placeholder-text-secondary min-h-[80px]" required rows={3} />
          </div>
          {/* Output Format */}
          <div>
            <label htmlFor="outputFormat" className="block mb-1 text-sm font-medium text-text-secondary">Output Format</label>
            <textarea id="outputFormat" placeholder="Describe the output format..." value={formData.outputFormat} onChange={handleChange}
                      className="w-full p-3 bg-background border border-border text-text-primary rounded-lg text-sm focus:ring-primary focus:border-primary placeholder-text-secondary min-h-[80px]" required rows={3} />
          </div>
          {/* Constraints, Sample Input, Sample Output Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="constraints" className="block mb-1 text-sm font-medium text-text-secondary">Constraints</label>
              <textarea id="constraints" placeholder="e.g., 1 <= N <= 10^5" value={formData.constraints} onChange={handleChange}
                        className="w-full p-3 bg-background border border-border text-text-primary rounded-lg text-sm focus:ring-primary focus:border-primary placeholder-text-secondary min-h-[100px]" required rows={4} />
            </div>
            <div>
              <label htmlFor="sampleInput" className="block mb-1 text-sm font-medium text-text-secondary">Sample Input</label>
              <textarea id="sampleInput" placeholder="Example input..." value={formData.sampleInput} onChange={handleChange}
                        className="w-full p-3 bg-background border border-border text-text-primary rounded-lg text-sm focus:ring-primary focus:border-primary placeholder-text-secondary min-h-[100px]" required rows={4} />
            </div>
            <div>
              <label htmlFor="sampleOutput" className="block mb-1 text-sm font-medium text-text-secondary">Sample Output</label>
              <textarea id="sampleOutput" placeholder="Corresponding sample output..." value={formData.sampleOutput} onChange={handleChange}
                        className="w-full p-3 bg-background border border-border text-text-primary rounded-lg text-sm focus:ring-primary focus:border-primary placeholder-text-secondary min-h-[100px]" required rows={4} />
            </div>
          </div>
          {/* Difficulty and Tags */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-4">
            <div>
              <label htmlFor="difficulty" className="block mb-1 text-sm font-medium text-text-secondary">Difficulty</label>
              <select id="difficulty" value={formData.difficulty} onChange={handleChange}
                      className="w-full md:w-auto p-3 bg-background border border-border text-text-primary rounded-lg text-sm focus:ring-primary focus:border-primary" required>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="mt-4 md:mt-0">
              <label className="block mb-2 text-sm font-medium text-text-secondary">Select Tag</label>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {["Array", "Strings", "Graph", "DP", "Math", "Trees"].map((tagValue) => (
                  <label key={tagValue} className="flex items-center cursor-pointer">
                    <input onChange={handleChange} type="radio" name="tags" value={tagValue} checked={tagValue === formData.tags}
                           className="mr-2 h-4 w-4 text-primary bg-gray-700 border-border focus:ring-primary focus:ring-offset-surface" />
                    <span className="text-sm text-text-secondary">{tagValue}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* Test Cases */}
          <div>
            <label htmlFor="testcases" className="block mb-1 text-sm font-medium text-text-secondary">Test Cases</label>
            <textarea id="testcases" className="w-full p-3 bg-background border border-border text-text-primary rounded-lg text-sm focus:ring-primary focus:border-primary placeholder-text-secondary min-h-[100px]"
                      placeholder={`Paste your test cases here, e.g.:\ninput1 | output1\n1 2 3 | 6`}
                      value={formData.testcases} onChange={handleChange} rows={4} required />
            <p className="text-xs text-text-secondary mt-1.5">
              Enter each test case on a new line, separating input and output with a <b>|</b> (pipe).<br />
              Example: <code>1 2 3 | 6</code>
            </p>
          </div>
          <button type="submit" disabled={isLoading} // Use isLoading for submit button
                  className="w-full p-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 transition duration-300 disabled:opacity-70">
            {isLoading ? "Updating..." : "Update Problem"}
          </button>
          {error && (
            <p className="text-error mt-3 text-center font-medium bg-red-500/10 p-2 rounded-md border border-error/30">
              {typeof error === "string" ? error : "An error occurred. Please check your input."}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}