import { motion } from 'framer-motion';
import { Heart, MapPin, Phone, Mail, Clock, Instagram, Facebook, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import logoWhite from '../assets/Howdy Cafe Logo - Horizontal Whiet Text.png';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const funFacts = [
    {
      icon: "🍞",
      text: "Pakistan has over 40 different types of bread! From naan to roti, each region has its own unique style."
    },
    {
      icon: "🥘",
      text: "Biryani originated in the royal kitchens of the Mughal Empire and has over 26 different regional variations in Pakistan!"
    },
    {
      icon: "🌶️",
      text: "Pakistani cuisine uses over 50 different spices, with garam masala being the most essential blend in every kitchen."
    },
    {
      icon: "🍖",
      text: "Karahi, the iconic Pakistani dish, gets its name from the wok-like cooking vessel used to prepare it."
    },
    {
      icon: "🥛",
      text: "Lassi, Pakistan's traditional yogurt drink, has been consumed for over 4,000 years and comes in sweet, salty, and fruity varieties."
    },
    {
      icon: "🌿",
      text: "Pakistani basmati rice from Punjab is considered the world's finest, with its long grains and aromatic fragrance."
    },
    {
      icon: "🍵",
      text: "Pakistan is the world's 3rd largest tea importer, with chai being a cultural cornerstone served 3-4 times daily."
    },
    {
      icon: "🥖",
      text: "The longest naan bread ever made was 1.5 kilometers long and created in Pakistan in 2019!"
    },
    {
      icon: "🍯",
      text: "Pakistani honey from the mountains of Khyber Pakhtunkhwa is famous for its medicinal properties and unique floral taste."
    },
    {
      icon: "🌾",
      text: "Pakistan is the world's 8th largest wheat producer, making it the breadbasket of South Asia."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % funFacts.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [funFacts.length]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubscriptionStatus('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    setSubscriptionStatus('');

    try {
      // Google Apps Script Web App URL - using GET method to avoid CORS issues
      const webAppUrl = 'https://script.google.com/macros/s/AKfycbwKd60rA8qJrWm2VLZ1tCzjK6rp3Piia63GPac5wGd3DVdFbO6ERKjiBqGZVc8wzf25/exec';
      
      // Use GET request with email as parameter (works better with Google Apps Script)
      const response = await fetch(`${webAppUrl}?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        mode: 'cors'
      });

      const result = await response.json();

      if (result.success) {
        setSubscriptionStatus('Thank you for subscribing! 🎉');
        setEmail('');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSubscriptionStatus('');
        }, 3000);
      } else {
        setSubscriptionStatus(result.message || 'Something went wrong. Please try again.');
      }
      
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      
      // Fallback: Try with no-cors mode
      try {
        const webAppUrl = 'https://script.google.com/macros/s/AKfycbwKd60rA8qJrWm2VLZ1tCzjK6rp3Piia63GPac5wGd3DVdFbO6ERKjiBqGZVc8wzf25/exec';
        
        await fetch(`${webAppUrl}?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          mode: 'no-cors'
        });

        // Since no-cors mode doesn't allow reading the response,
        // we'll assume success if no error was thrown
        setSubscriptionStatus('Thank you for subscribing! 🎉');
        setEmail('');
        
        setTimeout(() => {
          setSubscriptionStatus('');
        }, 3000);
        
      } catch (fallbackError) {
        console.error('Fallback subscription error:', fallbackError);
        setSubscriptionStatus('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/howdy_cafewl/", label: "Instagram" },
    { icon: Facebook, href: "https://www.facebook.com/howdycafewl", label: "Facebook" }
  ];

  const quickLinks = [
    { name: "About Us", href: "#about" },
    { name: "Our Menu", href: "#menu" },
    { name: "Contact", href: "#contact" },
    { name: "Reservations", href: "#contact" },
    { name: "Catering", href: "#contact" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container-custom py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
            
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <motion.div 
                className="mb-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src={logoWhite} 
                  alt="Howdy Cafe Logo" 
                  className="h-16 md:h-20 object-contain"
                />
              </motion.div>
              
              <p className="text-amber-100 text-lg mb-6 font-light">
                Fuel your fun with every bite!
              </p>
              
              <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-md">
                Discover the perfect blend of authentic Pakistani spices and fresh Canadian ingredients, 
                served with genuine warmth in our family-owned kitchen where every dish tells a story of tradition and love.
              </p>

              {/* Contact Info */}
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center gap-3 text-gray-300 hover:text-amber-400 transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <span>700 Midnight Dr #104, Williams Lake, BC V2G 4N3</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-3 text-gray-300 hover:text-amber-400 transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Phone className="w-5 h-5 text-amber-400" />
                  <span>(236) 591-9147</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-3 text-gray-300 hover:text-amber-400 transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Mail className="w-5 h-5 text-amber-400" />
                  <span>hello@howdycafe.ca</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-heading font-semibold mb-6 text-amber-400">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li key={index}>
                    <motion.a 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-all duration-300 flex items-center group"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {link.name}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Business Hours */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-heading font-semibold mb-6 text-amber-400 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Business Hours
              </h4>
              
              <div className="space-y-4">
                <motion.div 
                  className="flex justify-between items-center p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                  whileHover={{ backgroundColor: "rgba(251, 191, 36, 0.1)" }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-gray-300">Mon - Sun</span>
                  <span className="text-amber-400 font-medium">7am - 9pm</span>
                </motion.div>
              </div>

              {/* Fun Fact */}
              <motion.div 
                className="mt-6 p-4 rounded-lg bg-gradient-to-r from-amber-400/10 to-orange-500/10 border border-amber-400/20"
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-400 font-semibold text-lg">💡</span>
                  <span className="text-amber-400 font-semibold">Did You Know?</span>
                </div>
                <motion.p 
                  key={currentFactIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-gray-400 text-sm"
                >
                  {funFacts[currentFactIndex].text} {funFacts[currentFactIndex].icon}
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="border-t border-gray-800/50 backdrop-blur-sm">
          <div className="container-custom py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Social Media */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex items-center gap-6"
              >
                <span className="text-gray-400 text-sm font-medium">Follow Us:</span>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:bg-amber-400/20 hover:border-amber-400/40 transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Copyright */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-center gap-4 text-gray-400 text-sm text-center md:text-left"
              >
                <span>© {new Date().getFullYear()} Howdy Cafe. All rights reserved.</span>
                <div className="flex items-center gap-1">
                  <span>Made with</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
                  </motion.div>
                  <span>in Williams Lake, BC</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-1">
                  <span>Powered by</span>
                  <a
                    href="https://aurorabusiness.ca"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent animate-pulse hover:animate-none transition-all duration-300 text-center"
                  >
                    Aurora N&N Business Solution Inc.
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-gray-800/50 bg-gradient-to-r from-amber-400/5 to-orange-500/5"
        >
          <div className="container-custom py-8">
            <div className="text-center max-w-2xl mx-auto">
              <h4 className="text-xl font-heading font-semibold mb-3 text-amber-400">
                Stay Updated with Our Latest Dishes
              </h4>
              <p className="text-gray-400 mb-6">
                Subscribe to our newsletter for exclusive offers and new menu updates
              </p>
              
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400/60 focus:bg-white/15 transition-all duration-300"
                    disabled={isSubscribing}
                  />
                  <motion.button
                    type="submit"
                    disabled={isSubscribing}
                    className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-medium rounded-full hover:from-orange-500 hover:to-red-500 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isSubscribing ? { scale: 1.05 } : {}}
                    whileTap={!isSubscribing ? { scale: 0.95 } : {}}
                  >
                    {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                  </motion.button>
                </div>
                
                {/* Status Message */}
                {subscriptionStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-3 text-sm ${
                      subscriptionStatus.includes('Thank you') 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}
                  >
                    {subscriptionStatus}
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 