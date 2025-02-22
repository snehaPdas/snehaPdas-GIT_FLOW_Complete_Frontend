import banner from '../../assets/trainerlistbnaner.jpg';

function TrainersListBanner() {
  return (
    <div className="relative bg-gradient-to-t from-[#572c52] to-[#000000]">
      
      <img
        className="w-full h-[600px] object-cover brightness-75"
        style={{ objectPosition: 'center top' }} 
        src={banner}
        alt="Trainers Banner"
      />

      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        
        <div className="absolute inset-0 bg-gradient to-transparent opacity-70"></div>

        
        <h1 className="relative z-8 text-white text-5xl md:text-5xl font-extrabold leading-tight drop-shadow-lg mb-5">
            
          FitGlow  <br className="hidden md:block" />  Professionals
        </h1>

        
        <p className="relative z-10 text-white text-lg md:text-xl font-medium drop-shadow-md max-w-2xl">
        Personalized wellness guidance designed to inspire and transform every step of your fitness path.
        </p>

        
        <button className="relative z-10 mt-8 px-6 py-3 bg-[#572c52] hover:bg-[#7b4373] text-white font-semibold text-lg rounded-full shadow-md transition-transform duration-300 transform hover:scale-105">
          Explore Trainers
        </button>
      </div>
    </div>
  );
}

export default TrainersListBanner;
