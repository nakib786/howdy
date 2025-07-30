import howdyLogo from '../assets/Howdy Cafe Logo - Stacked Black Text.png';

const CustomMapMarker = () => {
  const address = "700 Midnight Dr #104, Williams Lake, BC V2G 4N3";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <a
      href={googleMapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 group"
      aria-label="Get directions to Howdy Cafe"
      style={{ display: 'inline-block' }}
    >
      <img
        src={howdyLogo}
        alt="Howdy Cafe"
        className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl"
        draggable={false}
      />
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Click for directions
        </div>
        <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute top-full left-1/2 -translate-x-1/2 -mt-1"></div>
      </div>
    </a>
  );
};

export default CustomMapMarker; 