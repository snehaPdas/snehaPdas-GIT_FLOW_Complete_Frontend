import React, { useState, useEffect, ReactNode } from 'react';
import adminService from '../../services/AdminService';
import { Form } from 'react-router-dom';
import { Toaster, toast } from "react-hot-toast";

interface Specialization {
  image: string;
  _id: string;
  name: string;
  description: string;
  isListed: boolean;
  formData:FormData
}

function Specializations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [specialization, setSpecialization] = useState<Specialization[]>([]);
  const [editingSpecialization, setEditingSpecialization] = useState<Specialization | null>(null);
  const [image, setImage] = useState<File | null>(null);


  // Fetch the specialization data when the component mounts
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await adminService.getSpecializations();
        setSpecialization(response?.data.data || []);
      } catch (error) {
        console.error('Failed to fetch specializations:', error);
      }
    };

    fetchSpecializations();
  }, []); // Empty dependency array means this runs only once on mount

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSpecialization(null); // Reset editing state
    setName('');
    setDescription('');
  };

  const handleAddSpecialization = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = { name, description };

    try {
      const response = await adminService.addSpecialization(formData);
      const specializationData = response?.data.specializationresponse;

      // Update state with the new specialization
      setSpecialization((prev) => [...prev, specializationData]);

      closeModal(); // Close the modal after successful addition
    } catch (error) {
      console.error('Failed to add specialization:', error);
    }
  };

  const handleEditSpecialization = (spec: Specialization) => {
    setEditingSpecialization(spec);
    setName(spec.name);
    setDescription(spec.description);
    openModal();
  };

  const handleSaveSpecialization = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  if (image) {
    formData.append('image', image); 
  }
  console.log("Form Data Before Send:", Object.fromEntries(formData.entries()));
  try {
      if (editingSpecialization) {
        const response = await adminService.updateSpecialization(editingSpecialization._id, formData);
        const updatedSpecialization = response?.data.specialization;
        

        setSpecialization((prev) =>
          prev.map((spec) =>
            spec._id === editingSpecialization._id ? updatedSpecialization : spec
          )
        );
      } else {
        
        const response = await adminService.addSpecialization(formData);
        setSpecialization((prev) => [...prev, response?.data.specializationresponse]);
        toast.success('Specialization added successfully!');

      }

      closeModal(); // Close the modal after saving
    } catch (error:any) {
      console.error('Failed to save specialization:', error);
      toast.error("fill all fields" );

    }
  };

  return (
    <div className="min-h-screen p-20 bg-gray-100">
      {/* Header */}
      <div className="flex justify-between px-4 py-4 items-center w-full max-w-4xl bg-gray-100 mb-6">
        <h1 className="text-2xl px-2 py-2 font-bold text-gray-700 mx-auto mt-2">Manage Specialization</h1>
        <button
          onClick={openModal}
          className="px-4 py-2 bg-[#572c52] text-white text-lg font-medium rounded hover:bg-[#572c52] transition"
        >
          + Add Specialisation
        </button>
      </div>

      {/* Specialization List */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
        <div className="grid grid-cols-4 text-lg font-semibold text-gray-600 mb-1 border-b border-gray-200 pb-2">
          <div>No</div>
          <div>Specialization</div>
          <div className="text-center ">Image</div>
          <div className="text-center">Edit</div>
          
        </div>
        {specialization.length > 0 ? (
          specialization.map((spec, index) => (
            <div
              key={spec._id}
              className="grid grid-cols-4 text-lg text-gray-700 mb-4 border-b border-gray-200 pb-2"
            >
              <div>{index + 1}</div>
              <div>{spec.name}</div>
              
              <div className="text-center">
            {spec.image ? (
              <img
                src={spec.image}
                alt={spec.name}
                className="w-12 h-8 object-cover rounded ml-20" 
                />
            ) : (
              <span>No Image</span>
            )}
          </div>
          <div className="text-center">
                <button
                  onClick={() => handleEditSpecialization(spec)}
                  className="text-[#572c52] hover:text-[#572c52]"
                >
                  Edit
                </button>
               
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">No specialization found</div>
        )}
      </div>

      {/* Modal for Adding or Editing Specialization */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{editingSpecialization ? 'Edit Specialisation' : 'Add New Specialisation'}</h2>
            <form onSubmit={handleSaveSpecialization}>
              <div className="mb-4">
                <label htmlFor="specializationName" className="block text-sm font-medium text-gray-700">
                  Specialisation Name(*)
                </label>
                <input
                  value={name || ''}
                  type="text"
                  id="specializationName"
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Specialisation description(*)
                </label>
                <input
                  value={description || ''}
                  type="text"
                  id="description"
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  add image
                </label>
                <input
                  
                  type="file"
                  id="uploadFile1"
                  onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#572c52] text-white rounded hover:bg-[#572c52]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Specializations;
