import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SigninSuccess, SignInFailure } from "../redux/userSlice.js";
import { useAuth0 } from "@auth0/auth0-react";

export default function Login() {
  const [formData, setFormData] = useState({});
  const { error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loginWithRedirect } = useAuth0();

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
      const res = await fetch(`${apiUrl}/backend/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(SignInFailure(data.message));
        return;
      }
      dispatch(SigninSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(SignInFailure(error.message));
    }
  };

  // --- Themed JSX Starts Here ---
  return (
    // 1. Main Container: Consistent full-page gradient and centering.
    <div className="min-h-screen bg-gradient-to-b from-[#4C1D95] via-[#1E1B4B] to-black flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-text-primary">
      
      {/* 2. Login Card: Themed with the "frosted glass" effect. */}
      <div className="max-w-md w-full space-y-8 bg-black/30 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-2xl border border-purple-500/30">
        <div>
          {/* <h1 className="font-playwrite text-center text-4xl font-bold tracking-tight text-purple-400">
            OG-OJ
          </h1> */}
          <h2 className="mt-2 text-center text-xl font-medium text-gray-300">
            Welcome Back
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md flex flex-col gap-6">
            
            {/* 3. Form Inputs: Styled to match the dark theme. */}
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
                autoComplete="current-password"
                required
                className="bg-black/20 border border-white/10 text-text-primary text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 block w-full p-3.5 placeholder-gray-500 transition-all"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-end mt-2">
            <div className="text-sm">
              <p className="font-medium text-purple-400 hover:text-purple-300 transition cursor-pointer hover:underline">
                Forgot password?
              </p>
            </div>
          </div>

          {/* 4. Submit & Auth0 Buttons: Themed for consistency. */}
          <div className="space-y-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-150 ease-in-out transform hover:scale-105 disabled:opacity-60"
            >
              Sign In
            </button>
            {/* <button
              onClick={() => loginWithRedirect()}
              type="button"
              className="w-full flex items-center justify-center py-3 px-4 border border-white/20 text-sm font-semibold rounded-lg text-white bg-white/10 hover:bg-white/20 transition duration-150 ease-in-out"
            >
              Sign in with Auth0
            </button> */}
          </div>
        </form>

        {/* 5. Error Message: Themed for visibility. */}
        {error && (
          <p className="mt-4 text-center text-sm text-error bg-red-500/10 p-3 rounded-md font-medium border border-error/30">
            {error}
          </p>
        )}

        <p className="mt-8 text-center text-sm text-text-secondary">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}