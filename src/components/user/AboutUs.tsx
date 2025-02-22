import { useNavigate } from "react-router-dom";

import bgImg2 from "../../assets/aboutus3.jpg";
import bgImg3 from "../../assets/aboutus5.jpg";
import bgImg1 from "../../assets/training.png";

function AboutUs() {
  const navigate = useNavigate();

  const handleGetStart = () => {
    navigate("/trainers");
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section with Animated Background */}
      <div className="relative w-full h-[500px] overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 animate-slideshow"></div>
        <div className="relative z-10 text-white px-6">
          <h1 className="text-6xl font-extrabold drop-shadow-lg sm:text-4xl">
            Redefining Fitness, One Session at a Time
          </h1>
          <p className="text-gray-300 text-lg sm:text-base max-w-2xl mt-4">
            Unlock expert coaching, customized programs, and a supportive community—anytime, anywhere.
          </p>
        </div>
      </div>

      {/* What We Offer */}
      <div className="py-16 px-6 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6 sm:text-3xl">
          Why Choose Fit Glow?
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Our platform connects you with <strong>certified trainers</strong> who craft tailored workouts to fit your goals, schedule, and lifestyle. 
          Experience <strong>seamless virtual training</strong> designed to bring results, wherever you are.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="py-16 px-6 text-center bg-gradient-to-r from-[#572c52] to-[#572c52] text-white rounded-xl shadow-xl mx-6">
        <h2 className="text-4xl font-extrabold mb-6 sm:text-3xl">Our Philosophy</h2>
        <p className="text-lg max-w-3xl mx-auto leading-relaxed">
          <strong>Mission:</strong> To empower individuals with expert-led virtual training that drives real results. <br />
          <strong>Vision:</strong> A future where fitness is <strong>accessible, personalized, and sustainable</strong> for everyone.
        </p>
      </div>

      {/* Call to Action */}
      <div className="py-16 px-6 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6 sm:text-3xl">
          Start Your Journey Today
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-6">
          Join a global community that prioritizes <strong>progress over perfection</strong>. Take the first step towards a healthier, stronger you.
        </p>
        <button
          onClick={handleGetStart}
          className="bg-gradient-to-r from-[#572c52] to-[#572c52] text-white px-10 py-4 rounded-full text-lg font-semibold shadow-md hover:scale-105 transition-all"
        >
          Get Started
        </button>
      </div>

      {/* Tailwind CSS Animation */}
      <style>
        {`
          @keyframes slideshow {
             0% { background-image: url(${bgImg1}); }
            33% { background-image: url(${bgImg2}); }
            66% { background-image: url(${bgImg3}); }
            100% { background-image: url(${bgImg1}); }
          }
          .animate-slideshow {
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            animation: slideshow 12s infinite linear;
          }
        `}
      </style>
    </div>
  );
}

export default AboutUs;
