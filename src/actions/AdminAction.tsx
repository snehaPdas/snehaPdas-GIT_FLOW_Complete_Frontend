import { createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "../services/AdminService"


interface LoginAdmin {
    email: string;
    password: string;
  }


  export const adminLogin =createAsyncThunk("admin/login",async({email,password}:LoginAdmin,thunkAPI)=>{
    
    try {
        const response=await adminService.loginAdmin({email,password})
        return  {status:response.status,data:response.data}
    } catch (error:any) {
        return thunkAPI.rejectWithValue(error.response)
    }
  })

  