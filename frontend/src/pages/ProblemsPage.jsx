import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Preloader from "../components/Preloader.jsx";

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError(false);
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/backend/problems/all`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok || data.success === false) {
          setError(data.message || "Failed to fetch problems.");
          setLoading(false);
          return;
        }
        setProblems(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        setError("An error occurred. Please try again later.");
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  // Correctly handle tags, assuming they might be an array
  const allTags = problems.flatMap((p) => p.tags || []);
  const uniqueTags = ["ALL", ...new Set(allTags)];

  const filtered = problems
    .filter((p) => {
        const problemTags = Array.isArray(p.tags) ? p.tags : [p.tags];
        const tagMatch = selectedTag === "ALL" || problemTags.includes(selectedTag);
        const searchMatch = p.name.toLowerCase().includes(search.toLowerCase());
        return tagMatch && searchMatch;
    })
    .sort((a, b) => {
      const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
      const valA = difficultyOrder[a.difficulty] || 0;
      const valB = difficultyOrder[b.difficulty] || 0;
      return order === "asc" ? valA - valB : valB - valA;
    });

  if (loading) return <Preloader />;

  return (
    // 1. Main Container: Self-contained background and padding
    <main className="min-h-screen bg-gradient-to-b from-primary-ii via-black to-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 2. Page Title: Styled with the theme's accent color */}
        <h1 className="text-4xl sm:text-5xl font-bold text-purple-400 mb-10">
          Problem Set
        </h1>

        {/* 3. Tag Filters: Themed buttons */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-400 mb-4">Filter by Tag:</h2>
          <div className="flex flex-wrap gap-3">
            {uniqueTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                  ${
                    selectedTag === tag
                      ? "bg-purple-600 text-white shadow-lg ring-2 ring-purple-400"
                      : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Search and Sort: Themed inputs */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-center">
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow w-full bg-black/20 border border-white/10 placeholder-gray-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <div className="flex items-center gap-3 w-full md:w-auto">
            <label htmlFor="sort-order" className="text-sm font-medium text-gray-400 whitespace-nowrap">
              Sort by Difficulty:
            </label>
            <select
              id="sort-order"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full md:w-auto bg-black/20 border border-white/10 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none"
            >
              <option value="asc">Easy → Hard</option>
              <option value="desc">Hard → Easy</option>
            </select>
          </div>
        </div>
        
        {error && <div className="p-4 my-4 text-center bg-red-900/50 border border-red-500/50 rounded-lg">{error}</div>}

        {/* 5. The Table: "Frosted Glass" container */}
        <div className="bg-black/30 backdrop-blur-xl shadow-2xl rounded-xl overflow-hidden">
          <table className="min-w-full text-sm text-left">
            <thead className="text-xs text-gray-300 uppercase bg-white/5">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold w-16">#</th>
                <th scope="col" className="px-6 py-4 font-semibold">Title</th>
                <th scope="col" className="px-6 py-4 font-semibold">Difficulty</th>
                <th scope="col" className="px-6 py-4 font-semibold">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-16 text-gray-500 italic">
                    No problems found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((problem, idx) => (
                  <tr
                    key={problem._id || idx}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-medium text-gray-400">{idx + 1}</td>
                    <td className="px-6 py-4 font-semibold text-white">
                      <Link to={`/problems/${problem.id}`} className="hover:text-purple-400 hover:underline transition-colors">
                        {problem.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                        ${
                          problem.difficulty === "easy" ? "bg-green-500/10 text-green-400" :
                          problem.difficulty === "medium" ? "bg-yellow-500/10 text-yellow-400" :
                          "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex flex-wrap gap-2">
                      {(Array.isArray(problem.tags) ? problem.tags : [problem.tags]).map(tag => (
                        tag && <span key={tag} className="bg-gray-500/30 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}