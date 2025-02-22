import { createAsyncThunk } from "@reduxjs/toolkit";
import trainerService from '../services/TrainerService';


export interface ITrainer {
    trainerId?: string;
    name: string;
    phone: string;
    email: string;
    password: string;
    isBlocked?: boolean;
  }


  export const registerTrainer = createAsyncThunk(
    'trainer/signup',
    async (trainerData: ITrainer, thunkAPI) => {
      try {
      
        const response = await trainerService.registerTrainer(trainerData);
        
        return response
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        return thunkAPI.rejectWithValue(errorMessage);
      }
    }
  );

  interface LoginTrainerArgs{
    email:string,
    password:string
}


  

export const loginTrainer=createAsyncThunk(
  
  "trainer/login",
  async({email,password}:LoginTrainerArgs,thunkAPI)=>{

      try {
          const response=await trainerService.loginTrainer({email,password}) 
      
          return response

      } catch (error:any) {
        return   thunkAPI.rejectWithValue(error.response.data)
      }
  }
)

interface VerifyOtpArgs{
userData:any;
otp:string
}
export const verifyForgotOtp=createAsyncThunk(
  "trainer/otp",
  async({userData,otp}:VerifyOtpArgs,thunkAPI)=>{

      try {
          const response=await trainerService.verifyForgotOtp({userData,otp})
          return response
      } catch (error:any) {
          return thunkAPI.rejectWithValue(error.response.data)
          
      }
  }

)
export const submitKyc = createAsyncThunk(
  'trainer/kyc', 
  async ({ formData }: { formData: FormData }, thunkAPI) => {  // Accept FormData here
    console.log("FormData check:", Array.from(formData.entries()));
    try {
      const response = await trainerService.kycSubmission(formData); // Pass FormData
      console.log('response in submitkyc in action ', response);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getKycStatus = createAsyncThunk(
  'trainer/kycStatus',
  async (trainer_id: string, thunkAPI) => {
   try {


    const response = await trainerService.kycStatus(trainer_id)
    
     console.log("kyc status response action",response);
    
    return response
    
   } catch (error : any) {
    return thunkAPI.rejectWithValue(error.response)
    
   }
  }

)

