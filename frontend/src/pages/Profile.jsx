import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  UpdateUserSuccess,
  UpdateUserFailure,
  DeleteUserSuccess,
  DeleteUserFailure,
} from "../redux/userSlice.js";
export default function profile() {
  const currentUser = useSelector((state) => state.user.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
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
      const res = await fetch(`/backend/user/update/${currentUser._id}`, {
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
    } catch (error) {
      dispatch(UpdateUserFailure(error.message));
      return;
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/backend/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(DeleteUserFailure(data.message));
        return;
      }
      dispatch(DeleteUserSuccess(data));
      // Handle successful deletion, e.g., redirect to home page or show a message
    } catch (error) {
      dispatch(DeleteUserFailure(error.message));
      return;
    }
  };

  const handlesignout = async () => {
    try{
     const res = await fetch('/backend/auth/logout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(DeleteUserFailure(data.message));
        return;
      }
      dispatch(DeleteUserSuccess(data));
    } catch (error) {
      dispatch(DeleteUserFailure(data.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        <img
          src={currentUser.avatar}
          alt="profile"
          className="h-24 w-24 rounded-full object-cover cursor-pointer self-center mt-2"
        />
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 border-gray-300 rounded-md"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          className="border p-3 border-gray-300 rounded-md"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 border-gray-300 rounded-md"
          id="password"
          onChange={handleChange}
        />
        <button className="bg-surface text-white py-2 rounded-md  hover:bg-gray-700 ">
          UPDATE
        </button>
        <button className="bg-gray-600 text-white py-2 rounded-md  hover:bg-surface">
          CONTRIBUTE A PROBLEM <span className="ml-2">❤️</span>
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handlesignout} className="text-red-700 cursor-pointer">Sign out</span>
      </div>

      <p className="text-success mt-5">
        {updateSuccess ? "User Updated Succesfully!!" : ""}
      </p>
    </div>
  );
}
