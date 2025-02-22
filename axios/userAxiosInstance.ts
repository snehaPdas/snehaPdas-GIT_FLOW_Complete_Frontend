import axios,{AxiosResponse,AxiosError,InternalAxiosRequestConfig} from "axios"
import { Toaster } from "react-hot-toast"

import API_URL from "./API_URL"
import toast from "react-hot-toast"

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig{
    _retry?:boolean
}

const userAxiosInstance=axios.create({
    baseURL:API_URL,
    withCredentials:true
})

//request user interceptors 

userAxiosInstance.interceptors.request.use((config:CustomAxiosRequestConfig)=>{
    const token=localStorage.getItem("accesstoken")
    if(token){
        config.headers["Authorization"]=`Bearer ${token}`
    }
    return config
},
(error)=>{
    console.log("error in protected route",error)
    return Promise.reject(error)
}
)

//response

userAxiosInstance.interceptors.response.use((Response:AxiosResponse)=>{
    console.log("ya here in axios instance response")
    return Response
},
async (error:AxiosError)=>{
    console.log("error in protected route",error)
    
    
    const originalRequest = error.config as CustomAxiosRequestConfig;
     

    //blocked check
    if (error.response?.status === 403 ) {
        
       // toast.success("entered to block")
       console.log("user has been blocked by admin")
        console.warn("User is blocked, redirecting to login...");
        window.location.href = "/home";
        return Promise.reject(error);
    }

    if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            
            const response= await userAxiosInstance.post<{accessToken:string}>("/api/user/refresh-token",{},{withCredentials:true})
            const {accessToken}=response.data
            localStorage.setItem("accesstoken",accessToken)
            console.log("Access token stored:", localStorage.getItem("accesstoken"));

            return userAxiosInstance(originalRequest)
        } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            return Promise.reject(refreshError);

        }
    }
     

    
    return Promise.reject(error);

}


)

export default userAxiosInstance
