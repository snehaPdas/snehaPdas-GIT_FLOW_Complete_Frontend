
import axios from "axios";
import API_URL from "../../axios/API_URL";
import { Trainer } from "../features/trainer/TrainerType";
import trainerAxiosInstance from "../../axios/trainerAxiosInstance";



export interface ITrainer {
    trainerId?: string;
    name: string;
    phone: string;
    email: string;
    password: string;
    isBlocked?: boolean;
  }


  const registerTrainer = async (trainerData: ITrainer) => {
    try {
        const response=await axios.post(`${API_URL}/api/trainer/signup`,trainerData)

    } catch (error) {
        
    }
  }

  const verifyOtp=async({trainerData,otp}:{trainerData:Trainer,otp:string})=>{
  
    try {
      const response=await axios.post(`${API_URL}/api/trainer/otp`,{trainerData,otp})
      
      return response.data
      
    } catch (error:any) {
      console.error("Verify OTP Error:", error.response?.data || error.message);
      throw error

    }

  }
  const loginTrainer=async({email,password}:{email:string,password:string})=>{     
         
    try {
    
        const response=await trainerAxiosInstance.post(`${API_URL}/api/trainer/logintrainer`,{email,password})
        

        const accessToken  = response.data.token
        

        localStorage.setItem("trainer_access_token", accessToken);
        return response.data
        
    } catch (error:any) {
        const errormessage=error.response?.data?.message|| "login failed.."
        console.log(error)
        
        throw new Error(errormessage);
    }


}

const forgotPassword=async(emailData:string)=>{
  try {
  
     const response=await trainerAxiosInstance.post(`${API_URL}/api/trainer/forgotpassword`,{emailData})
     
     return response.data
} catch (error) {
    console.log("Forgot Password Error",error)
}
}
const resetPassword=async(  userData:string,payload:string )=>{
  try {
   
   const response=await trainerAxiosInstance.post(`${API_URL}/api/trainer/resetpassword`,{payload,userData})
  
   return response.data
  } catch (error) {
    console.log("error in ResetPassword",error)
  }
}

const verifyForgotOtp=async({ userData, otp,}:{userData:ITrainer;otp:string})=>{

  try{

   const response=await axios.post(`${API_URL}/api/trainer/forgototp`,{userData,otp})
   
   
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
const kycStatus = async (trainer_id: string) => {

  try {
    const response = await trainerAxiosInstance.get(`/api/trainer/kycStatus/${trainer_id}`);
    
    return response.data;
  } catch (error: any) {
    console.error(
      "Error during KYC status fetching:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
const kycSubmission = async (formData: FormData) => {
  try {
    const response = await trainerAxiosInstance.post(`/api/trainer/trainers/kyc`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  } catch (error: any) {
    console.error(
      "Error kyc submission trainer:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};



  const TrainerService = {
    registerTrainer,
    verifyOtp,
    loginTrainer,
    forgotPassword,
    resetPassword,
    verifyForgotOtp,
    kycStatus,
    kycSubmission
  }

  export default TrainerService;

  