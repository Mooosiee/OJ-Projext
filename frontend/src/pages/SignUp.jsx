import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://og-oj-backend.onrender.com/backend/auth/signup", {
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
      return;
    }
  };
  

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-text-primary">
      <div className="max-w-md w-full space-y-8 bg-surface p-8 md:p-10 rounded-xl shadow-2xl">
        <div>
          <h1 className="mt-6 text-center text-4xl font-bold tracking-tight text-primary">
            OG-OJ 
          </h1>
          <h2 className="mt-2 text-center text-xl font-medium text-text-secondary">
            Create your account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm flex flex-col gap-6">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block mb-1 text-sm font-medium text-text-secondary"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="bg-background border border-border text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3.5 placeholder-text-secondary"
                placeholder="Choose a username"
                onChange={handleChange}
              />
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-medium text-text-secondary"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="bg-background border border-border text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3.5 placeholder-text-secondary"
                placeholder="you@example.com"
                onChange={handleChange}
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-text-secondary"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password" // Use "new-password" for sign-up forms
                required
                className="bg-background border border-border text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3.5 placeholder-text-secondary"
                placeholder=""
                onChange={handleChange}
              />
              {/* Optional: Add password strength indicator or confirm password field here */}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              // Use loading state from Redux
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Sign Up
            </button>
          </div>
        </form>

        {error && ( // Display error from Redux store
          <p className="mt-5 text-center text-sm text-error bg-red-500/10 p-3 rounded-md font-medium border border-error/30">
            {error}
          </p>
        )}

        <div className="mt-8 text-center text-sm text-text-secondary">
          <p>
            Already have an account?{" "}
            <Link
              to="/login" // Or your sign-in route, e.g., /signin
              className="font-medium text-custom_btn hover:text-opacity-80 hover:underline transition"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
