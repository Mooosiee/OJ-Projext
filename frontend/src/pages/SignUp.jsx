import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // --- Handlers for form changes and API calls (functionality remains the same) ---
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/backend/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      setError(null);
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  // --- Themed JSX Starts Here ---
  return (
    // 1. Main Container: Full-page gradient and flex centering.
    <div className="min-h-screen bg-gradient-to-b from-[#4C1D95] via-[#1E1B4B] to-black flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-text-primary">
      
      {/* 2. Sign-Up Card: Themed with the "frosted glass" effect. */}
      <div className="max-w-md w-full space-y-8 bg-black/30 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-2xl border border-purple-500/30">
        <div>
          {/* 3. Title: Using the brand font and accent color. */}
          <h1 className="font-playwrite text-center text-4xl font-bold tracking-tight text-purple-400">
            OG-OJ 
          </h1>
          <h2 className="mt-2 text-center text-xl font-medium text-gray-300">
            Create your account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md flex flex-col gap-6">
            
            {/* 4. Form Inputs: Styled to match the dark theme. */}
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-text-secondary">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="bg-black/20 border border-white/10 text-text-primary text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 block w-full p-3.5 placeholder-gray-500 transition-all"
                placeholder="Choose a username"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-text-secondary">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="bg-black/20 border border-white/10 text-text-primary text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 block w-full p-3.5 placeholder-gray-500 transition-all"
                placeholder="you@example.com"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-text-secondary">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="bg-black/20 border border-white/10 text-text-primary text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 block w-full p-3.5 placeholder-gray-500 transition-all"
                placeholder="Create a secure password"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* 5. Submit Button: Themed with the primary brand color. */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-150 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Sign Up
            </button>
          </div>
        </form>
        
        {/* 6. Error Message: Consistent error styling. */}
        {error && (
          <p className="mt-5 text-center text-sm text-error bg-red-500/10 p-3 rounded-lg font-medium border border-error/30">
            {error}
          </p>
        )}

        <div className="mt-8 text-center text-sm text-text-secondary">
          <p>
            Already have an account?{" "}
            {/* 7. Sign In Link: Styled as a clear call-to-action. */}
            <Link
              to="/login"
              className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}