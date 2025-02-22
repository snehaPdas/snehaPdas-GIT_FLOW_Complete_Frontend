 
   import React from 'react'

 import {Routes,Route} from 'react-router-dom'
  import SignupPage from '../pages/user/SignupPage'
  import Otp from "../pages/user/OtpPage"
  import Login from "../pages/user/LoginPage"
  import HomePage from '../pages/user/HomePage'
  import UserLoginProtector from './protector/UserLoginProtector'
  import ForgotPasswordPage from '../pages/user/ForgotPasswordPage'
  import ForgotPswdOtpPage from '../pages/user/ForgotPswdOtpPage'
  import ResetPasswordPage from '../pages/user/ResetPasswordPage'
  import TrainersPage from '../pages/user/TrainersPage'
 // import TrainersProfileView from '../components/user/TrainersProfileView'
 import TrainerProfileViewPage from '../pages/user/TrainerProfileViewPage'
  import SuccessPaymentPage from '../pages/user/SuccessPaymentPage'
  import UserLayout from '../components/user/UserLayout';
  import UserProfilePage from "../pages/user/UserProfilePage"
  import Bookings from '../components/user/Bookings';
  import ChatSidebarPage from '../pages/user/ChatSidebarPage'
  import UserDietPlanPage from '../pages/user/UserDietPlanPage'
  import AboutUsPage from '../pages/user/AboutUsPage';






  function UserRoutes() {
    return (
      <Routes>
          <Route
        path="/home"
        element={
          <UserLoginProtector>
            <HomePage />
          </UserLoginProtector>
        }
      />

           {/* <Route path="/home" element={<HomePage/>}/>  */}
           <Route path="/signup" element={<SignupPage/>}/> 
          <Route path='/otp' element={<Otp/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
          <Route path="/forgot-passwordOtp" element={<ForgotPswdOtpPage/>}/>
          <Route path="/resetpassword" element={<ResetPasswordPage/>}/>
          <Route path="/trainers" element={<TrainersPage/>}/>
          <Route path="/trainersprofileview/:trainerId" element={<TrainerProfileViewPage/>} />
          <Route path='/aboutUs' element={<AboutUsPage />} />
          <Route path='/paymentSuccess' element={<SuccessPaymentPage />} />
               <Route path='/profile' element={<UserLayout />}>
               <Route index element ={<UserProfilePage/>}/>
               <Route path="bookings" element={<Bookings/>}/>
               <Route path="message" element={<ChatSidebarPage/>}/>
               <Route path="dietplan" element={<UserDietPlanPage/>}/>

               </Route>

               
               {/* <Route path="/messages" element={<Message message={''} sender={'User'} time={''} userImage={undefined} trainerImage={undefined}/>}/> */}

              
      </Routes>
      
    )
  }

  export default UserRoutes
