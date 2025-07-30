import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SigninSuccess, SignInFailure } from "../redux/userSlice.js";
import { useAuth0 } from "@auth0/auth0-react";
// useDispatch is a hook that gives you access to the dispatch function from the Redux store
// it allows you to dispatch actions to the store
//what is react-redux?
// React-Redux is a library that provides bindings to use Redux with React
//so Link,useNavigate, useDispatch are all hooks?
// yes, Link and useNavigate are hooks from React Router for navigation, and useDispatch is a hook from React-Redux
// for dispatching actions and  useState is a hook from the React library that allows you to manage state in
// functional components
// Hooks are special functions in React that let you use state and other React features in functional components

export default function Login() {
  const [formData, setFormData] = useState({});
  // const [error, setError] = useState(null);//instead of using the local we use this
  const { error } = useSelector((state) => state.user); // Access error from Redux store
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize the dispatch function from Redux
  const { loginWithRedirect } = useAuth0();
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
        dispatch(SignInFailure(data.message)); // Dispatch error message to Redux store
        return;
      }
      dispatch(SigninSuccess(data)); // Dispatch user data to Redux store
      navigate("/");
    } catch (error) {
      dispatch(SignInFailure(error.message));
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
          {/* Optional: Add a subtitle like "Sign in to continue" */}
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm flex flex-col gap-6">
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
                autoComplete="current-password"
                required
                className="bg-background border border-border text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3.5 placeholder-text-secondary"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-end mt-2">
            {" "}
            {/* Changed to justify-end for forgot password */}
            <div className="text-sm">
              <p
                className="font-medium text-secondary hover:text-cyan-400 transition cursor-pointer hover:underline"
                onClick={() =>
                  alert(
                    "Forgot password clicked - did not implement functionality yet!."
                  )
                } // An alert for now
              >
                Forgot password?
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary transition duration-150 ease-in-out disabled:opacity-70"
            >
              Sign In
            </button>
          </div>
          {/* Auth0 Login Button */}
      <div className="mt-4">
        <button
          onClick={() => loginWithRedirect()}
          type="button"
          className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 text-sm font-semibold rounded-lg text-gray-800 bg-white hover:bg-gray-100 shadow-sm transition duration-150 ease-in-out"
        >
          Sign in with Auth0
        </button>
      </div>
        </form>

        {error && ( // Display error from Redux store
          <p className="mt-4 text-center text-sm text-error bg-red-500/10 p-3 rounded-md font-medium">
            {error}
          </p>
        )}

        <p className="mt-8 text-center text-sm text-text-secondary">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-custom_btn hover:text-opacity-80 hover:underline transition"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
