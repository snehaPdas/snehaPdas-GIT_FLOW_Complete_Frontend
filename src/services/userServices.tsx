import {User} from "../features/user/userTypes"
import API_URL from "../../axios/API_URL"
import axios from "axios"
import userAxiosInstance from "../../axios/userAxiosInstance"

const register = async (userDetails: User) => {
    try {
    
        const response = await axios.post(`${API_URL}/api/user/signup`, userDetails, {
            withCredentials: true,  // Ensure credentials are sent correct
            headers: {
                'Content-Type': 'application/json'
            }
        }); 
        return response.data; // Return just the data if that's what need
    } catch (err: any) {
    const errorMessage = err.response?.data?.message || "Registration failed";
        console.log(err);
        throw new Error(errorMessage);
        
};
    
}

const verifyOtp=async({ userData, otp,}:{userData:User;otp:string})=>{

   try{

    const response=await axios.post(`${API_URL}/api/user/otp`,{userData,otp})
    
    
    if(response.data){
        localStorage.setItem("user",JSON.stringify(response.data))
    }
    return response.data
   }catch(error:any){
       const errormessage=error.response?.data?.message
       console.log(error)
       throw new Error(errormessage);

   }

}

const verifyForgotOtp=async({ userData, otp,}:{userData:User;otp:string})=>{

    try{
 
     const response=await axios.post(`${API_URL}/api/user/forgototp`,{userData,otp})
     
    
     if(response.data){
         localStorage.setItem("user",JSON.stringify(response.data))
     }
     return response.data
    }catch(error:any){
        const errormessage=error.response?.data?.message
        console.log(error)
        throw new Error(errormessage);
 
    }
 
 }
 

const resendOtp=async( useremail:string)=>{
    
    try{
const response=await axios.post(`${API_URL}/api/user/resendotp`,{useremail})
if(response.data){
    
    return response.data
}
    }catch(error:any){
        const errormessage=error.response?.data?.message
        console.log(error)
        throw new Error(errormessage);
    }
}

const loginUser=async({email,password}:{email:string,password:string})=>{              
    try {
        const response=await userAxiosInstance.post(`${API_URL}/api/user/loginuser`,{email,password})
          
        const accessToken  = response.data.token

        localStorage.setItem("accesstoken", response.data.token);
        
        return response
    } catch (error:any) {
        const errormessage=error.response?.data?.message|| "login failed"
        throw {
            message: errormessage, 
            status: error.response?.status || 500, 
            data: error.response?.data || null, 
            originalError: error, };
    }
}

const googleAuth=async(token:string)=>{
    try {
    
        const response=await axios.post(`${API_URL}/api/user/googlesignup`,{token},{
            headers: { "Content-Type": "application/json" },
        })
        
        return response
    } catch (error:any) {
           const errormessage=error.response?.data?.message|| " token failed.."
           console.log(error)
           throw new Error(errormessage);
    }

    
}
const forgotPassword=async(emailData:string)=>{
    try {
    
         const response=await userAxiosInstance.post(`${API_URL}/api/user/forgotpassword`,{emailData})
         
         return response.data
    } catch (error) {
        console.log("Forgot Password Error",error)
    }

}
const resetPassword=async(  userData:string,payload:string )=>{
   try {

    const response=await userAxiosInstance.post(`${API_URL}/api/user/resetpassword`,{payload,userData})
    
    return response.data
   } catch (error) {
     console.log("error in ResetPassword",error)
   }
}


const userService={
    register,
    verifyOtp,
    loginUser,
    googleAuth,
    resendOtp,
    forgotPassword,
    verifyForgotOtp,
    resetPassword
}




export default userService;
function async(arg0: { userData: any; otp: any; }, arg1: { userData: { new(): UserActivation; prototype: UserActivation; }; otp: any; }) {
    throw new Error("Function not implemented.");
}

