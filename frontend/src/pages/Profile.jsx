import { useSelector,useDispatch } from "react-redux";
import { use, useState } from "react";
import { UpdateUserSuccess,UpdateUserFailure } from "../redux/userSlice.js";
export default function profile() {
  const currentUser = useSelector((state) => state.user.user);
  const error = useSelector((state) => state.user.error);
  const[formData, setFormData] = useState({});
  const[updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,[e.target.id]: e.target.value});
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
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit ={handleSubmit} className="flex flex-col gap-4 ">
        <img
          src={currentUser.avatar}
          alt="profile"
          className="h-24 w-24 rounded-full object-cover cursor-pointer self-center mt-2"
        />
        <input
          type="text"
          placeholder="username"
          defaultValue = {currentUser.username}
          className="border p-3 border-gray-300 rounded-md"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue = {currentUser.email}
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
        <button className="bg-green-800 text-white py-2 rounded-md  hover:bg-green-700 ">
          CREATE A PROBLEM
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className = 'text-red-700 cursor-pointer'>Delete account</span>
        <span className = 'text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error? error : '' }</p>
      <p className="text-success mt-5">{updateSuccess? 'User Updated Succesfully!!' : '' }</p>
    </div>
  );
}
