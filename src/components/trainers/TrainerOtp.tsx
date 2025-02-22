import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch, UseDispatch,useSelector } from "react-redux";
import { AppDispatch,RootState } from "../../app/store";
import {Toaster,toast } from 'react-hot-toast'
import resendOtp from "../../services/userServices"
import TrainerService from "../../services/TrainerService";
import axios from "axios";
import API_URL from '../../../axios/API_URL';





function TrainerOtp() {
  const[otp,setOtp]=useState<string[]>(Array(4).fill(""))
  const[isButtonDisabled,setIsButtonDisabled]=useState(false)
  const[timer,setTimer]=useState(30)
  const location = useLocation()
  const trainerData=location.state
  const dispatch=useDispatch<AppDispatch>()
  
  const navigate=useNavigate()



  useEffect(()=>{
    if(isButtonDisabled){
      const interval=setInterval(()=>{
        setTimer((prev)=>{
          if(prev===1){
            clearInterval(interval)
            setIsButtonDisabled(false)
            return 0
          }
          return prev-1
        })
      },1000)
    }
  },[isButtonDisabled])
  const handleclick=async (e:React.MouseEvent<HTMLButtonElement>):Promise<void>=>{
    e.preventDefault()
       try{
    
      const otpString=otp.join("")
      let action=await TrainerService.verifyOtp({trainerData,otp:otpString})
      
       
        toast.success("otp verified suceessfully");
        navigate("/trainer/login")
       
    
  }catch(error:any){
    if(error.response){
       console.error("error in otp verification",error)
       if (error.response) {
        const errorMessage = error.response.data?.message || "Something went wrong!";
        toast.error(errorMessage); 

    }else{
        toast.error("An unexpected error occurred. Please try again.");

    }
    }

  }
  }
  const handleResendOtp=async()=>{
    try {
      setIsButtonDisabled(true)
      setTimer(30)
      await axios.post(`${API_URL}/api/trainer/resend-otp`, { email: trainerData.email });

      toast.success("Otp sent successfully")
      
      
    } catch (error) {
      console.error("error in sending Otp",error)
      toast.error("failed to send Resend otp")
    }
  }
  function handleChange(value: string, index: number): void {
    const newOtp=[...otp]
    newOtp[index]=value
    setOtp(newOtp)
    
  } 
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-600 via-[#461b46] to-gray-400">

    {/* <div className="min-h-screen bg-slate-100 flex justify-center items-center"> */}
  <div className="w-full sm:w-[300px] bg-white p-6 rounded-xl shadow-lg">
    <h2 className="text-2xl font-semibold text-[#572c5f] text-center mb-6">
      Enter OTP
    </h2>
    <p className="text-center text-[#572c5f] mb-8">
      Please enter the 4-digit OTP sent to your mobile number.
    </p>
    <div className="flex justify-between space-x-2">
      {
        otp.map((value,index)=>(
        <input
           key={index}
          type="text"
          maxLength={1}
          value={value}
          onChange={(e)=>handleChange(e.target.value,index)}
          className="w-12 h-12 border border-[#572c57] rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#572c5f]"
        />)
        )
        
      }
      
      </div>
    <button
    onClick={handleclick}
      type="button"
      className="w-full mt-6 py-2 bg-[#572c5f] text-white rounded-md hover:bg-[#7a476e] focus:ring-2 focus:ring-[#572c5f]"
    >
      Verify OTP
    </button>
        <button
          className="btn btn-secondary mt-3">
        </button>
    <p className="mt-4 text-center text-[#3f3940] text-sm">
      Didn't receive the code? 
      <button 
      onClick ={handleResendOtp}
      disabled={isButtonDisabled}className={`ml-2 text-[#572c5f] hover:underline ${
              isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`} >
        {isButtonDisabled?`Resend OTP in ${timer}s`:"Resend OTP"}
        </button>
    </p>
  </div>
{/* </div> */}
</div>

  );
}

export default TrainerOtp;
