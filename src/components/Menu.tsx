import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { supabase, type MenuItem, type Category } from '../lib/supabase';

// Mobile Menu Item Component
const MobileMenuItem = ({ 
  item, 
  getDietaryIcon, 
  renderDietaryIcon 
}: { 
  item: MenuItem; 
  getDietaryIcon: (icon: string) => string; 
  renderDietaryIcon: (diet: string) => React.ReactElement; 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
      >
        <span className="text-sm text-gray-600">
          {isExpanded ? 'Hide details' : 'View details'}
        </span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>
      
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isExpanded ? 'auto' : 0, 
          opacity: isExpanded ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pt-2 pb-4">
          <p className="text-gray-600 leading-relaxed mb-3 text-sm">
            {item.description}
          </p>
          
          {/* Mobile Dietary Information */}
          {item.dietary_tags && item.dietary_tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.dietary_tags.map((diet: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                  title={getDietaryIcon(diet)}
                >
                  {renderDietaryIcon(diet)}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Halal Logo Component
const HalalLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg 
    viewBox="0 0 607 607" 
    className={className}
    fill="currentColor"
  >
    <circle cx="303.5" cy="303.5" r="303.5" fill="#00A651"/>
    <path d="M303.5 50C162.5 50 50 162.5 50 303.5S162.5 557 303.5 557 557 444.5 557 303.5 444.5 50 303.5 50zm0 457C187.5 507 100 419.5 100 303.5S187.5 100 303.5 100 507 187.5 507 303.5 419.5 507 303.5 507z" fill="white"/>
    <path d="M303.5 50C162.5 50 50 162.5 50 303.5S162.5 557 303.5 557 557 444.5 557 303.5 444.5 50 303.5 50zm0 457C187.5 507 100 419.5 100 303.5S187.5 100 303.5 100 507 187.5 507 303.5 419.5 507 303.5 507z" fill="white"/>
    <text x="303.5" y="330" textAnchor="middle" fontSize="120" fontFamily="Arial, sans-serif" fontWeight="bold" fill="white">حلال</text>
    <text x="303.5" y="380" textAnchor="middle" fontSize="40" fontFamily="Arial, sans-serif" fontWeight="bold" fill="white">HALAL</text>
  </svg>
);

const Menu = () => {
  console.log('🚀 Menu component is rendering!');
  const ref = useRef(null);
  const menuSectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showStickyMobileMenu, setShowStickyMobileMenu] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isInMenuSection, setIsInMenuSection] = useState(false);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔍 Starting to fetch menu data...');
        
        // Test connection first
        const { error: testError } = await supabase
          .from('categories')
          .select('count')
          .limit(1);

        if (testError) {
          console.error('❌ Supabase connection error:', testError);
          setError(`Connection error: ${testError.message}. Please check your Supabase configuration.`);
          setLoading(false);
          return;
        }

        console.log('✅ Supabase connection successful');
        
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order');
        
        if (categoriesError) {
          console.error('❌ Error fetching categories:', categoriesError);
          setError(`Error loading categories: ${categoriesError.message}`);
          setLoading(false);
          return;
        }

        console.log('✅ Categories loaded:', categoriesData);
        setCategories(categoriesData || []);
        
        // Set active category to first category
        if (categoriesData && categoriesData.length > 0) {
          setActiveCategory(categoriesData[0].id);
          console.log('🎯 Active category set to:', categoriesData[0].id);
        }

        // Fetch menu items
        const { data: menuData, error: menuError } = await supabase
          .from('menu_items')
          .select('*')
          .order('created_at');
        
        if (menuError) {
          console.error('❌ Error fetching menu items:', menuError);
          setError(`Error loading menu items: ${menuError.message}`);
          setLoading(false);
          return;
        }

        console.log('✅ Menu items loaded:', menuData);
        setMenuItems(menuData || []);
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        setError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
        console.log('🏁 Data fetching completed');
      }
    };

    fetchData();
  }, []);

  // Handle sticky behavior for mobile dropdown
  useEffect(() => {
    const handleScroll = () => {
      if (mobileDropdownRef.current && menuSectionRef.current) {
        const dropdownRect = mobileDropdownRef.current.getBoundingClientRect();
        const sectionRect = menuSectionRef.current.getBoundingClientRect();
        
        // Check if we're in the menu section
        const inSection = sectionRect.top <= window.innerHeight && sectionRect.bottom >= 0;
        setIsInMenuSection(inSection);
        
        // Only show sticky if dropdown is past top AND we're still in menu section
        const shouldBeSticky = dropdownRect.top <= 0 && inSection;
        setIsSticky(shouldBeSticky);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  const filteredMenuItems = menuItems.filter(item => item.category_id === activeCategory);
  
  console.log('🎨 Rendering Menu component:');
  console.log('   - Categories count:', categories.length);
  console.log('   - Menu items count:', menuItems.length);
  console.log('   - Active category:', activeCategory);
  console.log('   - Filtered items count:', filteredMenuItems.length);
  console.log('   - Loading state:', loading);
  console.log('   - Error state:', error);

  // Show error message if there's an error
  if (error) {
    return (
      <section ref={menuSectionRef} id="menu" className="section-padding bg-gradient-to-br from-gray-50 to-white">
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
          </motion.div>

          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-red-800 mb-4">Menu Loading Error</h3>
              <p className="text-red-700 mb-6">{error}</p>
              <div className="text-sm text-red-600">
                <p className="mb-2">This might be due to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Invalid or expired Supabase API key</li>
                  <li>Database tables not created</li>
                  <li>Network connectivity issues</li>
                  <li>Supabase service temporarily unavailable</li>
                </ul>
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-6 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors duration-200"
              >
                Retry Loading
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Remove loading fallback and always render the menu
  return (
    <section ref={menuSectionRef} id="menu" className="section-padding bg-gradient-to-br from-gray-50 to-white">
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

        {/* Show loading indicator if still loading */}
        {loading && (
          <div className="text-center mb-16">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading menu...</p>
          </div>
        )}

        {/* Show error if no categories */}
        {!loading && categories.length === 0 && (
          <div className="text-center mb-16">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="text-yellow-600 text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold text-yellow-800 mb-4">No Menu Categories Available</h3>
              <p className="text-yellow-700 mb-4">The menu categories haven't been set up yet.</p>
              <p className="text-sm text-yellow-600">Please check your Supabase database configuration.</p>
            </div>
          </div>
        )}

        {/* Desktop Category Tabs */}
        {categories.length > 0 && (
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
                    ? `bg-gradient-to-r from-primary to-pink-500 text-gray-900 shadow-2xl scale-105`
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
        )}

        {/* Mobile Category Selector */}
        {categories.length > 0 && (
          <div ref={mobileDropdownRef} className="md:hidden mb-8">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`w-full bg-gradient-to-r from-primary to-pink-500 text-gray-900 px-6 py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-between`}
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
        )}

        {/* Sticky Mobile Category Bar - Only show when in menu section */}
        {categories.length > 0 && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ 
              y: isSticky && isInMenuSection ? 0 : -100, 
              opacity: isSticky && isInMenuSection ? 1 : 0 
            }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200"
          >
            <div className="px-4 py-3">
              <button
                onClick={() => setShowStickyMobileMenu(!showStickyMobileMenu)}
                className={`w-full bg-gradient-to-r from-primary to-pink-500 text-gray-900 px-4 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-between`}
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
        )}

        {/* Menu Items */}
        {filteredMenuItems.length > 0 ? (
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8"
          >
            {filteredMenuItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-40 md:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Popular Badge */}
                  {item.is_popular && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      ⭐ Popular
                    </div>
                  )}
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                    ${item.price}
                  </div>
                </div>
                
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-heading font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-primary transition-colors duration-300">
                    {item.name}
                  </h3>
                  
                  {/* Desktop: Always show description */}
                  <p className="hidden md:block text-gray-600 leading-relaxed mb-4 text-sm">
                    {item.description}
                  </p>
                  
                  {/* Mobile: Show description only when expanded */}
                  <div className="md:hidden">
                    <MobileMenuItem item={item} getDietaryIcon={getDietaryIcon} renderDietaryIcon={renderDietaryIcon} />
                  </div>
                  
                  {/* Desktop: Always show dietary information */}
                  <div className="hidden md:flex flex-wrap gap-2">
                    {item.dietary_tags && item.dietary_tags.length > 0 && 
                      item.dietary_tags.map((diet: string, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                          title={getDietaryIcon(diet)}
                        >
                          {renderDietaryIcon(diet)}
                        </span>
                      ))
                    }
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Show message if no items in current category
          !loading && activeCategory && (
            <div className="text-center py-16">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 max-w-2xl mx-auto">
                <div className="text-blue-600 text-4xl mb-4">🍽️</div>
                <h3 className="text-xl font-bold text-blue-800 mb-4">No Items in This Category</h3>
                <p className="text-blue-700">There are no menu items available in the "{currentCategory?.name}" category yet.</p>
              </div>
            </div>
          )
        )}

        {/* Dietary Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Dietary Information Guide</h3>
          <p className="text-sm text-gray-600 text-center mb-6">Understanding our dietary labels helps you make informed choices</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">🌱</span>
              <div>
                <span className="font-medium text-gray-900">Vegetarian</span>
                <p className="text-xs text-gray-500">No meat or fish ingredients</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">🌶️</span>
              <div>
                <span className="font-medium text-gray-900">Spicy</span>
                <p className="text-xs text-gray-500">Contains hot spices or peppers</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">🥛</span>
              <div>
                <span className="font-medium text-gray-900">Contains Dairy</span>
                <p className="text-xs text-gray-500">Milk, cheese, or dairy products</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">🐟</span>
              <div>
                <span className="font-medium text-gray-900">Contains Fish</span>
                <p className="text-xs text-gray-500">Fish or seafood ingredients</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">🥜</span>
              <div>
                <span className="font-medium text-gray-900">Contains Nuts</span>
                <p className="text-xs text-gray-500">Tree nuts or peanuts</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">🌾</span>
              <div>
                <span className="font-medium text-gray-900">Gluten Free</span>
                <p className="text-xs text-gray-500">No wheat, barley, or rye</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">🥚</span>
              <div>
                <span className="font-medium text-gray-900">Contains Eggs</span>
                <p className="text-xs text-gray-500">Egg or egg products</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">🦐</span>
              <div>
                <span className="font-medium text-gray-900">Contains Shellfish</span>
                <p className="text-xs text-gray-500">Shrimp, crab, or shellfish</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">🍄</span>
              <div>
                <span className="font-medium text-gray-900">Contains Mushrooms</span>
                <p className="text-xs text-gray-500">Mushroom ingredients</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <HalalLogo className="w-6 h-6 text-green-600" />
              <div>
                <span className="font-medium text-gray-900">Halal Certified</span>
                <p className="text-xs text-gray-500">Certified halal preparation</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Menu; 