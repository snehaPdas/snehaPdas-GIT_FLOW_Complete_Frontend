import React, { useState, useEffect } from "react";
import API_URL from "../../../axios/API_URL";
import userAxiosInstance from "../../../axios/userAxiosInstance";
import { useNavigate } from "react-router-dom";
import { Specialization } from "../../types/trainer"
import Aos from "aos";
import "aos/dist/aos.css";
Aos.init();


function ServicesFeatures() {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await userAxiosInstance.get(`${API_URL}/api/user/specializations`);
        const specializationLists = response.data.filter(
          (spec: { isListed: any }) => spec.isListed
        );
        setSpecializations(specializationLists);
      } catch (error) {
        console.error("Error fetching specializations", error);
      }
    };
    fetchSpecializations();
  }, []);

  const handleClick = (specId: any) => {
    //navigate(`/trainers/${specId}`);
    navigate("/trainers")
  };

  return (
    <section className="bg-[#f7f3f7] py-16 px-4">
      <h1 className="text-4xl font-bold text-center text-[#572c5f] mb-12">
        Our Services
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {specializations.map((feature) => (
          <div
            key={feature._id}
            className="bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            data-aos="fade-up"
            data-aos-offset="200"
          >
            <div className="overflow-hidden rounded-t-lg">
              <img
                src={feature.image}
                alt={feature.description}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-[#572c5f] mb-3">
                {feature.name}
              </h2>
              <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
              <button
                onClick={() => handleClick(feature._id)}
                className="w-full py-2 bg-[#572c5f] text-white rounded-lg hover:bg-[#9c979b] transition duration-300"
              >
                View {feature.name} Trainers
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ServicesFeatures;
