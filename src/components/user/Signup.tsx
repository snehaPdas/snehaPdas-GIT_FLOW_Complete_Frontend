import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { setUser } from '../../features/user/userSlice';
import { User } from "../../features/user/userTypes";
import { ReactReduxContext } from 'react-redux';
import { registerUser } from "../../actions/userActio";
import sign_img from "../../assets/yoga_curly.jpg"; // Your background image
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import login_img from "../../assets/login_back.jpg"

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmpassword?:string
}

function Signup() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmpassword, setConfirmpassword] = useState<string>("");

  const [errors, setErrors] = useState<Errors>({});

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.user);

  const validate = (): Errors => {
    const newErrors: Errors = {};
    if (!name.trim()) {
      newErrors.name = "Please fill the name field";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Please fill the email field";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Valid email is required";
    }
    if (!phone.trim()) {
      newErrors.phone = "Please fill the phone field";
    } else if (!phone.match(/^\d{10}$/)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (!password.trim()) {
      newErrors.password = "Please fill the password field";
    } else if (!password.match(/^(?=.*[A-Z])(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/) ){
      newErrors.password = "Password must have one uppercase,one special character minimul length 8";
    }
    if (!confirmpassword.trim()) {
      newErrors.confirmpassword = "Please fill the confirm password field";
    } else if (password!==confirmpassword) {
      newErrors.password = "Confirm password is incorrect";
    }
    return newErrors;
  };

  const clearErrors = () => {
    setTimeout(() => {
      setErrors({});
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) {
      clearErrors();
      return;
    }
    setErrors({});
    const userData: User = {
      name,
      email,
      phone,
      password,
      confirmpassword,
      height: '',
      weight: ''
    };

    try {
      const action = await dispatch(registerUser(userData));

      if (registerUser.rejected.match(action)) {
        const message = "Email Already Exist";
        toast.error(message);
        setErrors((prev) => ({ ...prev }));
        return;
      }

      navigate("/otp", { state: userData });
    } catch (error: any) {
      console.error("Error during registration:", error);

      if (error.response) {
        if (error.response.status === 409) {
          toast.error(error.response.data.message);
          setErrors((prev) => ({
            ...prev,
            email: "Email already exists",
          }));
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error("Something went wrong, try again later");
      }
    }
  };

  let accesstoken=localStorage.getItem("accesstoken")
  
  useEffect(()=>{
      if(accesstoken){
          navigate("/home",{replace:true})
      }
  },[accesstoken,navigate])

  return (
    // <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-500 via-[#572c5f] to-gray-200">
    <div
    className="flex justify-center items-center h-screen p-10 bg-cover bg-center"
    style={{
      backgroundImage: `url(${login_img})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div className="grid md:grid-cols-2 grid-cols-1 max-w-3xl w-full opacity-100 bg-white rounded-3xl shadow-xl overflow-hidden relative z-10">
        {/* Left Side - Signup Form */}
        <div className="flex justify-center items-center p-8 md:p-10">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <h1 className="text-center font-extrabold text-4xl text-[#572c5f] mb-6">Create an Account</h1>
  
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-100 border border-gray-300 outline-none rounded-md py-3 px-4 w-full transition duration-200 focus:ring-2 focus:ring-[#572c5f] mb-3"
            />
            {errors.name && (<p className="text-red-500 text-sm">{errors.name}</p>)}
  
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-100 border border-gray-300 outline-none rounded-md py-3 px-4 w-full transition duration-200 focus:ring-2 focus:ring-[#572c5f] mb-3"
            />
            {errors.email && (<p className="text-red-500 text-sm">{errors.email}</p>)}
  
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-gray-100 border border-gray-300 outline-none rounded-md py-3 px-4 w-full transition duration-200 focus:ring-2 focus:ring-[#572c5f] mb-3"
            />
            {errors.phone && (<p className="text-red-500 text-sm">{errors.phone}</p>)}
  
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-100 border border-gray-300 outline-none rounded-md py-3 px-4 w-full transition duration-200 focus:ring-2 focus:ring-[#572c5f] mb-3"
            />
            {errors.password && (<p className="text-red-500 text-sm">{errors.password}</p>)}
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmpassword}
              onChange={(e) => setConfirmpassword(e.target.value)}
              className="bg-gray-100 border border-gray-300 outline-none rounded-md py-3 px-4 w-full transition duration-200 focus:ring-2 focus:ring-[#572c5f] mb-3"
            />
            {errors.confirmpassword && (<p className="text-red-500 text-sm">{errors.confirmpassword}</p>)}
  
            <button
              type="submit"
              className="bg-[#572c5f] text-white font-semibold py-3 rounded-md w-full transition duration-200 hover:bg-opacity-75"
            >
              Sign Up
            </button>
  
            <p className="text-center text-[#572c5f] mt-4 text-sm">
              Already have an account?{" "}
              <a href="/login" className="hover:underline">Log In</a>
            </p>
          </form>
        </div>
  
      
        <div className="relative opacity-100">
          <img
            src={sign_img}
            alt="Yoga Illustration"
            className="w-full h-full object-cover object-center rounded-l-3xl"
          />
        </div>
      </div>
    </div>
  );
  
}

export default Signup;
