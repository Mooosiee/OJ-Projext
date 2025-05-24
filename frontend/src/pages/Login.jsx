import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
export default function Login() {
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
      const res = await fetch("/backend/auth/login", {
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
      navigate('/home');
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
