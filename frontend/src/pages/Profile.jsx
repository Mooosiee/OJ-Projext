import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  UpdateUserSuccess,
  UpdateUserFailure,
  DeleteUserSuccess,
  DeleteUserFailure,
} from "../redux/userSlice.js";

export default function Profile() {
  const currentUser = useSelector((state) => state.user.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const dispatch = useDispatch();
  
  // If no user is logged in, redirect them to the login page.
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

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
      const res = await fetch(`${apiUrl}/backend/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(UpdateUserFailure(data.message));
        return;
      }
      dispatch(UpdateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(UpdateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    setShowDelete(false);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/backend/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(DeleteUserFailure(data.message));
        return;
      }
      dispatch(DeleteUserSuccess(data));
    } catch (error) {
      dispatch(DeleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/backend/auth/logout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(DeleteUserFailure(data.message));
        return;
      }
      dispatch(DeleteUserSuccess(data));
    } catch (error) {
      dispatch(DeleteUserFailure(error.message));
    }
  };

  // --- Themed JSX Starts Here ---
  return (
    // 1. Main Container: Full-page gradient background for consistency.
    <div className="min-h-screen bg-gradient-to-b from-[#4C1D95] via-[#1E1B4B] to-black py-12 px-4">
      
      {/* 2. Profile Card: "Frosted glass" effect with backdrop-blur and a subtle purple border. */}
      <div className="max-w-lg mx-auto bg-black/30 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl border border-purple-500/30">
        
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
          {currentUser.username}
        </h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* 3. Avatar: Ring effect matching the primary theme color. */}
          <img
            src={`https://api.dicebear.com/8.x/identicon/svg?seed=${currentUser.username}`}
            alt="profile"
            className="h-28 w-28 rounded-sm object-cover self-center shadow-lg border-[0.75px] border-white  "
          />
          
          {/* 4. Form Inputs: Consistent dark, themed styling. */}
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-text-secondary">
              Username
            </label>
            <input
              type="text"
              defaultValue={currentUser.username}
              className="bg-black/20 border border-white/10 text-text-primary text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 block w-full p-3.5 transition-all"
              id="username"
              onChange={handleChange}
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-text-secondary">
              Email
            </label>
            <input
              type="email"
              defaultValue={currentUser.email}
              className="bg-black/20 border border-white/10 text-text-primary text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 block w-full p-3.5 transition-all"
              id="email"
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-text-secondary">
              New Password
            </label>
            <input
              type="password"
              placeholder="Leave blank to keep current"
              className="bg-black/20 border border-white/10 text-text-primary text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 block w-full p-3.5 transition-all"
              id="password"
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>
          
          {/* 5. Buttons: Themed with primary and secondary colors. */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-purple-600 focus:ring-4 focus:outline-none focus:ring-purple-500/50 font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Update Profile
          </button>
          <Link
            to="/create-problem"
            // Using the `secondary` color from your config
            className="w-full bg-secondary text-white py-3 px-4 rounded-lg hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-teal-500/50 font-semibold text-center transition duration-300"
          >
            Contribute a Problem <span className="ml-2">❤️</span>
          </Link>
        </form>
        
        {/* 6. Action Links: Styled for clarity. */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
          <span
            onClick={() => setShowDelete(true)}
            className="text-error hover:text-red-400 cursor-pointer font-medium transition-colors"
          >
            Delete account
          </span>
          <span
            onClick={handleSignout}
            className="text-warning hover:text-yellow-400 cursor-pointer font-medium transition-colors"
          >
            Sign out
          </span>
        </div>
        
        {/* 7. Success Message: Themed and subtle. */}
        {updateSuccess && (
          <p className="text-success mt-5 text-center font-medium bg-green-500/10 border border-green-500/30 p-2 rounded-lg">
            User Updated Successfully!
          </p>
        )}
        
        {/* Links to other user-specific pages */}
        <div className="flex flex-col items-center mt-10 pt-6 border-t border-white/10 text-center">
          <Link to="/user/problems" className="text-purple-400 hover:underline cursor-pointer mb-4">
            Show My Created Problems
          </Link>
          <Link to="/user/submissions" className="text-purple-400 hover:underline cursor-pointer">
            Show My Submissions
          </Link>
        </div>
      </div>

      {/* 8. Confirmation Modal: Fully themed. */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full border border-purple-500/30">
            <h3 className="text-xl font-semibold text-white mb-4">
              Confirm Deletion
            </h3>
            <p className="text-text-secondary mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDelete(false)}
                className="px-5 py-2.5 bg-white/10 text-text-primary rounded-lg hover:bg-white/20 transition duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-5 py-2.5 bg-error text-white rounded-lg hover:bg-red-500 transition duration-300 font-medium"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}