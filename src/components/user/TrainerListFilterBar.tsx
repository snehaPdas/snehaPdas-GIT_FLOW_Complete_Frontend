import React, { useEffect, useState } from "react";
import { TrainerListFilterBarProps } from "../../types/trainer";
import axios from "../../../axios/userAxiosInstance";
import API_URL from "../../../axios/API_URL";
import { Specialization } from "../../types/trainer";
import { useNavigate } from "react-router-dom";


function TrainerListFilterBar({ onFilterChange }:TrainerListFilterBarProps) {
  const [filters, setFilters] = useState({
    specialization: [],
    // gender: "",
    // priceRange: [0, 100],
    // language: "",
  });

  const[specializations,setSpecializations]=useState<Specialization[]>([])
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [displayLimit, setDisplayLimit] = useState(4);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate=useNavigate()

useEffect(()=>{

 const getspecializations=async()=>{
    try {
      const response=await axios.get(`${API_URL}/api/user/specializations`)
      
      setSpecializations(response.data)
    } catch (error) {
      console.log("error in fetching specialisation:",error)
    }
  }
  getspecializations()
},[])



  const handleFilterChange = (type: string, value: string ) => {
 
 let updatedSelectedvalue:string[] = [];
 if(type==="specialization"){
 updatedSelectedvalue=selectedSpecializations.includes(value)?selectedSpecializations.filter((id)=>id!==value):[...selectedSpecializations,value]
  console.log("updated val=",updatedSelectedvalue)
  setSelectedSpecializations(updatedSelectedvalue)

 }
 const params=new URLSearchParams(window.location.search)
  if(type&& updatedSelectedvalue.length>0){
    params.set(type,updatedSelectedvalue.join(","))

  }else{
    params.delete(type)
  }
  console.log("Updated Params:", params.toString());

  navigate(`/trainers?${params.toString()}`)
  
  };


  
  // url search

  
  const handleToggleDisplay = () => {
  
    if (isExpanded) {
      setDisplayLimit(4);
    } else {
      setDisplayLimit(specializations.length);
    }
    setIsExpanded(!isExpanded);
  };


  return (
    <div className="bg-[#9f909d] shadow-lg rounded-lg p-4 space-y-6 mt-10">
      <h2 className="text-2xl font-semibold text-white">Filter Trainers</h2>

      {/* Specialization Filter */}
      
      <div className="flex flex-col">
    <label className="text-sm font-medium text-[#572c52] mb-1">
      Specialization
    </label>
  
      {specializations.slice(0,displayLimit).map((spec) => (
      <div key={spec._id} className="flex items-center space-x-2">
      <input
        type="checkbox"
        value={spec._id}
        checked={selectedSpecializations.includes(spec._id)}
        onChange={(e) => handleFilterChange("specialization", spec._id)}
        className="rounded border-gray-300 text-[#572c52]"
      />
      <label className="text-sm text-white">{spec.name}</label>
    </div>
      ))}
       {specializations.length > 4 && (
            <div>
              <button
                className="text-sm font-medium text-[#572c52]"
                onClick={handleToggleDisplay}
              >
                {isExpanded ? "SEE LESS" : "SEE MORE"}
              </button>
            </div>
          )}
    


  </div>
  {/* ////////////////////////////////////////////////// */}
      {/* <div className="flex flex-col">
        <label className="text-sm font-medium text-[#572c52] mb-1">
          Year of Experience
        </label>
        <input
          type="range"
          min="0"
          max="200"
          value={filters.priceRange[1]}
          onChange={(e) =>
            handleFilterChangeexp("priceRange", [0, parseInt(e.target.value)])
          }
          className="w-full"
        />
        <div className="flex justify-between text-sm text-white mt-1">
          <span>0</span>
          <span>${filters.priceRange[1]}</span>
        </div>
      </div> */}
      {/* /////////////////////////////////////////////////////////////////////// */}

      {/* Gender Filter */}
      {/* <div className="flex flex-col">
        <label className="text-sm font-medium text-[#572c52] mb-1">Gender</label>
        <select
          value={filters.gender}
          onChange={(e) => handleFilterChange("gender", e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#572c52]"
        >
          <option value="">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div> */}

      {/* Price Range Filter */}
      {/* <div className="flex flex-col">
        <label className="text-sm font-medium text-[#572c52] mb-1">
          Price Range
        </label>
        <input
          type="range"
          min="0"
          max="200"
          value={filters.priceRange[1]}
          onChange={(e) =>
            handleFilterChange("priceRange", [0, parseInt(e.target.value)])
          }
          className="w-full"
        />
        <div className="flex justify-between text-sm text-white mt-1">
          <span>$0</span>
          <span>${filters.priceRange[1]}</span>
        </div>
      </div> */}

      {/* Language Filter */}
      {/* <div className="flex flex-col">
        <label className="text-sm font-medium text-[#572c52] mb-1">
          Languages spoken
        </label>
        <select
          value={filters.language}
          onChange={(e) => handleFilterChange("language", e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#572c52]"
        >
          <option value="">All</option>
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
          <option value="french">French</option>
          <option value="hindi">Hindi</option>
        </select>
      </div> */}
    </div>
  );
}

export default TrainerListFilterBar;
