import { useEffect, useState } from "react";
const ProblemsPage = () => {
  const [problems, setProblems] = useState([]); // This would be fetched from an API
  const [search, setSearch] = useState(""); // This would be used to filter problems by search term
  const [order, setOrder] = useState("asc"); // none,asc,desc
  //  This would be used to sort problems by difficulty or other criteria
  const [selectedTag, setSelectedTag] = useState("ALL"); // This would be used to filter problems by tag
  const [error, setError] = useState(false); // This would be used to handle errors
  const [loading, setLoading] = useState(true); // This would be used to handle loading state
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setError(false); // Reset error state before fetching
        const res = await fetch("/backend/problems/all", {
          method: "GET", //this does not need to be set, but it's good practice to specify it
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // This is required for cookies to be sent!
        });
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
        }
        setProblems(data); // data should be an array of problems
        // Assuming data is an array of problem objects
        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        setError(true);
        setLoading(false); // Set loading to false even if there's an error
      }
    };
    fetchProblems();
  }, []);
  const tags = ["ALL", ...new Set(problems.map((p) => p.tags))]; // how does this look : ["ALL", "Arrays", "Binary Search",...etc]
  //    Extracts all unique tags from problems
  //    Converts them to an array
  //    Prepends "ALL" so the user can select "All tags" as an option

  //FILTER BY TAG AND SEARCH TERM
  let filtered = problems.filter(
    (p) =>
      (selectedTag === "ALL" || p.tags === selectedTag) &&
      p.name.toLowerCase().includes(search.toLowerCase())
    //if No Tag selected then
    // The first condition (selectedTag === "All") is true,
    // so all problems are allowed through the tag filter.
    // Only the search query matters.
    //If nothing is Searched then
    //p.name.toLowerCase().includes("") → true (empty string is always included).
    //Only the tag filter matters.
  );
  const difficulties = [...new Set(problems.map((p) => p.difficulty))];
   // Create difficulty order map for sorting (e.g. {easy:0, medium:1, hard:2})
  const DIFFICULTY_ORDER = difficulties.reduce((acc, diff, idx) => {
    acc[diff] = idx;
    return acc;
  }, {});
   // Sort filtered problems by difficulty according to order state
  filtered.sort((a, b) => {
    if (order === "asc") {
      return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];
    } else {
      return DIFFICULTY_ORDER[b.difficulty] - DIFFICULTY_ORDER[a.difficulty];
    }
  });
  if (loading)
    return (
      <div className="p-4 text-3xl font-bold text-center">
        Loading Problems...
      </div>
    );
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Problems</h1>
      <div >
        <div className="flex gap-1">
            {tags.map(
              (
                tag //This is where you would map through your tags array and display them
              ) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-1 rounded-full font-semibold ${
                    selectedTag === tag
                      ? "bg-yellow-400 text-black"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  {tag}
                </button>
              )
            )}
        </div>
        <div className="flex gap-4 mt-4 mb-6">
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-600 rounded px-3 py-2 flex-grow bg-gray-900 text-white placeholder-gray-400"
          />
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="border border-gray-600 rounded px-3 py-2 bg-gray-900 text-white"
          >
            <option value="asc">E → H</option>
            <option value="desc">H → E</option>
          </select>
        </div>
        <table className="min-w-full border border-gray-700 bg-gray-900 text-white rounded-lg">
          <thead>
            <tr>
              <th className="border border-gray-700 px-3 py-2 text-left">#</th>
              <th className="border border-gray-700 px-3 py-2 text-left">
                Title
              </th>
              <th className="border border-gray-700 px-3 py-2 text-left">
                Difficulty
              </th>
              <th className="border border-gray-700 px-3 py-2 text-left">
                Tag
              </th>
            </tr>
          </thead>
          <tbody>
            {" "}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">
                  No problems found.
                </td>
              </tr>
            ) : (
              filtered.map((problem, idx) => (
                <tr
                  key={problem._id}
                  className="hover:bg-gray-800 cursor-pointer"
                >
                  <td className="border border-gray-700 px-3 py-2">
                    {idx + 1}
                  </td>
                  <td className="border border-gray-700 px-3 py-2">
                    <a //USE LINK TO NAVIGATE
                      href={`/problems/${problem._id}`}
                      className="text-blue-400 hover:underline"
                    >
                      {problem.name}
                    </a>
                  </td>

                  <td className="border border-gray-700 px-3 py-2 capitalize">
                    {problem.difficulty}
                  </td>
                  <td className="border border-gray-700 px-3 py-2">
                    {problem.tags}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemsPage;
