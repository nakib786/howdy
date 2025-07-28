import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import aboutImage from '../assets/premium_photo-1673108852141-e8c3c22a4a22.avif';

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
              Born from a passion for bringing together the rich, aromatic spices of Pakistan 
              with the hearty, comforting flavors of Canada, Howdy Cafe represents a unique 
              culinary journey in Williams Lake, BC.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our kitchen is where East meets West, where traditional Pakistani recipes are 
              lovingly crafted alongside Canadian favorites, creating a fusion that celebrates 
              both cultures. Every dish tells a story of heritage, innovation, and the warm 
              hospitality that defines our community.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              From our signature butter chicken poutine to our maple-glazed biryani, 
              we invite you to experience flavors that bridge continents and bring people together.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="text-center">
                <h3 className="text-3xl font-heading font-bold text-primary">25+</h3>
                <p className="text-gray-600">Spice Blends</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-heading font-bold text-primary">50+</h3>
                <p className="text-gray-600">Fusion Dishes</p>
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
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100"
            >
              <h4 className="font-heading font-bold text-xl text-gray-900 mb-2">
                Family Owned
              </h4>
              <p className="text-gray-600">
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