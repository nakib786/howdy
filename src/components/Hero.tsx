import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { Link } from 'react-scroll';
import { useState, useEffect } from 'react';
import logoWhite from '../assets/Howdy Cafe Logo - Stacked White Text.png';

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 200, 500], [1, 1, 0]);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [todaysHours, setTodaysHours] = useState('');

  // Restaurant hours by day
  const weeklyHours = {
    0: '7:00 AM - 9:00 PM', // Sunday
    1: '7:00 AM - 9:00 PM', // Monday
    2: '7:00 AM - 9:00 PM', // Tuesday
    3: '7:00 AM - 9:00 PM', // Wednesday
    4: '7:00 AM - 9:00 PM', // Thursday
    5: '7:00 AM - 9:00 PM', // Friday
    6: '7:00 AM - 9:00 PM', // Saturday
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    // Get today's hours
    const today = new Date().getDay();
    setTodaysHours(weeklyHours[today as keyof typeof weeklyHours]);
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);



  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Sophisticated Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black"
        animate={{
          background: [
            'linear-gradient(135deg, #0f172a, #1e293b, #000000)',
            'linear-gradient(135deg, #1e293b, #000000, #0f172a)',
            'linear-gradient(135deg, #000000, #0f172a, #1e293b)',
          ]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        <div className="w-full h-full bg-gradient-to-r from-black/80 via-black/60 to-black/80 absolute z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Retro cafe interior with warm lighting"
          className="w-full h-full object-cover scale-105"
        />
      </motion.div>



      {/* Mobile-friendly animated background elements */}
      <div className="block md:hidden">
        <motion.div
          className="absolute inset-0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {/* Subtle animated circles for mobile */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-400/10 rounded-full"
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [0, 2, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Simple Circle Mouse Follower */}
      <motion.div
        className="fixed z-50 pointer-events-none"
        style={{
          left: mousePosition.x - 20,
          top: mousePosition.y - 20,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          className="w-10 h-10 rounded-full border-2 border-amber-400/70"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="relative z-20 text-center text-white container-custom px-4"
        style={{ opacity }}
      >
        {/* Premium Title Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="mb-12"
        >
          {/* Subtitle */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.div
              className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
            <span className="text-amber-400 text-sm font-light tracking-[0.2em] uppercase">
              Est. 2025 • Williams Lake, BC
            </span>
            <motion.div
              className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </motion.div>

          {/* Main Title with Logo */}
          <motion.div
            className="flex justify-center mb-6 md:mb-8 relative"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            {/* Subtle glow effect behind logo */}
            <motion.div
              className="absolute inset-0 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 1 }}
            >
              <div className="w-80 sm:w-80 md:w-96 lg:w-[400px] h-32 sm:h-32 md:h-40 lg:h-48 bg-gradient-to-r from-amber-400/10 via-orange-500/5 to-red-500/10 rounded-full blur-3xl"></div>
            </motion.div>
            
            <motion.img
              src={logoWhite}
              alt="Howdy Cafe"
              className="w-72 sm:w-64 md:w-80 lg:w-96 h-auto object-contain relative z-10"
              whileHover={{ 
                scale: 1.02,
                filter: "drop-shadow(0 0 30px rgba(255, 255, 255, 0.4)) brightness(1.1)"
              }}
              animate={{
                filter: [
                  "drop-shadow(0 0 20px rgba(255, 255, 255, 0.2))",
                  "drop-shadow(0 0 30px rgba(255, 255, 255, 0.3))",
                  "drop-shadow(0 0 20px rgba(255, 255, 255, 0.2))"
                ]
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300,
                filter: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-4 md:mb-6 text-gray-300 max-w-4xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            Fuel your fun with every bite!
          </motion.p>

          {/* Description */}
          <motion.p 
            className="text-sm sm:text-base md:text-lg opacity-80 max-w-3xl mx-auto leading-relaxed text-gray-400 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            Discover the perfect blend of authentic Pakistani spices and fresh Canadian ingredients, 
            served with genuine warmth in our family-owned kitchen where every dish tells a story of tradition and love.
          </motion.p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          {/* Primary CTA */}
          <Link to="menu" smooth={true} duration={800} className="cursor-pointer w-full sm:w-auto">
            <motion.button
              className="relative px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-black bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-2xl overflow-hidden group w-full sm:min-w-[200px]"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(251, 191, 36, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.4 }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explore Menu
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </Link>

          {/* Secondary CTA */}
          <Link to="contact" smooth={true} duration={800} className="cursor-pointer w-full sm:w-auto">
            <motion.button
              className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-white border-2 border-white/30 rounded-full backdrop-blur-sm hover:border-amber-400/60 hover:bg-amber-400/10 transition-all duration-300 w-full sm:min-w-[200px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                <MapPin size={18} />
                Visit Us
              </span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex justify-center items-center mt-12 text-sm text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="font-bold text-white">{todaysHours}</span>
          </div>
        </motion.div>
      </motion.div>



      {/* Subtle Ambient Elements */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber-400/20 rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </section>
  );
};

export default Hero; 