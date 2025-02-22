import React, { useState } from 'react';
import TrainerService from '../../services/TrainerService';
import { useLocation } from 'react-router-dom';
import { toast} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function TrainerResetPassword() {
  const [newPassword, setNewPassword] = useState<string>('');
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const location=useLocation()
  const userData=location.state
  const navigate=useNavigate()

  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!!!');
      return;
    }
    try {
      const payload:any = { newPassword};
      

      const response = await TrainerService.resetPassword(userData,payload);
      
        if(response.message === "Password reset successfully"){
          toast.success("Your Password Reset Successfully")
          navigate("/trainer/login")

        }
        
      
    } catch (error) {
      setError('Failed to reset password. Please try again later.');
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-300 via-[#321038] to-gray-200">

    <form
      onSubmit={handlesubmit}
      className="max-w-sm mx-auto mt-10 p-6 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-bold text-center text-[#572c52] mb-6">
        Reset Password
      </h2>
      <div className="mb-4">
        <label
          htmlFor="resetpswd"
          className="block text-sm font-medium text-gray-600 mb-2"
        >
          Please Enter Your New Password
        </label>
        <input
          type="password"
          id="resetpswd"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#572c52] focus:border-[#572c52]"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="confirmpswd"
          className="block text-sm font-medium text-gray-600 mb-2"
        >
          Pleae Enter Your Confirm Password
        </label>
        <input
          type="password"
          id="confirmpswd"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#572c52] focus:border-[#572c52]"
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-[#572c52] text-white font-semibold rounded-md shadow hover:bg-[#572c52] focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Reset Password
      </button>
    </form>
    </div>
  );
}

export default TrainerResetPassword;
