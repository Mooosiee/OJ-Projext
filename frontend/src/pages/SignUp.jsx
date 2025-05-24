import React from "react";
import { Link } from "react-router-dom";
export default function SignUp() {
  return (
    <div className="bg-white p-16 max-w-md mx-auto">
      <h1 className="text-4xl text-center font-semibold my-7">Logo</h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 border-gray-300 rounded-md"
          id="username"
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 border-gray-300 rounded-md"
          id="email"
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 border-gray-300 rounded-md"
          id="password"
        />
        <button className="bg-surface text-white py-2 rounded-md  hover:bg-gray-700 ">
          Sign Up
        </button>
      </form>
      <div className="flex gap-2 mt-4">
        <p className='font-medium'>Have an account?</p>
        <Link to="/login">
          <span className='text-custom_btn'>Sign in</span>
        </Link>
      </div>
    </div>
  );
}
