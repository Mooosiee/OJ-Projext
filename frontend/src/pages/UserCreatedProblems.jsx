import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Preloader from "../components/Preloader"; // Assuming Preloader component is available for a better loading state

export default function UserCreatedProb() {
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [problems, setProblems] = useState([]);

  // For delete confirmation dialog
  const [showDialog, setShowDialog] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);

  // --- No changes made to the functionality below ---
  useEffect(() => {
    const fetchProblem = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        setError(null);
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/backend/user/${user._id}/problems`, {
           method: "GET",
          credentials: "include"
        });
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }
        setProblems(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchProblem();
  }, [user]);

  const handleDeleteProblem = async () => {
    if (!problemToDelete) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/backend/problems/delete/${problemToDelete}`, {
        method: "DELETE",
        credentials: "include"
      });
      const data = await res.json();
      if (data.success === false) {
        alert(`Error: ${data.message}`);
        return;
      }
      setProblems((prev) => prev.filter((prob) => prob._id !== problemToDelete));
      setShowDialog(false);
      setProblemToDelete(null);
    } catch (error) {
      alert("Failed to delete the problem: " + error.message);
    }
  };

  // --- Themed JSX Starts Here ---
  return (
    // 1. Main Container: Full-page gradient background
    <div className="min-h-screen bg-gradient-to-b from-[#4C1D95] via-[#1E1B4B] to-black text-text-primary py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          My Created Problems
        </h1>
        
        {/* 2. Loading and Error States: Themed for consistency */}
        {loading && <Preloader />}
        {error && <p className="text-center text-error bg-red-500/10 p-3 rounded-lg border border-error/30">{error}</p>}

        {!loading && !error && (
          // 3. Problem List Card: "Frosted glass" effect
          <div className="bg-black/30 backdrop-blur-xl shadow-2xl rounded-xl">
            {problems.length > 0 ? (
              <ul className="divide-y divide-white/10">
                {problems.map((problem) => (
                  <li
                    key={problem._id}
                    className="p-4 flex justify-between items-center transition-all hover:bg-white/5"
                  >
                    {/* 4. Problem Link and Actions: Themed */}
                    <Link
                      to={`/problems/${problem._id}`}
                      className="text-lg font-semibold text-white hover:text-purple-400 transition-colors"
                    >
                      {problem.name}
                    </Link>

                    <div className="flex items-center gap-4">
                      <Link 
                        to={`/edit-problem/${problem._id}`}
                        className="font-medium text-sm text-secondary hover:text-green-400 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        className="font-medium text-sm text-error hover:text-red-400 hover:underline"
                        onClick={() => {
                          setShowDialog(true);
                          setProblemToDelete(problem._id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              // 5. Empty State: Styled for clarity
              <p className="text-center text-text-secondary py-16">
                You haven't created any problems yet.
              </p>
            )}
          </div>
        )}
      </div>

      {/* 6. Delete Confirmation Modal: Fully themed */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full border border-purple-500/30">
            <h2 className="text-xl font-semibold mb-4 text-white">Confirm Deletion</h2>
            <p className="text-text-secondary mb-6">Are you sure you want to delete this problem? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDialog(false);
                  setProblemToDelete(null);
                }}
                className="px-5 py-2.5 bg-white/10 text-text-primary rounded-lg hover:bg-white/20 transition duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProblem}
                className="px-5 py-2.5 bg-error text-white rounded-lg hover:bg-red-500 transition duration-300 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}