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
      //Find Invalid test cases
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

      const res = await fetch(`/backend/problems/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
          testcases: parsedTestcases,
        }),
        credentials: 'include', // <-- This is required for cookies to be sent!
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


return (
  <main className="bg-background min-h-screen text-text-primary py-8 px-4">
    <div className="max-w-2xl mx-auto bg-surface p-6 md:p-8 rounded-xl shadow-2xl">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">
        Create A New Problem
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6"> {/* Increased space-y */}
        <div>
          <label htmlFor="name" className="block mb-1 text-sm font-medium text-text-secondary">Problem Name</label>
          <input
            id="name"
            type="text"
            placeholder="e.g., Two Sum Challenge"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 bg-background border border-border text-text-primary rounded-lg text-sm focus:ring-primary focus:border-primary placeholder-text-secondary"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 text-sm font-medium text-text-secondary">Problem Description</label>
          <textarea
            id="description"
            placeholder="Detailed description of the problem..."
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 bg-background border border-border text-text-primary rounded-lg text-sm focus:ring-primary focus:border-primary placeholder-text-secondary min-h-[120px]" // Added min-h
            required
            rows={5} // Suggestion: use rows for textarea initial height
          />
        </div>

        <div>
          <label htmlFor="inputFormat" className="block mb-1 text-sm font-medium text-text-secondary">Input Format</label>
          <textarea
            id="inputFormat"
            placeholder="Describe the input format..."
            value={formData.inputFormat}
            onChange={handleChange}
            className="w-full p-3 bg-background border border-border text-text-primary rounded-lg text-sm focus:ring-primary focus:border-primary placeholder-text-secondary min-h-[80px]"
            required
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="outputFormat" className="block mb-1 text-sm font-medium text-text-secondary">Output Format</label>
          <textarea
            id="outputFormat"
            placeholder="Describe the output format..."
            value={formData.outputFormat}
            onChange={handleChange}
            className="w-full p-3 bg-background border border-border text-text-primary rounded-lg text-sm focus:ring-primary focus:border-primary placeholder-text-secondary min-h-[80px]"
            required
            rows={3}
          />
        </div>

        {/* Constraints, Sample Input, Sample Output in a grid for better layout on wider screens */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="constraints" className="block mb-1 text-sm font-medium text-text-secondary">Constraints</label>
            <textarea
              id="constraints"
              placeholder="e.g., 1 <= N <= 10^5"
              value={formData.constraints}
              onChange={handleChange}
              className="w-full p-3 bg-background border border-border text-text-primary rounded-lg text-sm focus:ring-primary focus:border-primary placeholder-text-secondary min-h-[100px]"
              required
              rows={4}
            />
          </div>
          <div>
            <label htmlFor="sampleInput" className="block mb-1 text-sm font-medium text-text-secondary">Sample Input</label>
            <textarea
              id="sampleInput"
              placeholder="Example input..."
              value={formData.sampleInput}
              onChange={handleChange}
              className="w-full p-3 bg-background border border-border text-text-primary rounded-lg text-sm focus:ring-primary focus:border-primary placeholder-text-secondary min-h-[100px]"
              required
              rows={4}
            />
          </div>
          <div>
            <label htmlFor="sampleOutput" className="block mb-1 text-sm font-medium text-text-secondary">Sample Output</label>
            <textarea
              id="sampleOutput"
              placeholder="Corresponding sample output..."
              value={formData.sampleOutput}
              onChange={handleChange}
              className="w-full p-3 bg-background border border-border text-text-primary rounded-lg text-sm focus:ring-primary focus:border-primary placeholder-text-secondary min-h-[100px]"
              required
              rows={4}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-4"> {/* Responsive layout for difficulty and tags */}
          <div>
            <label htmlFor="difficulty" className="block mb-1 text-sm font-medium text-text-secondary">Difficulty</label>
            <select
              id="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full md:w-auto p-3 bg-background border border-border text-text-primary rounded-lg text-sm focus:ring-primary focus:border-primary"
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="mt-4 md:mt-0"> {/* Adjust margin for smaller screens */}
            <label className="block mb-2 text-sm font-medium text-text-secondary">Select Tag</label>
            <div className="flex flex-wrap gap-x-6 gap-y-2"> {/* Allow tags to wrap and have consistent gap */}
              {["Array", "Strings", "Graphs", "DP", "Math", "Trees"].map((tagValue) => ( // Added more example tags
                <label key={tagValue} className="flex items-center cursor-pointer">
                  <input
                    onChange={handleChange}
                    type="radio"
                    name="tags" // Name must be the same for radio group
                    value={tagValue}
                    checked={formData.tags === tagValue}
                    className="mr-2 h-4 w-4 text-primary bg-gray-700 border-border focus:ring-primary focus:ring-offset-surface" // Themed radio button
                  />
                  <span className="text-sm text-text-secondary">{tagValue}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="testcases" className="block mb-1 text-sm font-medium text-text-secondary">Test Cases</label>
          <textarea
            id="testcases"
            className="w-full p-3 bg-background border border-border text-text-primary rounded-lg text-sm focus:ring-primary focus:border-primary placeholder-text-secondary min-h-[100px]"
            placeholder={`Paste your test cases here, e.g.:\ninput1 | output1\n1 2 3 | 6`}
            value={formData.testcases}
            onChange={handleChange}
            rows={4} // Increased rows
            required // Added required if testcases are mandatory
          />
          <p className="text-xs text-text-secondary mt-1.5"> {/* Adjusted margin and text color */}
            Enter each test case on a new line, separating input and output with a <b>|</b> (pipe).
            <br />
            Example: <code>1 2 3 | 6</code>
          </p>
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 transition duration-300"
        >
          Create Problem
        </button>
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

