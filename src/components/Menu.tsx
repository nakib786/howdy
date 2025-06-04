import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

// Halal Logo Component
const HalalLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg 
    viewBox="0 0 607 607" 
    className={className}
    fill="currentColor"
  >
    <circle cx="303.5" cy="303.5" r="303.5" fill="#00A651"/>
    <path d="M303.5 50C162.5 50 50 162.5 50 303.5S162.5 557 303.5 557 557 444.5 557 303.5 444.5 50 303.5 50zm0 457C187.5 507 100 419.5 100 303.5S187.5 100 303.5 100 507 187.5 507 303.5 419.5 507 303.5 507z" fill="white"/>
    <text x="303.5" y="330" textAnchor="middle" fontSize="120" fontFamily="Arial, sans-serif" fontWeight="bold" fill="white">حلال</text>
    <text x="303.5" y="380" textAnchor="middle" fontSize="40" fontFamily="Arial, sans-serif" fontWeight="bold" fill="white">HALAL</text>
  </svg>
);

const Menu = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState('fusion');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showStickyMobileMenu, setShowStickyMobileMenu] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  // Handle sticky behavior for mobile dropdown
  useEffect(() => {
    const handleScroll = () => {
      if (mobileDropdownRef.current) {
        const rect = mobileDropdownRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { id: 'appetizers', name: 'Appetizers', icon: '🥟', gradient: 'from-orange-400 to-red-500' },
    { id: 'fusion', name: 'Fusion Specials', icon: '🍁🔥', gradient: 'from-purple-500 to-pink-500' },
    { id: 'pakistani', name: 'Pakistani Classics', icon: '🌶️', gradient: 'from-green-500 to-emerald-600' },
    { id: 'canadian', name: 'Canadian Favorites', icon: '🍯', gradient: 'from-red-500 to-orange-500' },
    { id: 'beverages', name: 'Beverages', icon: '🧋', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'desserts', name: 'Desserts', icon: '🍰', gradient: 'from-pink-500 to-rose-500' },
  ];

  const menuItems = {
    appetizers: [
      {
        name: 'Samosa Poutine Bites',
        description: 'Mini samosas filled with spiced potatoes, served with tamarind gravy and cheese curds',
        price: '$12.99',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌱', '🌶️', 'halal'],
        popular: true
      },
      {
        name: 'Tandoori Chicken Wings',
        description: 'Crispy wings marinated in tandoori spices with mint yogurt dip',
        price: '$14.99',
        image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌶️', '🥛', 'halal'],
        popular: false
      },
      {
        name: 'Pakora Platter',
        description: 'Mixed vegetable fritters with house-made chutneys and maple dipping sauce',
        price: '$11.99',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌱', '🌶️', 'halal'],
        popular: false
      },
      {
        name: 'Chaat Nachos',
        description: 'Crispy papadums topped with chickpeas, yogurt, chutneys, and pomegranate',
        price: '$13.99',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌱', '🥛', 'halal'],
        popular: true
      },
      {
        name: 'Maple Glazed Seekh Rolls',
        description: 'Spiced lamb seekh wrapped in naan with maple-mint chutney',
        price: '$15.99',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌶️', 'halal'],
        popular: false
      },
      {
        name: 'Dahi Bhalla Sliders',
        description: 'Mini lentil dumplings in yogurt with sweet and tangy chutneys',
        price: '$10.99',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌱', '🥛', 'halal'],
        popular: false
      }
    ],
    fusion: [
      {
        name: 'Butter Chicken Poutine',
        description: 'Crispy fries topped with butter chicken, cheese curds, and naan crumbs',
        price: '$16.99',
        image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌶️', '🥛', 'halal'],
        popular: true
      },
      {
        name: 'Maple Glazed Biryani',
        description: 'Traditional biryani with a Canadian maple syrup glaze and toasted almonds',
        price: '$18.99',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌶️', 'halal'],
        popular: true
      },
      {
        name: 'Tandoori Salmon Burger',
        description: 'Tandoori-spiced BC salmon with mint chutney on a brioche bun',
        price: '$19.99',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌶️', '🐟', 'halal'],
        popular: false
      },
      {
        name: 'Curry Poutine Bowl',
        description: 'Deconstructed poutine with curry gravy, paneer, and fresh herbs',
        price: '$14.99',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌱', '🥛', '🌶️', 'halal'],
        popular: false
      },
      {
        name: 'Naan Pizza Margherita',
        description: 'Garlic naan base with tomato curry sauce, mozzarella, and fresh basil',
        price: '$15.99',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌱', '🥛', 'halal'],
        popular: false
      },
      {
        name: 'Tikka Masala Mac & Cheese',
        description: 'Creamy mac and cheese with tikka masala sauce and grilled chicken',
        price: '$17.99',
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌶️', '🥛', 'halal'],
        popular: true
      }
    ],
    pakistani: [
      {
        name: 'Chicken Karahi',
        description: 'Traditional wok-cooked chicken with tomatoes, ginger, and aromatic spices',
        price: '$17.99',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌶️', 'halal'],
        popular: true
      },
      {
        name: 'Lamb Biryani',
        description: 'Fragrant basmati rice layered with tender lamb and traditional spices',
        price: '$22.99',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌶️', 'halal'],
        popular: true
      },
      {
        name: 'Seekh Kebab Platter',
        description: 'Grilled spiced lamb skewers served with naan and mint chutney',
        price: '$19.99',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌶️', 'halal'],
        popular: false
      },
      {
        name: 'Palak Paneer',
        description: 'Creamy spinach curry with house-made paneer cheese',
        price: '$15.99',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌱', '🥛', '🌶️', 'halal'],
        popular: false
      },
      {
        name: 'Chicken Tikka Masala',
        description: 'Tender chicken in rich tomato-cream sauce with aromatic spices',
        price: '$18.99',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌶️', '🥛', 'halal'],
        popular: true
      },
      {
        name: 'Dal Makhani',
        description: 'Slow-cooked black lentils in creamy tomato sauce with butter and cream',
        price: '$14.99',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌱', '🥛', 'halal'],
        popular: false
      }
    ],
    canadian: [
      {
        name: 'Classic Poutine',
        description: 'Hand-cut fries with cheese curds and rich gravy',
        price: '$12.99',
        image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🥛', 'halal'],
        popular: true
      },
      {
        name: 'Maple Glazed Salmon',
        description: 'Fresh BC salmon with maple glaze and seasonal vegetables',
        price: '$24.99',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🐟', 'halal'],
        popular: true
      },
      {
        name: 'Tourtière',
        description: 'Traditional meat pie with a flaky crust and savory filling',
        price: '$16.99',
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['halal'],
        popular: false
      },
      {
        name: 'Montreal Smoked Meat Sandwich',
        description: 'Tender smoked meat on rye bread with mustard and pickles',
        price: '$15.99',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['halal'],
        popular: false
      },
      {
        name: 'Bannock Bread & Soup',
        description: 'Traditional Indigenous bread served with hearty seasonal soup',
        price: '$13.99',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌱', 'halal'],
        popular: false
      },
      {
        name: 'Butter Chicken Shepherd\'s Pie',
        description: 'Canadian comfort food meets Indian flavors with spiced mashed potatoes',
        price: '$18.99',
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌶️', '🥛', 'halal'],
        popular: true
      }
    ],
    beverages: [
      {
        name: 'Masala Chai Latte',
        description: 'Traditional spiced tea with steamed milk and a touch of maple syrup',
        price: '$5.99',
        image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🥛', '🌶️', 'halal'],
        popular: true
      },
      {
        name: 'Mango Lassi',
        description: 'Creamy yogurt drink blended with fresh mango and cardamom',
        price: '$6.99',
        image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🥛', '🌱', 'halal'],
        popular: true
      },
      {
        name: 'Maple Iced Tea',
        description: 'Refreshing black tea sweetened with Canadian maple syrup',
        price: '$4.99',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌱', 'halal'],
        popular: false
      },
      {
        name: 'Rose Milk Tea',
        description: 'Fragrant rose-flavored milk tea with a hint of cardamom',
        price: '$5.99',
        image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🥛', 'halal'],
        popular: false
      },
      {
        name: 'Fresh Lime Soda',
        description: 'Sparkling water with fresh lime juice and mint',
        price: '$4.99',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🌱', 'halal'],
        popular: false
      },
      {
        name: 'Spiced Hot Chocolate',
        description: 'Rich hot chocolate infused with cardamom and cinnamon',
        price: '$6.99',
        image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🥛', 'halal'],
        popular: false
      }
    ],
    desserts: [
      {
        name: 'Butter Tarts',
        description: 'Classic Canadian dessert with a sweet, gooey filling',
        price: '$8.99',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🥛', 'halal'],
        popular: true
      },
      {
        name: 'Gulab Jamun Cheesecake',
        description: 'Fusion dessert combining traditional gulab jamun with New York cheesecake',
        price: '$9.99',
        image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🥛', 'halal'],
        popular: true
      },
      {
        name: 'Maple Kulfi',
        description: 'Traditional Indian ice cream infused with Canadian maple syrup',
        price: '$7.99',
        image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🥛', 'halal'],
        popular: false
      },
      {
        name: 'Nanaimo Bar Barfi',
        description: 'Pakistani milk fudge inspired by the classic Canadian Nanaimo bar',
        price: '$8.99',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🥛', 'halal'],
        popular: false
      },
      {
        name: 'Cardamom Crème Brûlée',
        description: 'Classic French dessert with aromatic cardamom and rose petals',
        price: '$10.99',
        image: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🥛', 'halal'],
        popular: true
      },
      {
        name: 'Ras Malai Tiramisu',
        description: 'Italian classic meets Indian flavors with saffron-soaked ladyfingers',
        price: '$11.99',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        dietary: ['🥛', 'halal'],
        popular: false
      }
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const getDietaryIcon = (icon: string) => {
    const icons: { [key: string]: string } = {
      '🌱': 'Vegetarian',
      '🌶️': 'Spicy',
      '🥛': 'Contains Dairy',
      '🐟': 'Contains Fish',
      'halal': 'Halal Certified'
    };
    return icons[icon] || icon;
  };

  const renderDietaryIcon = (diet: string) => {
    if (diet === 'halal') {
      return <HalalLogo className="w-4 h-4" />;
    }
    return <span>{diet}</span>;
  };

  const currentCategory = categories.find(cat => cat.id === activeCategory);

  return (
    <section id="menu" className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
            Our Menu
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary via-pink-500 to-primary mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover our carefully crafted fusion dishes that celebrate the best of both worlds, 
            where Pakistani spices meet Canadian comfort
          </p>
        </motion.div>

        {/* Desktop Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`group relative px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wide transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category.id
                  ? `bg-gradient-to-r ${category.gradient} text-white shadow-2xl scale-105`
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </div>
              {activeCategory === category.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Mobile Category Selector */}
        <div ref={mobileDropdownRef} className="md:hidden mb-8">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className={`w-full bg-gradient-to-r ${currentCategory?.gradient} text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-between`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{currentCategory?.icon}</span>
              <span>{currentCategory?.name}</span>
            </div>
            <motion.div
              animate={{ rotate: showMobileMenu ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </button>

          {/* Mobile Dropdown Menu */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: showMobileMenu ? 1 : 0, 
              height: showMobileMenu ? 'auto' : 0 
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-white rounded-2xl shadow-lg mt-2 border border-gray-100"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setShowMobileMenu(false);
                }}
                className={`w-full px-6 py-4 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-200 ${
                  activeCategory === category.id ? 'bg-gray-50 border-l-4 border-primary' : ''
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium text-gray-900">{category.name}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Sticky Mobile Category Bar */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ 
            y: isSticky ? 0 : -100, 
            opacity: isSticky ? 1 : 0 
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200"
        >
          <div className="px-4 py-3">
            <button
              onClick={() => setShowStickyMobileMenu(!showStickyMobileMenu)}
              className={`w-full bg-gradient-to-r ${currentCategory?.gradient} text-white px-4 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-between`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{currentCategory?.icon}</span>
                <span>{currentCategory?.name}</span>
              </div>
              <motion.div
                animate={{ rotate: showStickyMobileMenu ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>

            {/* Sticky Mobile Dropdown */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: showStickyMobileMenu ? 1 : 0, 
                height: showStickyMobileMenu ? 'auto' : 0 
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-white rounded-xl shadow-lg mt-2 border border-gray-100"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setShowStickyMobileMenu(false);
                  }}
                  className={`w-full px-4 py-3 text-left flex items-center space-x-2 hover:bg-gray-50 transition-colors duration-200 text-sm ${
                    activeCategory === category.id ? 'bg-gray-50 border-l-4 border-primary' : ''
                  }`}
                >
                  <span className="text-base">{category.icon}</span>
                  <span className="font-medium text-gray-900">{category.name}</span>
                </button>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {menuItems[activeCategory as keyof typeof menuItems].map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Popular Badge */}
                {item.popular && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    ⭐ Popular
                  </div>
                )}
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                  {item.price}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                  {item.name}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                  {item.description}
                </p>
                
                {/* Dietary Information */}
                {item.dietary.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.dietary.map((diet, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                        title={getDietaryIcon(diet)}
                      >
                        {renderDietaryIcon(diet)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dietary Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Dietary Information</h3>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span>🌱</span>
              <span>Vegetarian</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🌶️</span>
              <span>Spicy</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🥛</span>
              <span>Contains Dairy</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🐟</span>
              <span>Contains Fish</span>
            </div>
            <div className="flex items-center space-x-2">
              <HalalLogo className="w-5 h-5 text-green-600" />
              <span>Halal Certified</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Menu; 