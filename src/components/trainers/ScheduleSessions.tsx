import React, { useState, ChangeEvent, FormEvent ,useEffect} from "react";
import axiosinstance from "../../../axios/trainerAxiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { ISpecialization } from "../../types/trainer";
import API_URL from "../../../axios/API_URL";
import { ISessionSchedule } from "../../types/trainer";
import toast, { Toaster } from "react-hot-toast";


interface Session {
  selectedDate?: string;
  startTime?: string;
  endTime?: string;
  startDate?: string;
  endDate?: string;
  specialization: string;
  status: string; // "Confirmed
  type?: string;
  price?: number; // Added price field
}

const ScheduleSessions: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [sessionType, setSessionType] = useState<string>("Single");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [formData, setFormData] = useState({
    selectedDate: "",
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",
    specialization: "",
    price: 0, // Initialize price to 0
  });
  const [spec, setSpec] = useState<ISpecialization[]>([]);
  const [selectedSpec, setSelectedSpec] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [specializationId, setSpecializationId] = useState("");
    const [sessionSchedules, setSessionSchedules] = useState<ISessionSchedule[]>([])

    const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(3);
  const [editingSession, setEditingSession] = useState<ISessionSchedule | null>(null);


   


  const { trainerInfo } = useSelector((state: RootState) => state.trainer);
  const trainerId = trainerInfo.id;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecializationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpecializationId(e.target.value); 
  }
  const handleSessionTypeChange = (type: string) => {
    setSessionType(type);
  };

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Validation Logic
  if (sessionType === "Single") {
    if (!formData.selectedDate || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all required fields for Single Session.");
      return;
    }
  } else if (sessionType === "Package") {
    if (!formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all required fields for Package Session.");
      return;
    }
  }
  if (new Date(formData.startDate) >= new Date(formData.endDate)) {
    toast.error("Start Date must be less than End Date.");
    return;
  }

  const sessionData = {
    ...formData,
    type: sessionType,
    status: "Pending",
    specializationId,
  };

  try {
    
    if (editingSession) {
      
      // Edit Mode
      const response = await axiosinstance.put(
        `${API_URL}/api/trainer/edit-session/${editingSession._id}`,
        sessionData
      );

      if (response.status === 200) {
        setSessionSchedules((prevSchedules) =>
          prevSchedules.map((session) =>
            session._id === editingSession._id
              ? { ...session, ...response.data.updatedSession } 
              : session
          )
          
        );
        toast.success("Session updated successfully");
      }
      
    } 
    else {
      // Create Mode
      const response = await axiosinstance.post(
        `${API_URL}/api/trainer/session/${trainerId}`,
        sessionData
      );

      if (response.status === 201) {
        setSessionSchedules((prevSchedules) =>
          Array.isArray(response.data.sessioncreated)
            ? [...prevSchedules, ...response.data.sessioncreated]
            : [...prevSchedules, response.data.sessioncreated]
        );
        toast.success("Session created successfully");
      }
    }
  } catch (error: any) {
    console.error("Error:", error);
    const errorMessage =
      error.response?.data.message || "An unexpected error occurred";
    toast.error(errorMessage);
  } finally {
    setShowModal(false);
    setFormData({
      selectedDate: "",
      startTime: "",
      endTime: "",
      startDate: "",
      endDate: "",
      specialization: "",
      price: 0,
    });
    setSessionType("Single");
    setEditingSession(null);
  }
};

//////////////////////////////////////////////////////////////////////
  const handleCancel = () => {
    setFormData({
      selectedDate: "",
      startTime: "",
      endTime: "",
      startDate: "",
      endDate: "",
      specialization: "",
      price: 0,
    });
    setSessionType("Single");
    setShowModal(false);
  };

  const handleOpenModal = async () => {
    try {
      setShowModal(true);
      const response = await axiosinstance.get(`/api/trainer/specializations/${trainerId}`);
      setSpec(response.data.data.specializations);
    } catch (error) {
      console.error("Error fetching specializations:", error);
    }
  };
  
  
  const handleEdit = (session: ISessionSchedule) => {
    setEditingSession(session)
    console.log("Specializations Array:", spec);
  
    if (spec.length === 0) {
      console.error("Specializations are not loaded yet.");
      return;
    }
  
    const specialization = spec.find((s) => s._id === specializationId);
    
  
    
    setFormData({
      specialization: specialization ? specialization._id : '',
      selectedDate: session.selectedDate 
        ? new Date(session.selectedDate).toISOString().split('T')[0]
        : '', 
      startTime: session.startTime || '',
      endTime: session.endTime || '',
    //  price: session.price || '',
    price:session.price,
      startDate: session.selectedDate 
        ? new Date(session.selectedDate).toISOString().split('T')[0]
        : '', 
      endDate: session.endDate || '',

    });
  
    setShowModal(true);
  };
  

  useEffect(() => {
    
    const fetchSessionData = async () => {
       
      try {
        
        const response = await axiosinstance.get(
          `${API_URL}/api/trainer/shedules/${trainerId}`
        );

        
        const schedules = response.data.sheduleData;
        

        setSessionSchedules(schedules);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
        toast.error("Failed to fetch schedules");
      } finally {
     
      }
    };
    fetchSessionData();
  }, []);
  
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1) {
      setCurrentPage(1);  
    } else if (pageNumber > Math.ceil(sessionSchedules.length / itemsPerPage)) {
      setCurrentPage(Math.ceil(sessionSchedules.length / itemsPerPage));  // Last page
    } else {
      setCurrentPage(pageNumber);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSessions = sessionSchedules.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-white py-4 px-4">
      <button
        onClick={handleOpenModal}
        className="mt-2 px-4 py-3 bg-gradient-to-r from-[#674964] to-[#c780af] text-white text-lg font-semibold rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        Add New Schedule
      </button>

      {showModal && (
  <form onSubmit={handleSubmit}>
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-2/3 shadow-xl flex flex-col space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#572c52]">Add Session Details</h2>
          <button
            onClick={handleCancel}
            type="button"
            className="text-[#572c52] text-lg font-semibold hover:text-[#7b4373] transition-all duration-300"
          >
            ✖
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Specialization */}
          <label>
            <span className="text-lg font-bold text-[#572c52]">Specialization</span>
            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            >
              <option value="">Select Specialization</option>
              {spec.map((special) => (
                <option key={special._id} value={special._id}>
                  {special.name}
                </option>
              ))}
            </select>
          </label>

          {/* Price */}
          <label>
            <span className="text-lg font-bold text-[#572c52]">Price</span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            />
          </label>

          {/* Session Type Details */}
          {sessionType === "Single" && (
            <>
              <label>
                <span className="text-lg font-bold text-[#572c52]">Date</span>
                <input
                  type="date"
                  name="selectedDate"
                  value={formData.selectedDate}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-2 border border-gray-300 rounded"
                  min={new Date().toISOString().split("T")[0]}
                />
              </label>
              <label>
                <span className="text-lg font-bold text-[#572c52]">Start Time</span>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-2 border border-gray-300 rounded"

                />
              </label>
              <label>
                <span className="text-lg font-bold text-[#572c52]">End Time</span>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-2 border border-gray-300 rounded"
                />
              </label>
            </>
          )}

          {sessionType === "Package" && (
            <>
              <label>
                <span className="text-lg font-bold text-[#572c52]">Start Date</span>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-2 border border-gray-300 rounded"
                  min={new Date().toISOString().split("T")[0]}
                />
              </label>
              <label>
                <span className="text-lg font-bold text-[#572c52]">End Date</span>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-2 border border-gray-300 rounded"
                  min={new Date().toISOString().split("T")[0]}
                />
              </label>
              <label>
                <span className="text-lg font-bold text-[#572c52]">Start Time</span>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-2 border border-gray-300 rounded"
                />
              </label>
              <label>
                <span className="text-lg font-bold text-[#572c52]">End Time</span>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-2 border border-gray-300 rounded"
                />
              </label>
            </>
          )}
        </div>

        {/* Session Type Selection */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-[#572c52]">Select Type</h2>
          <div className="flex space-x-6 mt-4">
            <label>
              <input
                type="radio"
                name="type"
                value="Single"
                checked={sessionType === "Single"}
                onChange={() => handleSessionTypeChange("Single")}
                className="mr-2"
              />
              Single Session
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="Package"
                checked={sessionType === "Package"}
                onChange={() => handleSessionTypeChange("Package")}
                className="mr-2"
              />
              Package Session
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleCancel}
            type="button"
            className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-[#572c52] to-[#7b4373] text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-all duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </form>
)}



      {/* Scheduled Sessions Table */}
      <div className="mt-1">
        <h2 className="text-2xl font-bold text-[#725e70] mb-4 text-center">
          Scheduled Sessions
        </h2>
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-[#572c52] text-white">
              {/* <th className="py-3 px-6 text-center">specialization</th> */}
              <th className="py-3 px-6 text-center">Session Type</th>
              <th className="py-3 px-6 text-center">Date</th>
              <th className="py-3 px-6 text-center">Start Time</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Price</th> 
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            
          {/* <td className="py-3 px-6 text-center">{specialization}</td> */}
            {currentSessions.map((session, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-6 text-center">{session.type}</td>
                <td className="py-3 px-6 text-center">
  {new Date(session.selectedDate || session.startDate).toLocaleDateString(undefined, { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  })}
</td>
                <td className="py-3 px-6 text-center">{session.startTime}</td>
                <td className="py-3 px-6 text-center">{session.status}</td>
                <td className="py-3 px-6 text-center">{session.price}</td> {/* Display Price */}
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleEdit(session)}
                    className="px-4 py-2 bg-[#823c77] text-white rounded-full transform hover:scale-105 transition-all duration-300"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
<div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-black rounded mr-2 hover:bg-[#7f6a7c]"
        >
          Previous
        </button>
        <span className="text-gray-600">Page {currentPage} of {Math.ceil(sessionSchedules.length / itemsPerPage)}</span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={indexOfLastItem >= sessionSchedules.length}
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-[#7f6a7c]"
        >
          Next
        </button>
      </div>
    

      </div>
    </div>
  );
};

export default ScheduleSessions;
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

