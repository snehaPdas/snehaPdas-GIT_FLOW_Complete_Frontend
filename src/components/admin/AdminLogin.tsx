import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { adminLogin } from "../../actions/AdminAction";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


function AdminLogin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const adminData = {
      email,
      password,
    };
    

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      toast.error("Email and password are required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      toast.error("Please enter a valid email");

      return;
    }

    setError(null);
    console.log("Admin Login Details:", { email, password });

    try {
      const action = await dispatch(adminLogin(adminData));

      
      if (adminLogin.fulfilled.match(action)) {
        toast.success("Successfully logged in!");
        navigate("/admin");
      }else{
        toast.error("Invalid Credentials")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen p-10"
      style={{
        background: "linear-gradient(to right, #572c5f, #ffffff)",
      }}
    >
      <div className=" bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-50">
          <h1 className="text-2xl font-bold text-center mb-4 text-[#572c5f]">
            Admin Login
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-2 ">
              <label
                htmlFor="email"
                className="block text-sm w-20 font-medium text-[#572c5f] mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                style={{ width: "350px" }}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#572c5f] mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:[#572c5f] focus:outline-none"
              />
            </div>
            {error && <div className="mb-5 text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full bg-[#572c5f] text-white py-2 rounded-md hover:bg-[#572c5f] transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
