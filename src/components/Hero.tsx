import { motion, useScroll, useTransform } from 'framer-motion';
import { Star, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-scroll';
import { useState, useEffect } from 'react';

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [todaysHours, setTodaysHours] = useState('');

  // Restaurant hours by day
  const weeklyHours = {
    0: 'Closed', // Sunday
    1: '11:00 AM - 9:00 PM', // Monday
    2: '11:00 AM - 9:00 PM', // Tuesday
    3: '11:00 AM - 9:00 PM', // Wednesday
    4: '11:00 AM - 10:00 PM', // Thursday
    5: '11:00 AM - 11:00 PM', // Friday
    6: '10:00 AM - 11:00 PM', // Saturday
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

  // Food collage items with real food images
  const foodItems = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop&auto=format",
      title: "Masala Curry",
      x: 15,
      y: 20,
      delay: 0,
      size: "w-24 h-24 md:w-32 md:h-32"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop&auto=format",
      title: "Artisan Pancakes",
      x: 80,
      y: 15,
      delay: 0.3,
      size: "w-20 h-20 md:w-28 md:h-28"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop&auto=format",
      title: "Gourmet Burger",
      x: 12,
      y: 75,
      delay: 0.6,
      size: "w-28 h-28 md:w-36 md:h-36"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1495474472287-4c7edcad34c4?w=400&h=400&fit=crop&auto=format",
      title: "Premium Coffee",
      x: 85,
      y: 70,
      delay: 0.9,
      size: "w-20 h-20 md:w-28 md:h-28"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop&auto=format",
      title: "Fresh Salad",
      x: 75,
      y: 45,
      delay: 1.2,
      size: "w-20 h-20 md:w-24 md:h-24"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop&auto=format",
      title: "Signature Dish",
      x: 25,
      y: 50,
      delay: 1.5,
      size: "w-24 h-24 md:w-32 md:h-32"
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&auto=format",
      title: "Fusion Pasta",
      x: 60,
      y: 25,
      delay: 1.8,
      size: "w-20 h-20 md:w-24 md:h-24"
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop&auto=format",
      title: "Gourmet Pizza",
      x: 65,
      y: 85,
      delay: 2.1,
      size: "w-20 h-20 md:w-28 md:h-28"
    }
  ];

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
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Elegant restaurant interior"
          className="w-full h-full object-cover scale-105"
        />
      </motion.div>

      {/* Interactive Food Collage - Hidden on mobile for better performance */}
      <div className="hidden md:block">
        {foodItems.map((item) => (
          <motion.div
            key={item.id}
            className="absolute z-15 cursor-pointer group"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
            initial={{ opacity: 0, scale: 0, rotate: -10 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotate: 0,
            }}
            transition={{
              duration: 0.8,
              delay: item.delay,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.15,
              rotate: 5,
              zIndex: 50,
              transition: { duration: 0.3 }
            }}
          >
            {/* Food Card */}
            <motion.div
              className={`${item.size} relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 backdrop-blur-sm`}
              whileHover={{
                boxShadow: "0 25px 50px rgba(251, 191, 36, 0.3)",
                borderColor: "rgba(251, 191, 36, 0.6)"
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              
              {/* Title */}
              <motion.div
                className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ y: 10 }}
                whileHover={{ y: 0 }}
              >
                {item.title}
              </motion.div>

              {/* Floating particles on hover */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                whileHover={{
                  background: "radial-gradient(circle at center, rgba(251, 191, 36, 0.1) 0%, transparent 70%)"
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

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
              Est. 2024 • Williams Lake, BC
            </span>
            <motion.div
              className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-heading font-bold mb-4 md:mb-6 relative"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            <motion.span
              className="inline-block text-white"
              whileHover={{ 
                scale: 1.02,
                textShadow: "0 0 30px rgba(255, 255, 255, 0.5)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Howdy
            </motion.span>
            <br />
            <motion.span
              className="inline-block bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
              whileHover={{ 
                scale: 1.02,
                filter: "drop-shadow(0 0 20px rgba(251, 191, 36, 0.8))"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Cafe
            </motion.span>
          </motion.h1>

          {/* Tagline */}
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-4 md:mb-6 text-gray-300 max-w-4xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            Where Pakistani Spices Meet Canadian Comfort
          </motion.p>

          {/* Description */}
          <motion.p 
            className="text-sm sm:text-base md:text-lg opacity-80 max-w-3xl mx-auto leading-relaxed text-gray-400 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            Experience culinary artistry where traditional Pakistani flavors dance with Canadian ingredients, 
            creating an unforgettable fusion dining experience in the heart of Williams Lake.
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
          className="flex justify-center items-center gap-8 mt-12 text-sm text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
        >
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-current" />
            <span>4.9 Rating</span>
          </div>
          <div className="w-px h-4 bg-gray-600" />
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{todaysHours}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Refined Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.2 }}
        className="absolute bottom-8 left-0 right-0 z-20 flex justify-center"
      >
        <Link to="about" smooth={true} duration={800} className="cursor-pointer group">
          <motion.div
            className="flex flex-col items-center text-white/50 hover:text-white/80 transition-colors"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="mb-3 text-xs font-light tracking-widest uppercase text-center">
              Discover More
            </div>
            <motion.div
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
              whileHover={{ borderColor: "rgba(251, 191, 36, 0.6)" }}
            >
              <motion.div
                className="w-1 h-3 bg-white/50 rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </Link>
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