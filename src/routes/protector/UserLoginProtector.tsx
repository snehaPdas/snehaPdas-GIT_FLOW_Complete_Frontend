import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";
interface UserLoginProtectorProps {
    children: ReactNode; 
  }

const UserLoginProtector = ({children}:UserLoginProtectorProps)=>{
const navigate=useNavigate()
const userToken=localStorage.getItem("accesstoken")

useEffect(()=>{
    if(!userToken){
        navigate("/login",{replace:true})
    }
},[userToken,navigate])
if (userToken) {
    return children; 
  }
  return null
 }

export default UserLoginProtector