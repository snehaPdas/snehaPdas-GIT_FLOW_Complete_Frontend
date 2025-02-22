import React, { useEffect, useState } from "react";
import trainer_img from "../../assets/training.png";
import login_img from "../../assets/login_back.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerTrainer } from "../../actions/TrainerAction";
import API_URL from "../../../axios/API_URL";
import { AppDispatch } from "../../app/store";

interface ISpecialization {
  _id: string;
  name: string;
}

function TrainerSignUp() {
  const [name, SetName] = useState<string>("");
  const [email, SetEmail] = useState<string>("");
  const [phone, SetPhone] = useState<string>("");
  const [password, SetPassword] = useState<string>("");
  const [confirmpassword,setConfirmPassword]=useState<string>("")
  const [specializations, setSpecializations] = useState<ISpecialization[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchSpecializations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/trainer/specializations`);
        setSpecializations(response.data.data);
      } catch (error) {
        console.error("Error fetching specializations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecializations();
  }, []);

  const validate = () => {
    const newErrors: any = {};
    if (!name) newErrors.name = "Full Name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!phone) {
      newErrors.phone = "Phone Number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Phone Number should be 10 digits";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (!password.match(/^(?=.*[A-Z])(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/)) {
      newErrors.password = "Password must have one uppercase,one special character minimul length 8";
    
    }
    if (!confirmpassword) {
      newErrors.confirmpassword = "confirm Password is required";
    } else if (password!==confirmpassword) {
      newErrors.confirmpassword = "confirm password is incorrect";
    }

    if (selectedSpecializations.length === 0) {
      newErrors.specializations = "At least one specialization is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSpecializationChange = (specName: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(specName)
        ? prev.filter((name) => name !== specName)
        : [...prev, specName]
    );
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      const trainerData = {
        name,
        email,
        phone,
        password,
        confirmpassword,
        specializations: selectedSpecializations,
      };
      await dispatch(registerTrainer(trainerData));
      navigate("/trainer/otp", { state: trainerData });
    }
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <div
      className="flex justify-center items-center h-screen p-10 bg-cover bg-center"
      style={{
        backgroundImage: `url(${login_img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="grid md:grid-cols-2 grid-cols-1 max-w-4xl w-full bg-gray-100 rounded-3xl shadow-lg overflow-hidden">
        <div className="p-10 flex flex-col justify-center items-center">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <h1 className="text-4xl font-bold text-center text-[#1f1822] mb-3">
              Trainer SignUp
            </h1>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => SetName(e.target.value)}
              className="bg-gray-100 border border-gray-300 rounded-md py-3 px-4 w-full focus:ring-2 focus:ring-[#572c5f]"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => SetEmail(e.target.value)}
              className="bg-gray-100 border border-gray-300 rounded-md py-3 px-4 w-full focus:ring-2 focus:ring-[#572c5f]"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => SetPhone(e.target.value)}
              className="bg-gray-100 border border-gray-300 rounded-md py-3 px-4 w-full focus:ring-2 focus:ring-[#572c5f]"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            <div className="relative">
              <button
                type="button"
                className="border border-gray-300 p-2 rounded-md w-full text-left focus:ring-2 focus:ring-[#572c5f]"
                onClick={toggleDropdown}
              >
                {selectedSpecializations.length > 0
                  ? selectedSpecializations.join(", ")
                  : "Select Specializations"}
              </button>
              {isDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                  {loading ? (
                    <div className="p-2 text-gray-500">Loading...</div>
                  ) : (
                    specializations.map((spec) => (
                      <div
                        key={spec._id}
                        className="p-2 hover:bg-gray-200 cursor-pointer flex items-center"
                        onClick={() => handleSpecializationChange(spec.name)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSpecializations.includes(spec.name)}
                          readOnly
                          className="mr-2"
                        />
                        {spec.name}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            {errors.specializations && (
              <p className="text-red-500 text-sm">{errors.specializations}</p>
            )}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => SetPassword(e.target.value)}
              className="bg-gray-100 border border-gray-300 rounded-md py-3 px-4 w-full focus:ring-2 focus:ring-[#572c5f]"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            <input
              type="password"
              placeholder="confirm Password"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-gray-100 border border-gray-300 rounded-md py-3 px-4 w-full focus:ring-2 focus:ring-[#572c5f]"
            />
            {errors.confirmpassword && <p className="text-red-500 text-sm">{errors.confirmpassword}</p>}

            <button
              type="submit"
              className="bg-[#572c5f] text-white font-semibold py-3 rounded-md w-full hover:bg-opacity-75"
            >
              Sign Up
            </button>
            <p className="text-center text-gray-500 mt-4">
              Already have an account?{" "}
              <a href="/trainer/login" className="text-[#572c5f] hover:underline">
                Log In
              </a>
            </p>
          </form>
        </div>
        <div className="hidden md:block">
          <img
            src={trainer_img}
            alt="Signup Illustration"
            className="w-full h-full object-cover rounded-r-3xl"
          />
        </div>
      </div>
    </div>
  );
}

export default TrainerSignUp;
