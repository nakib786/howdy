import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedTagline, setSelectedTagline] = useState('');

  const funTaglines = [
    "Oops! Looks like this page took a wrong turn at Albuquerque! 🤠",
    "This page seems to have wandered off like a lost cowboy! 🌵",
    "404: The page you're looking for is probably having a coffee break ☕",
    "This page is more elusive than a wild mustang! 🐎",
    "Looks like this page got lost in the Canadian wilderness! 🍁",
    "This page is playing hide and seek - and it's winning! 🙈",
    "404: The page decided to go on a Pakistani-Canadian fusion adventure! 🌶️🍁",
    "This page is currently exploring the great outdoors! 🏔️",
    "Looks like this page took the scenic route! 🛤️",
    "This page is probably enjoying some biryani somewhere else! 🍛"
  ];

  // Select random tagline once on mount
  useEffect(() => {
    const randomTagline = funTaglines[Math.floor(Math.random() * funTaglines.length)];
    setSelectedTagline(randomTagline);
  }, []);

  // Auto-redirect after 10 seconds with countdown
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 10000);

    const countdownTimer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownTimer);
    };
  }, [navigate]);

  // Trigger animation on mount
  useEffect(() => {
    setIsAnimating(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🍁</div>
        <div className="absolute top-20 right-20 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>🌶️</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-bounce" style={{ animationDelay: '2s' }}>☕</div>
        <div className="absolute bottom-10 right-10 text-3xl animate-bounce" style={{ animationDelay: '3s' }}>🍛</div>
        <div className="absolute top-1/2 left-1/4 text-2xl animate-pulse" style={{ animationDelay: '0.5s' }}>🤠</div>
        <div className="absolute top-1/3 right-1/4 text-2xl animate-pulse" style={{ animationDelay: '1.5s' }}>🐎</div>
      </div>

      <div className="text-center max-w-2xl mx-auto relative z-10">
        {/* Fun 404 Design with animations */}
        <div className={`mb-8 transition-all duration-1000 ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <h1 className={`text-9xl font-bold text-orange-500 mb-4 transition-all duration-1000 ${isAnimating ? 'animate-pulse' : ''}`}>404</h1>
          <div className={`text-6xl mb-4 transition-all duration-1000 ${isAnimating ? 'animate-bounce' : ''}`}>🤠</div>
        </div>

        {/* Tagline with slide-in animation */}
        <div className={`transition-all duration-1000 delay-300 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
            {selectedTagline}
          </h2>
        </div>

        {/* Description with slide-in animation */}
        <div className={`transition-all duration-1000 delay-500 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-lg text-gray-600 mb-8">
            Don't worry, partner! We'll get you back to the main trail in just a moment.
          </p>
        </div>

        {/* Action Buttons with slide-in animation */}
        <div className={`space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center transition-all duration-1000 delay-700 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={() => navigate('/')}
            className="w-full md:w-auto px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 active:scale-95"
          >
            🏠 Head Back Home
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full md:w-auto px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 active:scale-95"
          >
            ⬅️ Go Back
          </button>
        </div>

        {/* Auto-redirect notice with countdown animation */}
        <div className={`mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200 transition-all duration-1000 delay-900 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-sm text-orange-700">
            ⏰ You'll be automatically redirected to our homepage in <span className="font-bold text-orange-600 animate-pulse">{countdown}</span> seconds...
          </p>
        </div>

        {/* Fun decorative elements with floating animation */}
        <div className={`mt-12 flex justify-center space-x-4 text-4xl transition-all duration-1000 delay-1000 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>🍁</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🌶️</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>☕</span>
          <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🍛</span>
          <span className="animate-bounce" style={{ animationDelay: '0.8s' }}>🤠</span>
        </div>

        {/* Howdy Cafe branding with fade-in animation */}
        <div className={`mt-8 pt-8 border-t border-orange-200 transition-all duration-1000 delay-1100 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-gray-500 text-sm">
            Howdy Cafe - Where Pakistani meets Canadian hospitality
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 