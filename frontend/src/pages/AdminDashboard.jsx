import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Preloader from '../components/Preloader';

// --- ICONS for buttons and clarity ---
const EditIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
  </svg>
);

export default function AdminDashboard() {
  const  currentUser  = useSelector((state) => state.user.user);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- DATA FETCHING ---
  // This effect runs once when the component mounts to fetch all problems.
  useEffect(() => {
    const fetchAllProblems = async () => {
      try {
        setLoading(true);
        setError(null);
        // Note: Ensure you have an API endpoint that returns ALL problems.
          // Your existing `getAllProblems` controller seems perfect for this.
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/backend/problems/all`);
        const data = await res.json();

        if (res.ok) {
          setProblems(data);
        } else {
          throw new Error(data.message || 'Failed to fetch problems');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProblems();
  }, []);
 
  // --- DELETE FUNCTIONALITY ---
  const handleDeleteProblem = async (problemId) => {
    // Show a confirmation dialog before deleting
    if (!window.confirm('Are you sure you want to delete this problem? This action cannot be undone.')) {
      return;
    }

      try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/problems/delete/${problemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Assuming your token is stored in cookies or you can get it from headers
          // This part depends on your specific auth setup.
          // If you use a bearer token, you'd add:
          // 'Authorization': `Bearer ${currentUser.token}`
        },
      });

      if (res.ok) {
        // If deletion is successful, update the UI by removing the problem from the state
        setProblems((prevProblems) => prevProblems.filter((p) => p.id !== problemId));
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete the problem.');
      }
    } catch (err) {
      alert(`Error: ${err.message}`); // Show an alert on failure
    }
  };

  return (
    <main className="bg-black text-white min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
            {loading && <Preloader />}
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Link to="/problems/create" className="bg-purple-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-purple-500 transition-colors text-sm">
              Create Problem
            </Link>
            <Link to="/contests/create" className="bg-white/10 backdrop-blur-xl text-white font-semibold px-5 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm">
              Create Contest
            </Link>
          </div>
        </div>

        {/* --- PROBLEM MANAGEMENT SECTION --- */}
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Problem Management</h2>

          {/* Conditional Rendering for Loading and Error states */}
        
          {error && <p className="text-red-500">Error: {error}</p>}
          
          {!loading && !error && (
            <div className="flex flex-col">
              {problems.length > 0 ? (
                problems.map((problem) => (
                  <div key={problem._id} className="flex flex-col sm:flex-row justify-between sm:items-center py-4 border-b border-white/10 last:border-b-0">
                    
                    {/* Problem Name and Author */}
                    <div className="mb-4 sm:mb-0">
                      <p className="font-bold text-lg text-white">{problem.name}</p>
                            <p className="text-sm text-gray-400">
                        Author: {problem.userRef?.username || 'Unknown Author'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <Link 
                        to={`/edit-problem/${problem._id}`} 
                        className="flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 bg-blue-600/20 hover:bg-blue-600/40 px-3 py-1.5 rounded-md transition-colors"
                      >
                        <EditIcon /> Edit
                      </Link>
                      <button 
                        onClick={() => handleDeleteProblem(problem._id)}
                        className="flex items-center text-sm font-medium text-red-400 hover:text-red-300 bg-red-600/20 hover:bg-red-600/40 px-3 py-1.5 rounded-md transition-colors"
                      >
                        <DeleteIcon /> Delete
                      </button>
                    </div>

                  </div>
                ))
              ) : (
                <p className="text-gray-400">No problems found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}