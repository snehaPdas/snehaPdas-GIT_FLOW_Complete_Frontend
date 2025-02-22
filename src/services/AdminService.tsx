import adminAxiosInstance from "../../axios/adminAxiosInstance";
import API_URL from "../../axios/API_URL";

const loginAdmin=async({email,password}:{email:string,password:string})=>{
    
    try{
  const  response= await adminAxiosInstance.post(`${API_URL}/api/admin/loginadmin`,{email,password})   
    
    return response.data
    }catch(error:any){
        const errorMessage =
        error.response?.data?.message || "Admin login failed.";
      const statusCode = error.response?.status || 500;
  
      console.error("Admin Login Error:", errorMessage);
  
      throw {
        message: errorMessage,
        status: statusCode,
      };
    }

}
const addSpecialization=async(formData:any)=>{

 console.log(Array.from(formData.entries()))
try {
  const response= await adminAxiosInstance.post(`${API_URL}/api/admin/specialization`,formData)
  console.log("got response from speciali",response)
  return response
} catch (error:any) {
  console.log("Error in addspecialization",error)
  throw error.response? error.response.data:new Error("An unexpected error")
  
}
}

const getSpecializations = async () => {
  try {
    const response = await adminAxiosInstance.get(`${API_URL}/api/admin/specialization`); // Adjust URL based on your backend
    return response;
  } catch (error) {
    console.error("Error fetching specializations:", error);
    throw error;
  }
}

  const updateSpecialization = async (id: string, formData: { name: string; description: string ,image:string}| FormData) => {
    try{
     
      const response= await adminAxiosInstance.put(`${API_URL}/api/admin/specialization/${id}`, formData);
      console.log(response)
        return response
    
    }catch(error){
      console.log("Error in frontend service",error)
    }
 
};



const adminService={
    loginAdmin,
    addSpecialization,
    getSpecializations,
    updateSpecialization
}

export default adminService