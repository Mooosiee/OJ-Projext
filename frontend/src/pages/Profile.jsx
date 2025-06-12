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
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://og-oj-backend.onrender.com/backend/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      return;
    }
  };

  const handleDeleteUser = async () => {
    setShowDelete(false);
    try {
      const res = await fetch(`https://og-oj-backend.onrender.com/backend/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(DeleteUserFailure(data.message));
        return;
      }
      dispatch(DeleteUserSuccess(data));
      // You can add redirect or message after deletion here
    } catch (error) {
      dispatch(DeleteUserFailure(error.message));
      return;
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("https://og-oj-backend.onrender.com/backend/auth/logout");
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

  return (
    <div className="bg-background min-h-screen text-text-primary py-8 px-4">
      {" "}
      {/* Ensure page background is dark */}
      <div className="max-w-lg mx-auto bg-surface p-6 md:p-8 rounded-xl shadow-2xl">
        {" "}
        {/* Card background */}
        <h1 className="text-3xl md:text-4xl font-semibold text-center my-7 text-primary">
          PROFILE
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {" "}
          {/* Increased gap for better spacing */}
          <img
            src={currentUser.avatar}
            alt="profile"
            className="h-28 w-28 rounded-full object-cover cursor-pointer self-center border-4 border-primary shadow-lg" // Added primary border to avatar
          />
          {/* Username Input */}
          <div>
            <label
              htmlFor="username"
              className="block mb-1 text-sm font-medium text-text-secondary"
            >
              Username
            </label>
            <input
              type="text"
              placeholder="username"
              defaultValue={currentUser.username}
              className="bg-background border border-border text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3.5" // Applied theme colors
              id="username"
              onChange={handleChange}
              autoComplete="username"
            />
          </div>
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-text-secondary"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="email"
              defaultValue={currentUser.email}
              className="bg-background border border-border text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3.5" // Applied theme colors
              id="email"
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-text-secondary"
            >
              New Password
            </label>
            <input
              type="password"
              placeholder="Leave blank to keep current"
              className="bg-background border border-border text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3.5" // Applied theme colors
              id="password"
              onChange={handleChange}
              autoComplete="new-password" // Use "new-password" for password change fields
            />
          </div>
          <button
            type="submit" // Explicitly type="submit" for the main form button
            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-semibold transition duration-300" // Used primary for update
          >
            UPDATE
          </button>
          <Link
            to="/create-problem"
            className="w-full bg-custom_btn text-white py-3 px-4 rounded-lg hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-gray-700 font-semibold text-center transition duration-300" // Used custom_btn
          >
            CONTRIBUTE A PROBLEM <span className="ml-2">❤️</span>
          </Link>
        </form>
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          {" "}
          {/* Added top border for separation */}
          <span
            onClick={() => setShowDelete(true)} // Corrected to use setShowDelete
            className="text-error hover:underline cursor-pointer font-medium"
          >
            Delete account
          </span>
          <span
            onClick={handleSignout}
            className="text-warning hover:underline cursor-pointer font-medium"
          >
            Sign out
          </span>
        </div>
        {updateSuccess && (
          <p className="text-success mt-5 text-center font-medium bg-green-500/10 p-2 rounded-md">
            {" "}
            {/* Added subtle background */}
            User Updated Successfully!!
          </p>
        )}
        {/* You might want to display Redux errors here too if UpdateUserFailure sets an error in the store */}
        {/* Example: {userErrorFromRedux && <p className="text-error ...">{userErrorFromRedux}</p>} */}
        {showDelete && ( // Corrected state variable name
          <div className="fixed inset-0 bg-background bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {" "}
            {/* Added backdrop-blur */}
            <div className="bg-surface p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full border border-border">
              {" "}
              {/* Consistent card styling */}
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Confirm Deletion
              </h3>
              <p className="text-text-secondary mb-6">
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-4">
                {" "}
                {/* Increased spacing */}
                <button
                  onClick={() => setShowDelete(false)} // Corrected state variable name
                  className="px-5 py-2.5 bg-gray-600 text-text-primary rounded-lg hover:bg-gray-500 transition duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-5 py-2.5 bg-error text-white rounded-lg hover:bg-red-700 transition duration-300 font-medium"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Placeholder for "Show My Created Problems" and "My Submissions" */}
        <div className="flex flex-col mt-10 pt-6 border-t border-border text-center">
          <Link
            to="/user/problems"
            className="text-text-secondary hover:underline cursor-pointer mb-4"
          >
            Show My Created Problems
          </Link>
          <Link
            to="/user/submissions"
            className="text-text-secondary hover:underline cursor-pointer"
          >
            Show My Submissions
          </Link>
        </div>
      </div>
    </div>
  );
}
