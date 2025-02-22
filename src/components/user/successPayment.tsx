import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import userAxiosInstance from '../../../axios/userAxiosInstance';
import { useSocketContext } from '../../context/socket';
import { useNotification } from '../../context/NotificationContext';


function SuccessPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');
  const { socket } = useSocketContext();
  const { addTrainerNotification } = useNotification()

  
  const stripe_session_id = queryParams.get('stripe_session_id')
 
  const userInfo:any=localStorage.getItem("accesstoken")
  
  const parseinfo=JSON.parse(atob(userInfo.split(".")[1]))
  const userId=parseinfo.id

 
  useEffect(() => {
    
    let isMounted = true; 
  
    const createBooking = async () => {
    
      const bookingKey = `bookingCreated-${stripe_session_id}`;

      const bookingCreated = localStorage.getItem('bookingCreated');
    
      if (sessionId && userId &&  stripe_session_id&&!bookingCreated) {
        

        try {  
      

          const response = await userAxiosInstance.post('/api/user/bookings', { sessionId, userId, stripe_session_id });
          const notificationData = {
            receiverId: response.data.trainerId,
            content: `New booking for ${response.data.sessionType} (${response.data.specialization}) on ${new Date(response.data.startDate).toDateString()} at ${response.data.startTime}. Amount: $${response.data.amount}.`,
          };
          
           socket?.emit("newBookingNotification",notificationData)
           addTrainerNotification(notificationData.content)
           

           localStorage.setItem(bookingKey, 'true');

  
          localStorage.setItem('bookingCreated', 'true');
        } catch (error) {
          console.error('Error creating booking:', error);
        }
      }
    };
  
    createBooking();
  
    return () => {
      isMounted = false; 
      localStorage.removeItem('bookingCreated');
    };
  }, [sessionId, userId,  stripe_session_id, socket]);
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 px-4">
    <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-lg text-center">
      <div className="text-green-500 text-6xl flex justify-center animate-bounce">
        <FaCheckCircle />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-800 mt-6">Payment Successful!</h1>
      <p className="text-gray-600 mt-4 text-lg">
        Thank you for your payment. Your transaction has been successfully completed.
      </p>

      <div className="mt-10 space-y-4">
        <button
          onClick={() => navigate('/home')}
          className="w-full bg-[#553353] text-white py-3 rounded-lg shadow-md hover:bg-[#553353] transition-transform transform hover:scale-105"
        >
          Go to Homepage
        </button>
      
      </div>
    </div>

    <footer className="mt-10 text-gray-500 text-sm">
      Need help? <span className="text-blue-500 underline cursor-pointer">Contact Support</span>
    </footer>
  </div>
  );
}

export default SuccessPayment;
