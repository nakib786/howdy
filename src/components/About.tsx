import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import aboutImage from '../assets/WhatsApp Image 2025-07-30 at 3.03.18 AM.jpeg';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900">
              Our Story
            </h2>
            <div className="w-20 h-1 bg-primary"></div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to Howdy Cafe, where we're all about fueling your fun with every bite! 
              Born from a love of bringing people together through amazing food, we've created 
              a unique spot in Williams Lake that celebrates the best of Canadian hospitality and global flavors.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our kitchen is where international flavors meet Canadian comfort - think omelet 
              your way that'll make you smile, butter chicken wrap that warms your soul, and 
              Howdy's finest burger that feels like home. We're not just serving food; we're creating moments 
              of joy, one delicious plate at a time.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              From our family to yours, we invite you to experience flavors that bring 
              communities together. Whether you're craving something spicy, something 
              comforting, or just something that makes you feel good, we've got you covered!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 pt-8">
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-2">Spice & Soul</h3>
                <p className="text-gray-600 text-sm md:text-base">Every dish tells a story</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-2">Fresh Daily</h3>
                <p className="text-gray-600 text-sm md:text-base">Made with love & local ingredients</p>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={aboutImage}
                alt="Beautiful fusion cuisine presentation"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-white/20"
            >
              <h4 className="font-heading font-bold text-xl text-white mb-2 drop-shadow-lg">
                Family Owned
              </h4>
              <p className="text-white/90 drop-shadow-md">
                Proudly serving Williams Lake with authentic flavors and warm hospitality
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About; 