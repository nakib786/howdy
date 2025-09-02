import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';
import CustomMapMarker from './CustomMapMarker';

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      details: ['700 Midnight Dr #104', 'Williams Lake, BC V2G 4N3'],
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['(236) 591-9147'],
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['hello@howdycafe.ca'],
    },
    {
      icon: Clock,
      title: 'Hours',
      details: [
        'Monday - Friday: 7 AM - 9 PM',
        'Saturday: 7 AM - 8 PM', 
        'Sunday: 8 AM - 12 PM'
      ],
    },
  ];

  return (
    <section id="contact" className="section-padding scroll-mt-24 md:scroll-mt-28 bg-white">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            Visit Us
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Visit us to taste the difference of a local, family-owned spot where authentic flavours meet real heart.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <info.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  {info.details.map((detail, detailIndex) => {
                    // Make phone number clickable
                    if (info.title === 'Phone') {
                      return (
                        <a
                          key={detailIndex}
                          href={`tel:${detail.replace(/[^\d+]/g, '')}`}
                          className="text-gray-600 leading-relaxed hover:text-primary transition-colors duration-300 cursor-pointer"
                        >
                          {detail}
                        </a>
                      );
                    }
                    // Make address clickable (opens Google Maps)
                    if (info.title === 'Address') {
                      return (
                        <a
                          key={detailIndex}
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detail)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 leading-relaxed hover:text-primary transition-colors duration-300 cursor-pointer"
                        >
                          {detail}
                        </a>
                      );
                    }
                    // Make email clickable
                    if (info.title === 'Email') {
                      return (
                        <a
                          key={detailIndex}
                          href={`mailto:${detail}`}
                          className="text-gray-600 leading-relaxed hover:text-primary transition-colors duration-300 cursor-pointer"
                        >
                          {detail}
                        </a>
                      );
                    }
                    // Regular text for other details
                    return (
                      <p key={detailIndex} className="text-gray-600 leading-relaxed">
                        {detail}
                      </p>
                    );
                  })}
                </div>
              </motion.div>
            ))}

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="pt-6"
            >
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/howdy_cafewl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://www.facebook.com/howdycafewl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div id="map" className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg h-96 relative scroll-mt-24 md:scroll-mt-28">
              <iframe
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=700+Midnight+Dr+%23104,+Williams+Lake,+BC+V2G+4N3&zoom=15&maptype=roadmap"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Howdy Cafe Location"
              ></iframe>
              <CustomMapMarker />
            </div>
            
            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100"
            >
              <h4 className="font-heading font-bold text-xl text-gray-900 mb-2">
                Find Us Easily
              </h4>
              <p className="text-gray-600">
                Located in the heart of Williams Lake, with ample parking available
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-heading font-bold mb-4">
              Ready to Experience the Fusion?
            </h3>
            <p className="text-xl mb-6 opacity-90">
              Call ahead for reservations or just drop by - we can't wait to serve you!
            </p>
            <a
              href="tel:+12365919147"
              className="bg-white text-primary font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300 inline-block"
            >
              Call Now: (236) 591-9147
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact; 