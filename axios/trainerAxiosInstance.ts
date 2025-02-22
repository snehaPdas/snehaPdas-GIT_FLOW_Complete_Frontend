import axios,{AxiosResponse,AxiosError,InternalAxiosRequestConfig} from "axios"

import API_URL from "./API_URL"


interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig{
    _retry?:boolean
}

const trainerAxiosInstance=axios.create({
    baseURL:API_URL,
    withCredentials:true
})

//request user interceptors 

trainerAxiosInstance.interceptors.request.use((config:CustomAxiosRequestConfig)=>{
    const token=localStorage.getItem("trainer_access_token")
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

trainerAxiosInstance.interceptors.response.use((Response:AxiosResponse)=>{
    return Response
},
async (error:AxiosError)=>{
    console.log("error in protected route",error)
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            console.log("sample check for refreshtoken")
            const response= await trainerAxiosInstance.post<{accessToken:string}>("/api/trainer/refresh-token",{},{withCredentials:true})
            const {accessToken}=response.data
            localStorage.setItem("trainer_access_token",accessToken)
            console.log("Access token stored:", localStorage.getItem("trainer_access_token"));

            return trainerAxiosInstance(originalRequest)
        } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            return Promise.reject(refreshError);



        }
    }
    return Promise.reject(error);

}


)

export default trainerAxiosInstance
