import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Preloader from "../components/Preloader"; // Assuming Preloader is available

export default function MySubmissions() {
  const user  = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  // --- No changes made to the functionality below ---
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        setError(null);
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/backend/user/${user._id}/submissions`,{
          method : "GET",
          credentials: "include", 
        });
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

  // --- Themed JSX Starts Here ---
  return (
    // 1. Main Container: Full-page gradient background
    <div className="min-h-screen bg-gradient-to-b from-[#4C1D95] via-[#1E1B4B] to-black text-text-primary py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          My Submissions
        </h1>

        {loading && <Preloader />}
        {error && <p className="text-center text-error bg-red-500/10 p-3 rounded-lg border border-error/30">{error}</p>}
        
        {!loading && !error && (
          // 2. Submissions Card: "Frosted glass" effect, perfect for a table
          <div className="bg-black/30 backdrop-blur-xl shadow-2xl rounded-xl overflow-hidden">
            {submissions && submissions.length > 0 ? (
              <div className="divide-y divide-white/10">
                
                {/* 3. Table Header: Clear, uppercase, and subtly distinct */}
                <div className="px-6 py-4 flex items-center font-semibold text-xs text-gray-400 uppercase bg-white/5">
                  <div className="w-2/5">Problem</div>
                  <div className="w-1/5 text-center">Language</div>
                  <div className="w-1/5 text-center">Verdict</div>
                  <div className="w-1/5 text-right">Submitted</div>
                </div>
                
                {/* 4. Submissions List: Mapping over data to create themed rows */}
                {submissions.map((submission) => (
                  <div key={submission._id} className="px-6 py-4 flex items-center hover:bg-white/5 transition-colors duration-200">
                    
                    {/* Problem Title */}
                    <div className="w-2/5 font-semibold">
                      <Link to={`/problems/${submission.problem?._id}`} className="text-white hover:text-purple-400 transition">
                        {submission.problem?.name || 'Unknown Problem'}
                      </Link>
                    </div>

                    {/* Language Pill */}
                    <div className="w-1/5 text-center">
                       <span className="bg-gray-500/30 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
                          {submission.language}
                        </span>
                    </div>
                    
                    {/* Verdict Pill */}
                    <div className="w-1/5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                        ${
                          submission.verdict === 'Accepted' 
                            ? "bg-green-500/10 text-green-400" 
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {submission.verdict}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="w-1/5 text-sm text-text-secondary text-right">
                      {new Date(submission.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // 5. Empty State: Styled for clarity
              <p className="text-center text-text-secondary py-16">
                You haven't made any submissions yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}