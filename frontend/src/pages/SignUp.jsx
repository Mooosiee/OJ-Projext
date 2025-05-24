import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
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
      const res = await fetch("/backend/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        setError(data.message);
        return;
      }
      setError(null);
      navigate('/login');
    } catch (error) {
      setError(error.message);
      return;
    }
  };
  return (
    <div className="bg-white p-16 max-w-md mx-auto">
      <h1 className="text-4xl text-center font-semibold my-7">Logo</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 border-gray-300 rounded-md"
          id="username"
          onChange={handleChange}
        />
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
          Sign Up
        </button>
      </form>
      <div className="flex gap-2 mt-4">
        <p className="font-medium">Have an account?</p>
        <Link to="/login">
          <span className="text-custom_btn">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
