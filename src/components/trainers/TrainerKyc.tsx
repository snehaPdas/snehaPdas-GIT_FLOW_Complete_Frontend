import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from "../../app/store";
import { submitKyc } from "../../actions/TrainerAction";
import Loading from "../spinner/loading";

function TrainerKyc() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    adhar: null,
    adharback: null,
    certificate: null,
    profileImage: null,
  });

  const [previews, setPreviews] = useState<Record<string, string | null>>({
    adhar: null,
    adharback: null,
    certificate: null,
    profileImage: null,
  });

  // Define errors as a record with string keys and string values
  const [errors, setErrors] = useState<Record<string, string>>({
    name: '',
    email: '',
    phone: '',
    profileImage: '',
    adhar: '',
    adharback: '',
    certificate: '',
  });

  const { trainerInfo, loading } = useSelector((state: RootState) => state.trainer);
  const trainer_id = trainerInfo.id;
  const dispatch = useDispatch<AppDispatch>();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    let validationErrors: Record<string, string> = {};

    if (!formData.name) validationErrors.name = "Please enter your full name.";
    if (!formData.email) validationErrors.email = "Please enter a valid email address.";
    if (!formData.phone) validationErrors.phone = "Please enter your phone number.";

    if (!formData.profileImage) validationErrors.profileImage = "Upload your profile image.";
    if (!formData.adhar) validationErrors.adhar = "Upload your Adhar image.";
    if (!formData.adharback) validationErrors.adharback = "Upload Adhar Back image.";
    if (!formData.certificate) validationErrors.certificate = "Upload Certificate image.";

    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const form = new FormData();
    form.append("trainer_id", trainer_id!);
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('phone', formData.phone);
    if (formData.adhar) form.append('adhar', formData.adhar);
    if (formData.adharback) form.append('adharback', formData.adharback);
    if (formData.certificate) form.append('certificate', formData.certificate);
    if (formData.profileImage) form.append('profileImage', formData.profileImage);

    try {
      await dispatch(submitKyc({ formData: form }));
    } catch (error) {
      console.error("Error submitting KYC:", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white p-4">
      {loading && <Loading />}
      <form
        onSubmit={handleSubmit}
        className="bg-[#f4f0ec] p-6 rounded-lg shadow-lg max-w-5xl w-full"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold text-[#572c52] mb-4 text-center">
          Verification Form
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-[#572c52] mt-6 mb-2">Upload Documents</h3>
        <div className="grid grid-cols-2 gap-4">
          {['profileImage', 'adhar', 'adharback', 'certificate'].map((field) => (
            <div key={field} className="flex flex-col items-center">
              <label className="block text-sm font-medium text-[#572c52]
               mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type="file"
                id={field}
                name={field}
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              {previews[field] && (
                <img
                  src={previews[field]!}
                  alt={`${field} preview`}
                  className="mt-2 w-16 h-16 object-cover border"
                />
              )}
              {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-[#572c52] text-white rounded-md hover:bg-[#572c52]"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default TrainerKyc;
