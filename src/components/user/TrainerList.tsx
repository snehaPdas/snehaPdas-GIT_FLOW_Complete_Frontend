import React, { useEffect, useState } from 'react';
import userAxiosInstance from '../../../axios/userAxiosInstance';
import API_URL from '../../../axios/API_URL';
import {Trainer} from "../../types/trainer"
import {useNavigate}  from 'react-router-dom';
import { useLocation } from "react-router-dom";

function TrainersList() {
    const[trainers,setTrainers]=useState<Trainer[]>([])
    const [trainersData, setTrainersData] = useState<Trainer[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [displayLimit, setDisplayLimit] = useState(6);

    const navigate=useNavigate()
    const location = useLocation();

    useEffect(()=>{
        
        async function fetchAllTrainers(){
            try {
                const response=await userAxiosInstance.get(`${API_URL}/api/user/trainers`)
             //   const trainersData=response.data
              //  setTrainers(trainersData)
              const trainers = response.data;

                
                const params=new URLSearchParams(window.location.search)
                console.log("Current URL search:", window.location.search);

                const selectedSpecialization=params.get("specialization")
                console.log("Selected Specialization from URL:", selectedSpecialization);

                const filteredTrainers = trainers.filter((trainer: { specializations: any[]; }) => {
                  const matchesSpecialization = selectedSpecialization
                  ? trainer.specializations?.some(spec => selectedSpecialization.includes(spec._id))
                  : true;
                
            return matchesSpecialization
                })
                setTrainersData(filteredTrainers);
                console.log("Filtered Trainers:", filteredTrainers);

            } catch (error) {
                console.log("error in fetching trainers",error)
            }
        }
        fetchAllTrainers()
    }, [location.search])
    const handleViewProfile = (trainerId: string) => {
      navigate(`/trainersprofileview/${trainerId}`);
    };

    const filteredTrainers = trainersData.filter(
      (trainer) =>
        trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.specializations.some((spec) =>
          spec.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    console.log("Search Term:", searchTerm);
    console.log("Trainers Data:", trainersData);

    const handleLoadMore = () => {
      setDisplayLimit((prevLimit) => prevLimit + 6); 
    };
  
  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-[#572c52]">
        Meet Our Trainers
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredTrainers.slice(0, displayLimit).map((trainer: Trainer) => (
          <div
            key={trainer._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105"
          >
            <img
              src={trainer.profileImage}
              alt={trainer.name}
              className="w-full h-70 object-cover"
            />
            <div className="p-4 text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                {trainer.name}
              </h2>
              <div className="text-gray-600 flex justify-start mt-3 space-x-2">
                {trainer.specializations.map((spec) => (
                  <p className="bg-blue-100 rounded-xl text-sm " key={spec._id}>
                    {spec.name}
                  </p>
                ))}
              </div>              
              <button onClick={()=>handleViewProfile(trainer._id)} className="mt-4 px-4 py-2 bg-[#572c52] text-white font-medium rounded-full hover:bg-[#7b4373] transition">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredTrainers.length > displayLimit && (
          <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="bg-[#572c52] hover:bg-[#9f889d] text-white py-2 px-6 rounded"
          >
            Load More Trainers
          </button>
        </div>
      )}
      {filteredTrainers.length === 0 && (
        <div className="flex items-center justify-center col-span-full mt-10">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-4">
              Sorry, we couldn’t find any trainers that matched your criteria.
            </h1>
            <p className="text-gray-600">
              Try removing some of your search filters. <br />
              (Helpful tip: You can book different trainers to mix up your
              routine.)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainersList;


