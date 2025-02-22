import React, { useState } from 'react'
import TrainerService from '../../services/TrainerService'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function TrainerForgotPassword() {
const[email,setEmai]=useState("")
const navigate=useNavigate()

const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    try {
        const emailData:string=email
        let action=await TrainerService.forgotPassword(emailData)
        
        if(action.statusCode===200){
        toast.success("Email verified successfully")
        navigate("/trainer/trainer-forgotpswdOtp",{ state: emailData })
        }
       
    } catch (error) {
        console.log("error",error)
        toast.error("Invalid Email Address!!")
    }
}

  return (
     <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-500 via-[#572c5f] to-gray-400">

{/* <div className="min-h-screen bg-gray-100 flex items-center justify-center"> */}
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md w-full">
        <h1 className="text-center text-2xl text-[#572c52] font-bold mb-6">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
            <div className="mb-4" >
                <label className="block text-[#572c52] font-bold mb-2" htmlFor="email">
                    Email Address
                </label>
                <input type="email"
                  value={email}
                  onChange={(e)=>setEmai(e.target.value)}
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email"  placeholder="Enter your email address" />
            </div>
            <button className="bg-[#572c52] hover:bg-[#572c52] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">
                Reset Password
            </button>
        </form>
    </div>
{/* </div> */}
</div>

  )
}

export default TrainerForgotPassword
