import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function UserCreatedProb() {
  const user  = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [problems, setProblems] = useState([]);
  useEffect(() => {
    const fetchProblem = async () => {
      //?. = optional chaining.
      if (!user?._id) return; // Don't fetch if no user
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
  }, [user]); //rerun if user object changes
  return (
    <div className="bg-background min-h-screen text-text-primary py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-primary mb-6">
          My Created Problems
        </h1>
        {loading && (
          <p className="text-center text-text-secondary">Loading...</p>
        )}
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
                    {/* Edit/Delete buttons here : will do it later on*/}
                    <div className="flex gap-8">
                        <Link>Edit</Link>
                        <Link>Delete</Link>
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
    </div>
  );
}
