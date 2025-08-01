import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateProblem () {
  const currentUser = useSelector((state) => state.user.user);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    inputFormat: "",
    outputFormat: "",
    constraints: "",
    sampleInput: "",
    sampleOutput: "",
    difficulty: "easy",
    tags: "Array", // Default tag
    testcases: "",
  });
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // --- No changes made to the functionality below ---
  const handleChange = (e) => {
    const { id, value, name } = e.target;
    if (e.target.type === "radio") {
      setFormData({
        ...formData,
        [name]: value,
      });
      return;
    }
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(formData.testcases.trim() === "") {
        alert("Test cases cannot be empty.");
        setError(true);
        return;
      }
      const lines = formData.testcases.split("\n")
      .map(line => line.trim()).filter(line => line.length > 0);
     const invalidTestCases = lines.find(line => {
        const parts = line.split("|");
        return parts.length !== 2 || parts[0].trim() === "" || parts[1].trim() === "";});
        if(invalidTestCases) {
          alert("Invalid test case format. Each line should be 'input | output'.");
          setError(true);}
      setError(false);
      const parsedTestcases = formData.testcases
        .split("\n")
        .map((line) => line.split("|").map((s) => s.trim()))
        .filter((pair) => pair.length === 2 && pair[0] && pair[1])
        .map(([input, output]) => ({ input, output }));
      
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/backend/problems/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
          testcases: parsedTestcases,
        }),
        credentials: 'include',
      });
      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/problems/${data._id}`);
    } catch (error) {
      setError(error.message);
    }
  };

  // --- Themed JSX Starts Here ---
  return (
    // 1. Main Container: Full-page gradient background
    <main className="min-h-screen bg-gradient-to-b from-[#4C1D95] via-[#1E1B4B] to-black text-text-primary py-12 px-4">
      {/* 2. Form Card: "Frosted glass" effect */}
      <div className="max-w-3xl mx-auto bg-black/30 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl border border-purple-500/30">
        
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
          Create a New Problem
        </h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          {/* 3. Inputs & Textareas: Consistently themed */}
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-text-secondary">Problem Name</label>
            <input
              id="name"
              type="text"
              placeholder="e.g., Two Sum Challenge"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3.5 bg-black/20 border border-white/10 text-text-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-text-secondary">Problem Description</label>
            <textarea
              id="description"
              placeholder="Detailed description of the problem..."
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3.5 bg-black/20 border border-white/10 text-text-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 min-h-[120px] transition-all"
              required
              rows={5}
            />
          </div>

          <div>
            <label htmlFor="inputFormat" className="block mb-2 text-sm font-medium text-text-secondary">Input Format</label>
            <textarea
              id="inputFormat"
              placeholder="Describe the input format..."
              value={formData.inputFormat}
              onChange={handleChange}
              className="w-full p-3.5 bg-black/20 border border-white/10 text-text-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 min-h-[80px] transition-all"
              required
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="outputFormat" className="block mb-2 text-sm font-medium text-text-secondary">Output Format</label>
            <textarea
              id="outputFormat"
              placeholder="Describe the output format..."
              value={formData.outputFormat}
              onChange={handleChange}
              className="w-full p-3.5 bg-black/20 border border-white/10 text-text-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 min-h-[80px] transition-all"
              required
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* ... other themed textareas for constraints, sample input/output ... */}
             <div>
              <label htmlFor="constraints" className="block mb-2 text-sm font-medium text-text-secondary">Constraints</label>
              <textarea
                id="constraints"
                placeholder="e.g., 1 <= N <= 10^5"
                value={formData.constraints}
                onChange={handleChange}
                className="w-full p-3.5 bg-black/20 border border-white/10 text-text-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 min-h-[100px] transition-all"
                required
                rows={4}
              />
            </div>
            <div>
              <label htmlFor="sampleInput" className="block mb-2 text-sm font-medium text-text-secondary">Sample Input</label>
              <textarea
                id="sampleInput"
                placeholder="Example input..."
                value={formData.sampleInput}
                onChange={handleChange}
                className="w-full p-3.5 bg-black/20 border border-white/10 text-text-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 min-h-[100px] transition-all"
                required
                rows={4}
              />
            </div>
            <div>
              <label htmlFor="sampleOutput" className="block mb-2 text-sm font-medium text-text-secondary">Sample Output</label>
              <textarea
                id="sampleOutput"
                placeholder="Corresponding sample output..."
                value={formData.sampleOutput}
                onChange={handleChange}
                className="w-full p-3.5 bg-black/20 border border-white/10 text-text-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 min-h-[100px] transition-all"
                required
                rows={4}
              />
            </div>
          </div>
          
          {/* 4. Select & Radio Buttons: Themed */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-4">
            <div>
              <label htmlFor="difficulty" className="block mb-2 text-sm font-medium text-text-secondary">Difficulty</label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full md:w-auto p-3.5 bg-black/20 border border-white/10 text-text-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                required
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="md:mt-0">
              <label className="block mb-2 text-sm font-medium text-text-secondary">Select Tag</label>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {["Array", "Strings", "Graphs", "DP", "Math", "Trees"].map((tagValue) => (
                  <label key={tagValue} className="flex items-center cursor-pointer">
                    <input
                      onChange={handleChange}
                      type="radio"
                      name="tags"
                      value={tagValue}
                      checked={formData.tags === tagValue}
                      className="mr-2 h-4 w-4 text-primary bg-transparent border-gray-500 focus:ring-purple-500/50 focus:ring-offset-black/20"
                    />
                    <span className="text-sm text-text-secondary">{tagValue}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="testcases" className="block mb-2 text-sm font-medium text-text-secondary">Test Cases</label>
            <textarea
              id="testcases"
              className="w-full p-3.5 bg-black/20 border border-white/10 text-text-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 min-h-[100px] font-mono transition-all"
              placeholder={`input1 | output1\n1 2 3 | 6`}
              value={formData.testcases}
              onChange={handleChange}
              rows={4}
              required
            />
            <p className="text-xs text-text-secondary mt-1.5">
              Enter each test case on a new line, separating input and output with a <b>|</b> (pipe).
            </p>
          </div>
          
          {/* 5. Submit Button: Themed primary action button */}
          <button
            type="submit"
            className="w-full p-3 bg-primary text-white rounded-lg font-semibold hover:bg-purple-600 focus:ring-4 focus:outline-none focus:ring-purple-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Create Problem
          </button>
          
          {/* 6. Error Message: Consistent styling */}
          {error && (
            <p className="text-error mt-3 text-center font-medium bg-red-500/10 p-2 rounded-md border border-error/30">
              {typeof error === 'string' ? error : "An error occurred. Please check your input."}
            </p>
          )}
        </form>
      </div>
    </main>
  );
};