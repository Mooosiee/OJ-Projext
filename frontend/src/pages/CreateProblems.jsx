import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const CreateProblem = () => {
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
    <main className="max-w-md mx-auto p-2">
      <h1 className="text-2xl font-bold text-center mb-4">
        Create A New Problem
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          id="name"
          type="text"
          placeholder="Problem Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />

        <textarea
          id="description"
          placeholder="Problem Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />

        <textarea
          id="inputFormat"
          placeholder="Input Format"
          value={formData.inputFormat}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />

        <textarea
          id="outputFormat"
          placeholder="Output Format"
          value={formData.outputFormat}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />

        <div className="flex gap-4">
          <textarea
            id="constraints"
            placeholder="Constraints"
            value={formData.constraints}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <textarea
            id="sampleInput"
            placeholder="Sample Input"
            value={formData.sampleInput}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <textarea
            id="sampleOutput"
            placeholder="Sample Output"
            value={formData.sampleOutput}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="flex gap-4">
          <select
            id="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <div className="">
            <label className="text-m font-semibold">Select Tag</label>
            <div className="flex gap-4">
              {["Array", "Strings", "Graphs", "DP"].map((tags) => (
                <label key={tags} className="flex items-center ">
                  <input
                    onChange={handleChange}
                    type="radio"
                    name="tags"
                    value={tags}
                    checked={formData.tags === tags}
                    className="mr-2"
                  />
                  <label className="text-sm">{tags}</label>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className="text-m font-semibold mb-2 block">Test Cases</label>
          <textarea
            id="testcases"
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder={`Paste your test cases here, e.g.:\ninput1 | output1`}
            value={formData.testcases}
            onChange={handleChange}
            rows={2}
          />
          <p className="text-xs font-semibold text-gray-500 mt-1">
            Enter each test case on a new line, separating input and output with
            a <b>|</b> (pipe).
            <br />
            <code>Example: 1 2 3 | 6</code>
          </p>
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-custom_btn text-white rounded-lg"
        >
          Create Problem
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </main>
  );
};

export default CreateProblem;
