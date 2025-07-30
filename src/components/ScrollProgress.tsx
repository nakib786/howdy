import { useEffect, useState } from 'react';

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div 
        className="h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 transition-all duration-300 ease-out shadow-lg"
        style={{ width: `${scrollProgress}%` }}
      />
      <div className="h-1 bg-gray-200/20" />
    </div>
  );
};

export default ScrollProgress; 