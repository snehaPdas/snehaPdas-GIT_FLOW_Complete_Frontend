import { createAsyncThunk } from "@reduxjs/toolkit";
import {User} from "../features/user/userTypes"
import userService from "../services/userServices"


export const registerUser=createAsyncThunk(
    "user/signup",
    async(userDetails:User,thunkAPI)=>{
     try{
    const response=await userService.register(userDetails)
    return response

     }catch(error:any){
        if (error.response && error.response.status === 409) {
             
            return thunkAPI.rejectWithValue(error.response.data.message || "Email already exists");
          }
        return thunkAPI.rejectWithValue(error.response?.data);
     }
    }
)

interface VerifyOtpArgs{
userData:User;
otp:string
}
export const verifyOtp=createAsyncThunk(
    "user/otp",
    async({userData,otp}:VerifyOtpArgs,thunkAPI)=>{

        try {
            const response=await userService.verifyOtp({userData,otp})
            return response
        } catch (error:any) {
            return thunkAPI.rejectWithValue(error.response.data)
            
        }
    }

)

export const verifyForgotOtp=createAsyncThunk(
  "user/otp",
  async({userData,otp}:VerifyOtpArgs,thunkAPI)=>{

      try {
        
          const response=await userService.verifyForgotOtp({userData,otp})
        
      
          return response
      } catch (error:any) {
        console.log("response----",error)
          return thunkAPI.rejectWithValue(error.response.data)
          
      }
  }

)


interface LoginUserArgs{
    email:string,
    password:string
}




export const loginUser=createAsyncThunk(
    "user/login",
    async({email,password}:LoginUserArgs,thunkAPI)=>{
    
        try {
            const response=await userService.loginUser({email,password})  
            
      
            return response
        } catch (error:any) {
          
                 
                const errorMessage = error.data?.message || "login failed";
                console.log("error message--------",errorMessage)

          return   thunkAPI.rejectWithValue(errorMessage)
        }
    }
)

  
  export const GoogleLogins = createAsyncThunk<User | null, string, { rejectValue: string }>(
    "user/googlesignup",
    async (token, thunkAPI) => {
      try {
        const response = await userService.googleAuth(token);
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message || "An unknown error occurred");
      }
    }
  );

  
  
  