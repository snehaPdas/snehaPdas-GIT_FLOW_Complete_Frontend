import React, { useEffect, useRef, useState, useCallback } from "react";
import trainerAxiosInstance from "../../../axios/trainerAxiosInstance";
import { User } from "../../types/user";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import DietModal from "../../components/trainers/DietModal";



export interface DietPlan {
    morning: string;
    lunch: string;
    evening: string;
    night: string;
    totalCalories: string;
    [key: string]: string;
}

function DietPlan() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userDetails, setUserDetails] = useState<any>(null);
    const [dietPlans, setDietPlans] = useState<{ [userId: string]: DietPlan }>({});
    const [saveTriggered, setSaveTriggered] = useState(false);
    const prevDietPlans = useRef<{ [userId: string]: DietPlan }>({});

    const trainerinfo = useSelector((state: RootState) => state.trainer);
    const trainerId = trainerinfo?.trainerInfo?.id;

    useEffect(() => {
        if (!trainerId) return;

        const fetchUsers = async () => {
            try {
                const response = await trainerAxiosInstance.get(`/api/trainer/bookingdetails/${trainerId}`);
                const seenUserId = new Set();
                const uniqueUsers = response.data.data.filter((booking: any) => {
                    if (!booking.userId?._id || seenUserId.has(booking.userId._id)) return false;
                    seenUserId.add(booking.userId._id);
                    return true;
                });
                setUsers(uniqueUsers.map((booking: any) => ({ userId: booking.userId, bookingId: booking._id })));
            } catch (error: any) {
                console.error("Error fetching users:", error.response?.data || error.message);
            }
        };

        fetchUsers();
    }, [trainerId]);

    useEffect(() => {
        if (!selectedUser) return;

        const fetchUserDetails = async () => {
            try {
                const response = await trainerAxiosInstance.get(`/api/trainer/users/${selectedUser.userId._id}`);
                setUserDetails(response.data);

                const dietResponse = await trainerAxiosInstance.get(`/api/trainer/get-diet-plan/${selectedUser.userId._id}`);
                setDietPlans(prev => ({
                    ...prev,
                    [selectedUser.userId._id]: dietResponse.data || { morning: "", lunch: "", evening: "", night: "", totalCalories: "" }
                }));
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, [selectedUser]);

    const handleDietChange = useCallback((userId: string, newDietPlan: DietPlan) => {
        setDietPlans(prev => ({
            ...prev,
            [userId]: { ...prev[userId], ...newDietPlan }
        }));
    }, []);

    useEffect(() => {
        if (!saveTriggered || !selectedUser) return;
    
        const saveDietPlan = async () => {
            try {
                const userId = selectedUser.userId._id;
                const updatedDietPlan = dietPlans[userId] || {};
                const previousPlan = prevDietPlans.current[userId] || {};
    
                const changedFields = Object.keys(updatedDietPlan).reduce((acc, key) => {
                    if (updatedDietPlan[key] !== previousPlan[key]) {
                        acc[key] = updatedDietPlan[key];
                    }
                    return acc;
                }, {} as Partial<DietPlan>);
    
                if (Object.keys(changedFields).length > 0) {
                    // Check if the existing diet plan has an ID
                    const existingPlan = prevDietPlans.current[userId];
    
                    await trainerAxiosInstance.post(
                        `/api/trainer/store-diet-plan/${userId}`,
                        {
                            ...changedFields,
                            trainerId,
                            dietPlanId: existingPlan?._id // Pass existing ID to update
                        }
                    );
    
                    prevDietPlans.current[userId] = { ...updatedDietPlan };
                }
            } catch (error) {
                console.error("Error saving diet plan:", error);
            } finally {
                setSaveTriggered(false);
            }
        };
    
        saveDietPlan();
    }, [saveTriggered, selectedUser, dietPlans, trainerId]);
    
    const handleEditdietplan=(user: User)=>{
        setSelectedUser(user);
  setIsModalOpen(true); 

    }

    return (
        <div className="max-w-5xl mx-auto mt-10 p-10 bg-white shadow-xl rounded-2xl">
            <h1 className="text-4xl font-bold text-center text-[#572c52] mb-10">Diet Management</h1>
            <div className="overflow-x-auto max-w-3xl mx-auto rounded-xl shadow-md border border-gray-200 bg-white">
                <table className="table-auto w-full border-collapse">
                    <thead>
                        <tr className="bg-[#572c52] text-white text-lg">
                            <th className="py-5 px-6 text-left  font-semibold">Name</th>
                            <th className="py-5 px-6 text-center  font-semibold">Diet Plan </th>
                            <th className="py-5 px-6 text-center font-semibold">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user.userId._id} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}>
                                    <td className="py-5 px-6 border-b border-gray-300 text-lg text-gray-800">{user.userId.name}</td>
                                    <td className="py-5 px-6 border-b border-gray-300 text-center">
                                        <button
                                            className="px-6 py-3 rounded-lg bg-[#572c52] text-white hover:bg-[#6e3d68]"
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            View
                                        </button>
                                    </td>
                                    <td className="py-5 px-6 border-b border-gray-300 text-center">
            <button
              onClick={() => handleEditdietplan(user)}
              className="text-[#572c52] hover:text-[#6e3d68]"
            >
              Edit
            </button>
          </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2} className="text-center py-8 text-gray-500 text-lg">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedUser && (
                <DietModal
                

                    showModal={isModalOpen}
                    handleClose={() => setIsModalOpen(false)}
                    userDetails={userDetails}
                    dietPlan={dietPlans[selectedUser.userId._id] || { morning: "", lunch: "", evening: "", night: "", totalCalories: "" }}
                    setDietPlan={(newDietPlan) => handleDietChange(selectedUser.userId._id, newDietPlan)}
                    setSaveTriggered={setSaveTriggered}  
                    isEditing={true}  // New prop
                    

                />
            )}
            
        </div>
    );
}

export default DietPlan;
