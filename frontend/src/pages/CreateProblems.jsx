

const CreateProblem = ({ userId }) => {
 

  return (
    <main className="max-w-md mx-auto p-2">
      <h1 className="text-2xl font-bold text-center mb-4">
        Create A New Problem
      </h1>
      <form className="flex flex-col space-y-4">
        <input
          id="name"
          type="text"
          placeholder="Problem Name"
          
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />

        <textarea
          id="description"
          placeholder="Problem Description"
          
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />

        <textarea
          id="inputFormat"
          placeholder="Input Format"
          
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />

        <textarea
          id="outputFormat"
          placeholder="Output Format"
         
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />

        <div className="flex gap-4">
          <textarea
            id="constraints"
            placeholder="Constraints"
           
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <textarea
            id="sampleInput"
            placeholder="Sample Input"
           
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <textarea
            id="sampleOutput"
            placeholder="Sample Output"
           
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="flex gap-4">
          <select
            id="difficulty"
            
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
              {["Array", "Strings", "Graphs", "DP"].map((tag) => (
                <label key={tag} className="flex items-center ">
                  <input
                    type="radio"
                    name="tag"
                    
                    className="mr-2"
                  />
                  <label className="text-sm">{tag}</label>
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
    rows={2}
    // onChange={handleChange} (add this when you want to handle the value)
  />
  <p className="text-xs font-semibold text-gray-500 mt-1">
    Enter each test case on a new line, separating input and output with a <b>|</b> (pipe).<br />
    <code>Example: 1 2 3 | 6</code>  
    
  </p>
</div>


        <button
          type="submit"
          className="w-full p-2 bg-custom_btn text-white rounded-lg"
        >Create Problem
        </button>
      </form>
    </main>
  );
};

export default CreateProblem;
