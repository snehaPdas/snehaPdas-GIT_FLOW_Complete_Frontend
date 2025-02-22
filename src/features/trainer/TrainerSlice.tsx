import {createSlice,PayloadAction} from "@reduxjs/toolkit"
import{
    registerTrainer,
    loginTrainer,
    verifyForgotOtp,
    submitKyc,
    getKycStatus
} from "../../actions/TrainerAction"


interface TrainerState{
    trainerInfo:null|any,
    loading:null|any
    kycStatus: string;
    videoCall:  VideoCallPayload | null;
    showVideoCallTrainer: boolean
    roomIdTrainer: null | string

    // trainerToken:null |any,
   // specializations:null|any
    error:null|any
    showDietPlan: boolean

}


interface VideoCallPayload {
  userID: string;
  type: string;
  callType: string;
  roomId: string;
  userName: string
  userImage: string;
  trainerName: string;
  trainerImage: string;
  bookingId: string
}

const trainer = localStorage.getItem("trainer");
//console.log("--->>------->>>",trainer)
//const parsedTrainer = trainer ? JSON.parse(trainer) : null;
const parsedTrainer = trainer && trainer !== "undefined" ? JSON.parse(trainer) : null;


const initialState:TrainerState={
    trainerInfo:null,
    loading:false,
    error:null,
    videoCall: null,
    showVideoCallTrainer: false,
    roomIdTrainer: null,
    kycStatus: "pending",
    showDietPlan:false


    // trainerToken:localStorage.getItem("trainer_access_token") || null,
    // specializations: [],


}
const trainerSlice=createSlice({
    name: "trainer",
    initialState,
    reducers:{
        clearTrainer(state) {
            state.trainerInfo = null;
            //state.trainerToken = null;
            //state.specializations = [];
            
          },
          setVideoCall(state, action: PayloadAction<VideoCallPayload  | null>) {
            state.videoCall = action.payload;
            console.log('hit vidocall slice........???????????', state.videoCall);
            
          },
          setShowVideoCall(state, action: PayloadAction<boolean>) {
            console.log("///////whhhhhhhhhh///",action.payload)
            state.showVideoCallTrainer = action.payload;
            console.log('showVideoCallTrainer slice><><><><>@@@@@@@@', state.showVideoCallTrainer);
      
          },
          setRoomId(state, action: PayloadAction<string | null>) {
            state.roomIdTrainer = action.payload;
            console.log('roomIdTrainer slice', state.roomIdTrainer);
          },
          setDietPLan(state,action:PayloadAction<boolean>){
            state.showDietPlan=action.payload
          },
          endCallTrainer: (state) => {
            state.videoCall = null;
            state.showVideoCallTrainer = false; 
            state.roomIdTrainer = null;   
            localStorage.removeItem("IncomingVideoCall"); 
          },

          
    },
    extraReducers: (builder) => {
        builder
        .addCase(registerTrainer.pending, (state) => {
          state.loading=true

          })
          .addCase(registerTrainer.fulfilled, (state, action: PayloadAction<any>) => {
            
            state.loading=false
            state.trainerInfo = action.payload;
            
        
          })
          .addCase(registerTrainer.rejected, (state, action: PayloadAction<any>) => {
        
            state.loading=false

            console.log('acion',action.payload);
          })  
          .addCase(loginTrainer.pending, (state) => {
            state.loading=true

            
          })
          .addCase(loginTrainer.fulfilled, (state, action: PayloadAction<any>) => {
            console.log("API Response:", action.payload)
            state.loading=false

            state.trainerInfo = action.payload.trainer
            console.log("_______trainerinfo", state.trainerInfo)
           // state.trainerToken = action.payload.token;
            localStorage.setItem("trainer", JSON.stringify(action.payload.trainer));
            localStorage.setItem("trainer_access_token", action.payload.token);
          })
          .addCase(loginTrainer.rejected, (state, action: PayloadAction<any>) => {
            state.loading=false

            
          })
          .addCase(submitKyc.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          //////////////////////////
          .addCase(submitKyc.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
          
            console.log('submitt kyc',action.payload);
            
            state.error = null;
          })
          .addCase(submitKyc.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
        
          })
          .addCase(getKycStatus.pending, (state) => {
            console.log("pending case slice")
            state.loading = true;
            state.error = null;
          })
          .addCase(getKycStatus.fulfilled, (state, action: PayloadAction<any>) => {
            console.log("fulfilled case slice")

            console.log("yes ethii")
            state.loading = false;
            state.kycStatus = action.payload.kycStatus;
            console.log('get kyc',action.payload.kycStatus);
            
            state.error = null;
          })
          .addCase(getKycStatus.rejected, (state, action: PayloadAction<any>) => {
            console.log("rejected case slice")

            state.loading = false;
            state.error = action.payload?.message || "OTP verification failed";
          })

    }
})
export const { clearTrainer, setVideoCall,setShowVideoCall ,setRoomId,endCallTrainer,setDietPLan} = trainerSlice.actions;
export default trainerSlice.reducer;
