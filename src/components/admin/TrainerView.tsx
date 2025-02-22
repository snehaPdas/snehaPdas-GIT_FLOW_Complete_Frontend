import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaUser, FaFileAlt, FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import adminAxiosInstance from "../../../axios/adminAxiosInstance";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch } from "react-redux";

interface Errors {
  rejectionReason?: string;
}

interface Trainer {
  trainerName: string;
  trainerEmail: string;
  trainerPhone: string;
  specialization: string;
  profileImage: string;
  aadhaarFrontImage: string;
  aadhaarBackImage: string;
  certificate: string;
  kycStatus: string;
  kycSubmissionDate: string;
}

function TrainerView() {
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const { trainerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchTrainerDetails = async () => {
      try {
        const response = await adminAxiosInstance.get(
          `/api/admin/trainers/kyc/${trainerId}`
        );
        const trainerData = response.data?.kycData;
        if (trainerData) {
          const specializations = trainerData.specializationId
            .map((spec: { name: string }) => spec.name)
            .join(", ");
          const data: Trainer = {
            trainerName: trainerData.trainerId.name,
            trainerEmail: trainerData.trainerId.email,
            trainerPhone: trainerData.trainerId.phone,
            specialization: specializations,
            profileImage: trainerData.profileImage,
            aadhaarFrontImage: trainerData.aadhaarFrontImage,
            aadhaarBackImage: trainerData.aadhaarBackImage,
            certificate: trainerData.certificate,
            kycStatus: trainerData.kycStatus,
            kycSubmissionDate: new Date(
              trainerData.createdAt
            ).toLocaleDateString(),
          };
          setTrainer(data);
        } else {
          console.warn("No trainer data found");
        }
      } catch (error) {
        console.error("Error fetching trainer data:", error);
      }
    };

    fetchTrainerDetails();
  }, [trainerId]);

  const handleApproveStatusChange = async (newStatus: string) => {

    
    try {
      Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes",
      }).then(async (result: { isConfirmed: any }) => {
        if (result.isConfirmed) {
          try {
            await adminAxiosInstance.patch(
              `/api/admin/kyc-status-update/${trainerId}`,
              { status: newStatus }
            );
            setTrainer((prevTrainer) =>
              prevTrainer ? { ...prevTrainer, kycStatus: newStatus } : null
            );
            navigate("/admin/verification");
            Swal.fire("OK!", "Trainer Approved.", "success");
          } catch (error) {
            console.error("Error updating trainer status:", error);
          }
        }
      });
    } catch (error) {
      console.error("Error updating trainer status:", error);
    }
  };

  const handleRejectStatusChange = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
    setRejectionReason("");
  };

  const validate = (): boolean => {
    let isValid = true;
    const newErrors: Errors = {};
    if (!rejectionReason.trim()) {
      newErrors.rejectionReason = "Please provide a rejection reason.";
      isValid = false;
    }
    if (!isValid) {
      setErrors(newErrors);
      setTimeout(() => {
        setErrors({});
      }, 3000);
    }
    return isValid;
  };

  const handleReasonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await adminAxiosInstance.patch(
        `/api/admin/kyc-status-update/${trainerId}`,
        {
          status: "rejected",
          rejectionReason,
        }
      );
      setTrainer((prevTrainer) =>
        prevTrainer ? { ...prevTrainer, kycStatus: "rejected" } : null
      );
      closeModal();
      navigate("/admin/verification");
    } catch (error) {
      console.error(
        "Error updating trainer status with rejection reason:",
        error
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8 space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Trainer Details
      </h2>

      {trainer ? (
        <>
          <div className="flex items-center justify-center">
            <img
              src={trainer.profileImage}
              alt="Profile"
              className="w-48 h-48 rounded-full shadow-xl object-cover"
            />
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800">
              {trainer.trainerName}
            </h3>
            <p className="text-gray-600">{trainer.trainerEmail}</p>
            <p className="text-gray-600">Phone: {trainer.trainerPhone}</p>
          </div>

          <div className="border-t border-gray-300 pt-6">
            <h4 className="font-medium text-lg text-gray-700">
              KYC Information
            </h4>
            <p className="text-sm text-gray-500">
              KYC Submission Date: {trainer.kycSubmissionDate}
            </p>
            <p className="text-sm text-gray-500">Status: {trainer.kycStatus}</p>
            <p className="text-sm text-gray-500">
              Specialization: {trainer.specialization}
            </p>
          </div>

          <div className="border-t border-gray-300 pt-6">
            <h4 className="font-medium text-lg text-gray-700">Documents</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h5 className="font-semibold text-gray-700">
                  Aadhaar Front Image
                </h5>
                <a
                  href={trainer.aadhaarFrontImage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={trainer.aadhaarFrontImage}
                    alt="Aadhaar Front"
                    className="w-40 h-40 rounded-lg shadow-md hover:scale-105 transition-transform"
                  />
                </a>
              </div>
              <div>
                <h5 className="font-semibold text-gray-700">
                  Aadhaar Back Image
                </h5>
                <a
                  href={trainer.aadhaarBackImage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={trainer.aadhaarBackImage}
                    alt="Aadhaar Back"
                    className="w-40 h-40 rounded-lg shadow-md hover:scale-105 transition-transform"
                  />
                </a>
              </div>
              <div>
                <h5 className="font-semibold text-gray-700">Certificate</h5>
                <a
                  href={trainer.certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={trainer.certificate}
                    alt="Certificate"
                    className="w-40 h-40 rounded-lg shadow-md hover:scale-105 transition-transform"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-6">
            <button
              onClick={() => handleApproveStatusChange("approved")}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-md transition-colors transform hover:scale-105"
            >
              <FaCheck className="mr-2" /> Approve
            </button>
            <button
              onClick={handleRejectStatusChange}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-md transition-colors transform hover:scale-105"
            >
              <FaTimes className="mr-2" /> Reject
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">
          No trainer details available.
        </p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Rejection Reason</h3>
            <form onSubmit={handleReasonSubmit}>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Rejection reason."
                className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.rejectionReason && (
                <div className="text-red-500 mb-4">
                  {errors.rejectionReason}
                </div>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainerView;
