import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function MySubmissions() {
  const user  = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/backend/user/${user._id}/submissions`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }
        setSubmissions(data); 
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [user]);

  return (
    <div className="bg-background min-h-screen text-text-primary py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold text-primary mb-6">
          My Submissions
        </h1>
        {loading && <p className="text-center text-text-secondary">Loading...</p>}
        {error && <p className="text-center text-error">{error}</p>}
        
        {!loading && !error && (
          <div className="bg-surface rounded-xl shadow-lg p-4">
            {submissions && submissions.length > 0 ? (
              <ul className="divide-y divide-border">
                {/* 1. ADDED A HEADER ROW for context */}
                <li className="py-3 flex items-center font-semibold text-text-secondary">
                  <div className="w-1/4 pl-2">Date & Time</div>
                  <div className="w-1/2">Problem Title</div>
                  <div className="flex gap-8">
                      <div >Language</div>
                      <div >Verdict</div>
                  </div>
                </li>
                {/* 2. MAPPING THE DATA with the correct layout */}
                {submissions.map((submission) => (
                  <li key={submission._id} className="py-4 flex items-center hover:bg-background transition-colors duration-200 rounded-md">
                    {/* Column 1: Date (Formatted and with defined width) */}
                    <div className="w-1/4 text-sm text-text-secondary pl-2">
                      {new Date(submission.createdAt).toLocaleString()}
                    </div>

                    {/* Column 2: Problem Title (Wider, with a link) */}
                    <div className="w-1/2 font-medium">
                      <Link to={`/problems/${submission.problem?._id}`} className="hover:text-primary transition">
                        {submission.problem?.name || 'Unknown Problem'}
                      </Link>
                    </div>

                    {/* Column 3: Language (Centered) */}
                    <div className="flex gap-10">
                        <div className="w-1/8">{submission.language}</div>
                        {/* Column 4: Verdict (Right-aligned with color) */}
                        <div className={`w-1/8 text-right font-semibold pr-2 ${
                            submission.verdict === 'Accepted' ? 'text-success' : 'text-error'
                        }`}>
                          {submission.verdict}
                        </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-text-secondary py-8">
                You haven't made any submissions yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}