import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SigninSuccess, SignInFailure } from "../redux/userSlice.js";
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
  const {error} = useSelector((state) => state.user); // Access error from Redux store
 
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize the dispatch function from Redux
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/backend/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(SignInFailure(data.message)); // Dispatch error message to Redux store
        return;
      }
      dispatch(SigninSuccess(data)); // Dispatch user data to Redux store
      navigate('/Home');
    } catch (error) {
      dispatch(SignInFailure(error.message));
      return;
    }
  };
  return (
    <div className="bg-white p-16 max-w-md mx-auto">
      <h1 className="text-4xl text-center font-semibold my-7">Logo</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <input
          type="email"
          placeholder="email"
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
          Sign In
        </button>
      </form>
      <div className="flex justify-between mt-4">
        {/*<Link to="/forgot-password"> </Link> */}
        <p className="font-medium hover:underline">Forgot Password?</p>
        <Link to="/signup">
          <span className="text-custom_btn">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
