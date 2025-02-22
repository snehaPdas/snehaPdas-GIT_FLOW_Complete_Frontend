import logo_img from "../../assets/logo_fitglow.png"
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa'; 


const Footer = () => {
  return (
    <footer className="bg-[#572c5f] text-white p-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        
        <div className="flex flex-col items-center md:items-start">
          <img src={logo_img} alt="FitGlow Logo" className="w-24 mb-4" />
          <p className="text-center md:text-left text-sm">FitGlow is a women's fitness platform that empowers women to lead a healthier and more active lifestyle.</p>
        </div>

        
        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:underline">Terms & Conditions</a></li>
          </ul>
        </div>

      
        <div className="flex space-x-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-white text-2xl hover:text-[#f5a623]" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-white text-2xl hover:text-[#f5a623]" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-white text-2xl hover:text-[#f5a623]" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-white text-2xl hover:text-[#f5a623]" />
          </a>
        </div>

        
        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-semibold mb-4">Join Our Newsletter</h3>
          <form action="#" method="POST" className="flex flex-col items-center space-y-2 md:space-x-4 md:flex-row">
            <input type="email" placeholder="Enter your email" className="p-2 text-black rounded-md w-60" />
            <button type="submit" className="bg-[#270e36] text-white p-2 rounded-md hover:bg-[#e4951a]">Subscribe</button>
          </form>
        </div>
      </div>

    
      <div className="text-center mt-8">
        <p className="text-sm">&copy; {new Date().getFullYear()} FitGlow. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
