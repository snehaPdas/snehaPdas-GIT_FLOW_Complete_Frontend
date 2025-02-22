import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch, UseDispatch,useSelector } from "react-redux";
import { AppDispatch,RootState } from "../../app/store";
import { verifyOtp } from "../../actions/userActio";
import {Toaster,toast } from 'react-hot-toast'
import resendOtp from "../../services/userServices"
import userService from "../../services/userServices";


function Otp() {
  const[otp,setOtp]=useState<string[]>(Array(4).fill(""))
  const[isButtonDisabled,setIsButtonDisabled]=useState(false)
  const[timer,setTimer]=useState(30)
  const [otpTimer, setOtpTimer] = useState(60); 

  const location = useLocation()
  const userData=location.state
  const dispatch=useDispatch<AppDispatch>()
  
  const navigate=useNavigate()

  useEffect(() => {
    const otpInterval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev === 1) {
          clearInterval(otpInterval);
          toast.error("OTP expired, please request a new one.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(otpInterval);
  }, []);

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
      let action=await dispatch(verifyOtp({userData,otp:otpString}))
  
    if(verifyOtp.rejected.match(action)){
      const message  = "otp is invalid";
              toast.error(message);
              return;
    }
    navigate("/login")
  }catch(error:any){
    if(error.response){
       console.error("error in otp verification",error)
       if (!error.response) {
        toast.error("Something went wrong, try again later");
      }
    }

  }
  }
  const handleResendOtp=async()=>{
    try {
      setIsButtonDisabled(true)
      setTimer(30)
      toast.success("Otp sent successfully")
      await userService.resendOtp(userData.email)
      
    } catch (error) {
      console.error("error in sending Otp",error)
      toast.error("failed to send Resend otp")
    }
  }
  function handleChange(value: string, index: number): void {
    setOtp(prevOtp => {
      const newOtp = [...prevOtp];
      console.log("new otp",newOtp)
      newOtp[index] = value;
      console.log("new otp..........",newOtp)

      return newOtp;
    });
  }
  
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-300 via-[#321038] to-gray-200">

    {/* <div className="min-h-screen bg-slate-100 flex justify-center items-center"> */}
  <div className="w-full sm:w-[300px] bg-white p-6 rounded-xl shadow-lg">
    <h2 className="text-2xl font-semibold text-[#572c5f] text-center mb-6">
      Enter OTP
    </h2>
    <p className="text-center text-gray-500 mb-8">
      Please enter the 4-digit OTP sent to your mobile number.
    </p>
    <p className="text-center text-red-500 font-semibold">
          OTP expires in: {otpTimer}s
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
          className="w-12 h-12 border border-[#572c5f] rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#572c5f]"
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
    <p className="mt-4 text-center text-gray-500 text-sm">
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

export default Otp;
