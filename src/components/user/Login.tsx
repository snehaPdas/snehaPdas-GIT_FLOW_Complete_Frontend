import React, { useState,useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { useNavigate } from "react-router-dom";
import login_img from "../../assets/login_back.jpg";
import { loginUser, GoogleLogins } from "../../actions/userActio";
import { Toaster, toast } from "react-hot-toast";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { AxiosResponse } from "axios";


const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<any>({});

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const validate = () => {
    let isValid = true;
    let errors: any = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email";
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      return; // Stop form submission if validation fails
    }

    try {
      const loginData = { email, password };
      
      const action = await dispatch(loginUser(loginData));
      
      if (loginUser.rejected.match(action)) {
        let errorMessage = action.payload as string;
        console.log("Error message:", errorMessage);
        toast.error(errorMessage);
        return;
      }

      navigate("/home");
      
    } catch (error: any) {
      console.log("Error:", error);
      if (error.response) {
        console.error("Error in login user data", error);
        toast.error("Something went wrong, try again later");
      }
    }
  };

  const handleGoogleResponse = async (response: CredentialResponse) => {
    const token = response.credential;
    if (token) {
      localStorage.setItem("accesstoken",token)
      dispatch(GoogleLogins(token)).then((response: any) => {
        if (response.meta.requestStatus !== "rejected") {
          navigate("/home");
        }
      });
    }
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
  };

let accesstoken=localStorage.getItem("accesstoken")

useEffect(()=>{
    if(accesstoken){
        navigate("/home",{replace:true})
    }
},[accesstoken,navigate])




  return (
    <div
      className="flex justify-center items-center h-screen p-10 bg-cover bg-center"
      style={{
        backgroundImage: `url(${login_img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white bg-opacity-60 p-10 rounded-3xl shadow-lg w-[90%] max-w-[400px]">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <h1 className="text-center text-[#572c5f] font-bold text-4xl mb-6">
            User Login
          </h1>

          {/* Email Input */}
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white border outline-none rounded-md py-3 w-full px-4 mb-3 focus:ring-2 focus:ring-[#572c5f] transition-all duration-300 shadow-sm hover:shadow-lg"
          />
          {errors.email && <p className="text-red-500 text-md">{errors.email}</p>}

          {/* Password Input */}
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white border outline-none rounded-md py-3 w-full px-4 mb-3 focus:ring-2 focus:ring-[#572c5f] transition-all duration-300 shadow-sm hover:shadow-lg"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <button
            type="submit"
            className="bg-[#572c5f] hover:bg-[#6b3b70] text-white font-semibold py-3 rounded-md w-full transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            Login
          </button>

          <p className="text-center mt-4 text-sm">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="hover:underline text-[#572c5f] font-medium"
            >
              Sign Up
            </a>
          </p>
          <p className="text-center mt-4">
            <a href="/forgot-password" className="text-[#572c5f] hover:underline">
              Forgot Password?
            </a>
          </p>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleResponse}
              onError={handleGoogleError}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
