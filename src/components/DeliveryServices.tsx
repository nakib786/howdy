import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

// Import SVG logos
import DoorDashLogo from '/doordash.svg';
import UberLogo from '/UberLogo.svg';

interface DeliveryService {
  name: string;
  logo: string;
  url: string;
  color: string;
  hoverColor: string;
  description: string;
}

const deliveryServices: DeliveryService[] = [
  {
    name: 'DoorDash',
    logo: DoorDashLogo,
    url: 'https://www.doordash.com/store/howdy-cafe-williams-lake-36009249',
    color: '#EF3B24',
    hoverColor: '#D32F2F',
    description: 'Order for delivery'
  },
  {
    name: 'Uber Eats',
    logo: UberLogo,
    url: 'https://www.ubereats.com/ca/store/howdy-cafe-700-midnight-dr-104/U4H9D3jiTgKf3Z_BDfyMeA',
    color: '#06C167',
    hoverColor: '#00A651',
    description: 'Order for delivery'
  }
];

const DeliveryServices: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.6 }}
      className="mt-12"
    >
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.8 }}
        className="text-center mb-8"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
          Order for Delivery
        </h3>
        <p className="text-sm text-gray-300 opacity-80">
          Get your favorite dishes delivered right to your door
        </p>
      </motion.div>

      {/* Delivery Service Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
        {deliveryServices.map((service, index) => (
          <motion.a
            key={service.name}
            href={service.url}
            target={service.url !== '#' ? '_blank' : undefined}
            rel={service.url !== '#' ? 'noopener noreferrer' : undefined}
            className={`w-full sm:w-auto ${service.url === '#' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={(e) => {
              if (service.url === '#') {
                e.preventDefault();
              }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2 + index * 0.1 }}
            whileHover={service.url !== '#' ? { 
              scale: 1.05,
              boxShadow: `0 20px 40px ${service.color}40`
            } : {}}
            whileTap={service.url !== '#' ? { scale: 0.98 } : {}}
          >
            <div
              className={`
                relative px-6 py-4 rounded-2xl font-medium text-white shadow-xl overflow-hidden group
                w-full sm:min-w-[200px] transition-all duration-300
                ${service.url === '#' 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'hover:shadow-2xl'
                }
              `}
              style={{
                backgroundColor: service.color,
                border: `2px solid ${service.color}`
              }}
            >
              {/* Animated background gradient */}
              {service.url !== '#' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.4 }}
                />
              )}
              
              {/* Content */}
              <div className="relative z-10 flex items-center justify-center gap-3">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <img
                    src={service.logo}
                    alt={`${service.name} logo`}
                    className="w-12 h-12 object-contain filter brightness-0 invert"
                  />
                </div>
                
                {/* Text */}
                <div className="flex flex-col items-center">
                  <span className="font-bold text-sm sm:text-base">
                    {service.name}
                  </span>
                  <span className="text-xs opacity-90">
                    {service.description}
                  </span>
                </div>
                
                {/* External link icon */}
                {service.url !== '#' && (
                  <motion.div
                    animate={{ 
                      x: [0, 4, 0],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ExternalLink size={16} className="opacity-80" />
                  </motion.div>
                )}
              </div>
              
              {/* Coming Soon Badge */}
              {service.url === '#' && (
                <div className="absolute -top-2 -right-2 z-20">
                  <div className="relative">
                    {/* Glowing background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-full blur-sm opacity-75 animate-pulse"></div>
                    
                    {/* Main badge */}
                    <div className="relative bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 text-black text-xs font-black px-3 py-1.5 rounded-full shadow-xl border-2 border-white/90 backdrop-blur-sm">
                      <span className="flex items-center gap-1.5">
                        <motion.span 
                          className="w-1.5 h-1.5 bg-black rounded-full"
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <span className="tracking-wider">SOON</span>
                      </span>
                    </div>
                    
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.a>
        ))}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.4 }}
        className="text-center mt-6"
      >
        <p className="text-xs text-gray-400 opacity-70">
          More delivery options coming soon • Dine-in and takeout always available
        </p>
      </motion.div>
    </motion.div>
  );
};

export default DeliveryServices;
