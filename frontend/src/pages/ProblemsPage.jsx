import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        const res = await fetch("https://og-oj-backend.onrender.com/backend/problems/all", {
          method: "GET", //this does not need to be set, but it's good practice to specify it
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // This is required for cookies to be sent!
        });
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
            setLoading(false);
         return;
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
  const tags = ["ALL", ...new Set(problems.map((p) => p.tags))]; // how this looks : ["ALL", "Arrays", "Binary Search",...etc]
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
      <div className="bg-background min-h-screen flex items-center justify-center text-text-primary text-xl">
        Loading Problems...
      </div>
    );
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="bg-background min-h-screen text-text-primary py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {" "}
        {/* Container for content */}
        <h1 className="text-4xl font-bold mb-8 text-primary text-center md:text-left">
          Problem Set
        </h1>
        {/* Tags Filter Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-text-secondary mb-3">
            Filter by Tag:
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ease-in-out
                ${
                  selectedTag === tag
                    ? "bg-primary text-white shadow-md" // Active tag
                    : "bg-surface text-text-secondary hover:bg-border hover:text-text-primary" // Inactive tag
                }`}
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}{" "}
                {/* Capitalize tag */}
              </button>
            ))}
          </div>
        </div>
        {/* Search and Sort Section */}
        <div className="flex flex-col md:flex-row gap-4 mt-4 mb-8 p-4 bg-surface rounded-lg shadow">
          <input
            type="text"
            placeholder="Search problems ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow bg-background border border-border text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3 placeholder-text-secondary"
          />
          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-order"
              className="text-sm font-medium text-text-secondary whitespace-nowrap"
            >
              Sort by Difficulty:
            </label>
            <select
              id="sort-order"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="bg-background border border-border text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block w-full md:w-auto p-3"
            >
              <option value="asc">Easy → Hard</option>
              <option value="desc">Hard → Easy</option>
            </select>
          </div>
        </div>
        {/* Problems Table */}
        <div className="overflow-x-auto bg-surface shadow-xl rounded-lg">
          <table className="min-w-full text-sm text-left text-text-secondary">
            <thead className="text-xs text-text-primary uppercase bg-background border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-3 w-16">
                  #
                </th>
                <th scope="col" className="px-6 py-3">
                  Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Difficulty
                </th>
                <th scope="col" className="px-6 py-3">
                  Tags
                </th>
                {/* Optional: Add a column for "Status" (Solved, Attempted) or "Acceptance Rate" */}
                {/* <th scope="col" className="px-6 py-3">Status</th> */}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-10 text-text-secondary italic"
                  >
                    No problems found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((problem, idx) => (
                  <tr
                    key={problem.id}
                    className="bg-surface border-b border-border hover:bg-background/50 transition-colors duration-150"
                    // onClick={() => navigate(`/problem/${problem._id}`)} // Make whole row clickable
                    // style={{ cursor: 'pointer' }}
                  >
                    <td className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                      {/* This index depends on pagination if you add it. For now, it's based on filtered list. */}
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-text-primary hover:text-primary">
                      <Link // Use Link component for navigation
                        to={`/problems/${problem.id}`} 
                        className="hover:underline"
                      >
                        {problem.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold
                      ${
                        problem.difficulty === "easy"
                          ? "bg-success/20 text-success"
                          : problem.difficulty === "medium"
                          ? "bg-warning/20 text-warning"
                          : problem.difficulty === "hard"
                          ? "bg-error/20 text-error"
                          : "bg-border text-text-secondary"
                      }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-border text-text-secondary text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {problem.tags}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4">
                    <span className="text-success">Solved</span> // Example Status : will add later
                  </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Optional: Add Pagination controls here if you have many problems */}
      </div>
    </div>
  );
};

export default ProblemsPage;
