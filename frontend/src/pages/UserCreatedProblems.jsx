import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function UserCreatedProb() {
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [problems, setProblems] = useState([]);

  // For delete confirmation dialog
  const [showDialog, setShowDialog] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/backend/user/${user._id}/problems`);
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
      const res = await fetch(`/backend/problems/delete/${problemToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success === false) {
        alert(`Error: ${data.message}`);
        return;
      }

      // Update UI
      setProblems((prev) => prev.filter((prob) => prob._id !== problemToDelete));
      setShowDialog(false);
      setProblemToDelete(null);
    } catch (error) {
      alert("Failed to delete the problem: " + error.message);
    }
  };

  return (
    <div className="bg-background min-h-screen text-text-primary py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-primary mb-6">
          My Created Problems
        </h1>

        {loading && <p className="text-center text-text-secondary">Loading...</p>}
        {error && <p className="text-center text-error">{error}</p>}

        {!loading && !error && (
          <div className="bg-surface rounded-xl shadow-lg p-4">
            {problems.length > 0 ? (
              <ul className="divide-y divide-border">
                {problems.map((problem) => (
                  <li
                    key={problem._id}
                    className="py-4 flex justify-between items-center"
                  >
                    <div>
                      <Link
                        to={`/problems/${problem._id}`}
                        className="text-lg font-semibold text-text-primary hover:text-primary transition"
                      >
                        {problem.name}
                      </Link>
                    </div>

                    <div className="flex gap-8">
                      <Link to={`/edit-problem/${problem._id}`}>Edit</Link>
                      <button
                        className="text-error hover:underline"
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
              <p className="text-center text-text-secondary py-8">
                You haven't created any problems yet.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-primary">Confirm Deletion</h2>
            <p className="text-text-secondary mb-6">Are you sure you want to delete this problem?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDialog(false);
                  setProblemToDelete(null);
                }}
                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:opacity-90"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProblem}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
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
