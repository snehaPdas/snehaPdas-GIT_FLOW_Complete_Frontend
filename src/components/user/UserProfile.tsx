import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import userAxiosInstance from "../../../axios/userAxiosInstance";
import API_URL from "../../../axios/API_URL";
import { toast } from "react-hot-toast";
import { User } from "../../features/user/userTypes";

function UserProfile() {
  const [editOpen, setEditOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<User>({
    id: "",
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmpassword:"",
    dob: "",
    gender: "",
    height: "",
    weight: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "",
    height: "",
    weight: "",
  });

  useEffect(() => {
    const tokenString = localStorage.getItem("accesstoken");
    if (tokenString) {
      try {
        const decodedToken: any = jwtDecode(tokenString);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async () => {
      try {
        const response = await userAxiosInstance.get(`${API_URL}/api/user/users/${userId}`);
        setFormData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data");
      }
    };

    fetchUserDetails();
  }, [userId]);

  const validate = () => {
    let valid = true;
    let newErrors = { name: "", phone: "", dob: "", gender: "", height: "", weight: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
      valid = false;
    }

    if (!formData.height?.trim() || isNaN(Number(formData.height)) || Number(formData.height) <= 0 || Number(formData.height) > 300) {
      newErrors.height = "Please enter a valid height (between 1 cm and 300 cm).";
      valid = false;
    }
  
    if (!formData.weight?.trim() || isNaN(Number(formData.weight)) || Number(formData.weight) <= 0 || Number(formData.weight) > 500) {
      newErrors.weight = "Please enter a valid weight (between 1 kg and 500 kg).";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "phone" && !/^\d*$/.test(value)) return;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value.trim(),
    }));
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const updatedData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => value !== "")
      );

      const response = await userAxiosInstance.patch(`${API_URL}/api/user/users`, updatedData);
      if (response.status === 200) {
        toast.success("User Data Updated Successfully");
        setEditOpen(false);
      } else {
        toast.error("Some Error occurred");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update user data");
    }
  };

  return (
    <div className="flex justify-center mt-7">
      {!editOpen ? (
        <div className="h-[75vh] bg-white w-[75%] shadow-md rounded-md overflow-y-auto">
          <h1 className="p-5 font-bold text-2xl text-[#572c52] text-center">Personal Information</h1>
          <div className="mt-1 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
            {["name", "email", "phone", "dob", "gender", "height", "weight"].map((field) => (
              <div key={field}>
                <label className="block mb-1 font-medium text-gray-700">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <div className="border border-gray-500 p-2 rounded-md">
                  <h1 className="text-[#572c52]">
                  {field === "height"
            ? `${formData[field as keyof User] || "Not Specified"} cm`
            : field === "weight"
            ? `${formData[field as keyof User] || "Not Specified"} kg`
            : formData[field as keyof User] || "Not Specified"}
                  </h1>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end p-8">
            <button
              onClick={() => setEditOpen(true)}
              className="bg-[#846681] text-white py-3 px-6 rounded-md hover:bg-[#9a428e] font-medium"
            >
              Edit
            </button>
          </div>
        </div>
      ) : (
        <div className="h-[75vh] bg-white w-[75%] shadow-md rounded-md overflow-y-auto">
          <h1 className="p-5 font-bold text-2xl">Edit Personal Information</h1>
          <form onSubmit={handleUpdate}>
            <div className="mt-5 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
              {["name", "email", "phone", "dob", "height", "weight", "gender"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {field === "gender" ? (
                    <select
                      name="gender"
                      value={formData.gender || ""}
                      onChange={handleChange}
                      className="border border-gray-500 p-2 rounded-md w-full"
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <input
                      type={field === "dob" ? "date" : "text"}
                      name={field}
                      value={formData[field as keyof User] || ""}
                      onChange={handleChange}
                      readOnly={field === "email"}
                      className="border border-gray-500 p-2 rounded-md w-full"
                    />
                  )}
                  {errors[field as keyof typeof errors] && (
                    <p className="text-red-500">{errors[field as keyof typeof errors]}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end p-8">
              <button type="submit" className="bg-[#572c52] text-white py-3 px-6 rounded-md hover:bg-[#572c52]">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
