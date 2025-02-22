import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import images
import Banner1 from "../../assets/edit_selectedcover.jpg";
import Banner4 from "../../assets/ba2.webp";
import Banner5 from "../../assets/ima9.avif";



const images = [Banner1, Banner4,Banner5];

function Banner() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[900px] w-full overflow-hidden">
      {/* Image Wrapper to prevent gaps */}
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          {images.map(
            (image, index) =>
              index === currentImage && (
                <motion.div
                  key={index}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${image})` }}
                  initial={{ opacity: 0, scale: 1.1, x: "100%" }}
                  animate={{ opacity: 1, scale: 1, x: "0%" }}
                  exit={{ opacity: 0, scale: 1.1, x: "-100%" }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              )
          )}
        </AnimatePresence>
      </div>

      {/* Dark Overlay (Reduced Opacity for Better Visibility) */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content Box (Now Positioned to the Left Side) */}
      <div className="absolute top-10 left-10 z-10 text-left">
      <motion.div
className="bg-white/10 rounded-2xl p-8 shadow-lg w-[450px]"
initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        >
          <motion.h1 
            className="sm:text-6xl xs:text-5xl text-white font-extrabold uppercase tracking-wide"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Get In <span className="text-green-400">Shape</span> Today
          </motion.h1>

          {/* Elegant Glowing Button */}
          <motion.button
            className="mt-6 py-3 px-8 text-lg font-semibold uppercase rounded-lg bg-green-500 text-white shadow-lg shadow-green-500/50 transition-all hover:scale-105 hover:shadow-green-400/80"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            Join Now
          </motion.button>

          {/* Discount Message */}
          <motion.p
            className="text-md text-white mt-4 font-semibold bg-black/20 py-2 px-4 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            Exclusive Fitness Training Programs
          </motion.p>
        </motion.div>
      </div>

      {/* Image Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {images.map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${index === currentImage ? "bg-white scale-125" : "bg-gray-500"}`}
            whileHover={{ scale: 1.3 }}
            onClick={() => setCurrentImage(index)}
          ></motion.div>
        ))}
      </div>
    </div>
  );
}

export default Banner;
