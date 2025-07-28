import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { supabase, type Promo, type MenuItem, type Category } from '../lib/supabase';

const PromoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activePromos, setActivePromos] = useState<Promo[]>([]);
  const [promoItems, setPromoItems] = useState<{ [key: string]: MenuItem[] }>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch active promos and related data
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current date in ISO format
        const now = new Date().toISOString();

        // Fetch active promos
        const { data: promosData, error: promosError } = await supabase
          .from('promos')
          .select('*')
          .eq('is_active', true)
          .gte('end_date', now)
          .lte('start_date', now)
          .order('created_at', { ascending: false });

        if (promosError) {
          console.error('Error fetching promos:', promosError);
          setError(`Error loading promotions: ${promosError.message}`);
          return;
        }

        console.log('Active promos:', promosData);
        setActivePromos(promosData || []);

        // Fetch categories for reference
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order');

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
        } else {
          setCategories(categoriesData || []);
        }

        // Fetch menu items for each promo
        const promoItemsMap: { [key: string]: MenuItem[] } = {};
        
        for (const promo of promosData || []) {
          let itemsQuery = supabase.from('menu_items').select('*');
          
          if (promo.applies_to === 'specific_categories' && promo.category_ids) {
            itemsQuery = itemsQuery.in('category_id', promo.category_ids);
          } else if (promo.applies_to === 'specific_items' && promo.item_ids) {
            itemsQuery = itemsQuery.in('id', promo.item_ids);
          }
          // For 'all_items', we'll fetch all items
          
          const { data: itemsData, error: itemsError } = await itemsQuery;
          
          if (itemsError) {
            console.error(`Error fetching items for promo ${promo.id}:`, itemsError);
            continue;
          }
          
          promoItemsMap[promo.id] = itemsData || [];
        }

        setPromoItems(promoItemsMap);
      } catch (error) {
        console.error('Error fetching promo data:', error);
        setError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  const calculateDiscountedPrice = (originalPrice: number, promo: Promo): number => {
    if (promo.discount_type === 'percentage') {
      return Math.max(0, originalPrice - (originalPrice * promo.discount_value / 100));
    } else {
      return Math.max(0, originalPrice - promo.discount_value);
    }
  };

  const formatDiscount = (promo: Promo): string => {
    if (promo.discount_type === 'percentage') {
      return `${promo.discount_value}% OFF`;
    } else {
      return `$${promo.discount_value.toFixed(2)} OFF`;
    }
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const getPromoScope = (promo: Promo): string => {
    switch (promo.applies_to) {
      case 'all_items':
        return 'All Menu Items';
      case 'specific_categories':
        if (promo.category_ids && promo.category_ids.length > 0) {
          const categoryNames = promo.category_ids.map(getCategoryName);
          return categoryNames.join(', ');
        }
        return 'Selected Categories';
      case 'specific_items':
        return `${promoItems[promo.id]?.length || 0} Selected Items`;
      default:
        return 'Unknown Scope';
    }
  };

  // Show error if there's an error
  if (error) {
    return (
      <section id="promos" className="section-padding bg-gradient-to-br from-red-50 to-pink-50">
        <div className="container-custom">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-red-900 via-red-800 to-red-900 bg-clip-text text-transparent mb-6">
              Special Offers
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 mx-auto mb-8 rounded-full"></div>
          </motion.div>

          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-red-800 mb-4">Promotions Loading Error</h3>
              <p className="text-red-700 mb-6">{error}</p>
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

  // Show loading if still loading
  if (loading) {
    return (
      <section id="promos" className="section-padding bg-gradient-to-br from-red-50 to-pink-50">
        <div className="container-custom">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-red-900 via-red-800 to-red-900 bg-clip-text text-transparent mb-6">
              Special Offers
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 mx-auto mb-8 rounded-full"></div>
          </motion.div>

          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading special offers...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show message if no active promos
  if (activePromos.length === 0) {
    return (
      <section id="promos" className="section-padding bg-gradient-to-br from-red-50 to-pink-50">
        <div className="container-custom">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-red-900 via-red-800 to-red-900 bg-clip-text text-transparent mb-6">
              Special Offers
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Check back soon for amazing deals and special offers on our delicious fusion cuisine!
            </p>
          </motion.div>

          <div className="text-center py-16">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">No Active Promotions</h3>
              <p className="text-gray-600 mb-6">We're currently not running any special offers, but our regular menu is always delicious!</p>
              <p className="text-sm text-gray-500">Follow us on social media to be the first to know about new promotions!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="promos" className="section-padding bg-gradient-to-br from-red-50 to-pink-50">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-red-900 via-red-800 to-red-900 bg-clip-text text-transparent mb-6">
            Special Offers
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Don't miss out on these amazing deals! Limited time offers on our favorite dishes.
          </p>
        </motion.div>

        <div className="space-y-8">
          {activePromos.map((promo, promoIndex) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: promoIndex * 0.1 }}
              className="bg-white rounded-3xl shadow-xl border border-red-100 overflow-hidden"
            >
              {/* Promo Header */}
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 md:p-8 text-white relative">
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                  {formatDiscount(promo)}
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{promo.name}</h3>
                    <p className="text-red-100 text-sm md:text-base">{promo.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-red-100 mb-1">Valid until</div>
                    <div className="font-bold text-lg">
                      {new Date(promo.end_date).toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Details */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="font-semibold text-gray-900">Scope</div>
                    <div className="text-sm text-gray-600">{getPromoScope(promo)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">💰</div>
                    <div className="font-semibold text-gray-900">Discount</div>
                    <div className="text-sm text-gray-600">{formatDiscount(promo)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="font-semibold text-gray-900">Usage</div>
                    <div className="text-sm text-gray-600">
                      {promo.current_uses} / {promo.max_uses || '∞'}
                    </div>
                  </div>
                </div>

                {/* Promo Items */}
                {promoItems[promo.id] && promoItems[promo.id].length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Items on Sale</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {promoItems[promo.id].map((item) => {
                        const discountedPrice = calculateDiscountedPrice(item.price, promo);
                        const savings = item.price - discountedPrice;
                        
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
                          >
                            <div className="relative">
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-40 object-cover"
                              />
                              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                SAVE ${savings.toFixed(2)}
                              </div>
                            </div>
                            <div className="p-4">
                              <h5 className="font-bold text-gray-900 mb-2">{item.name}</h5>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg font-bold text-red-600">
                                    ${discountedPrice.toFixed(2)}
                                  </span>
                                  <span className="text-sm text-gray-500 line-through">
                                    ${item.price.toFixed(2)}
                                  </span>
                                </div>
                                {promo.promo_code && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    Code: {promo.promo_code}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Promo Terms */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h5 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Offer valid until {new Date(promo.end_date).toLocaleDateString()}</li>
                    <li>• Cannot be combined with other promotions</li>
                    <li>• Subject to availability</li>
                    {promo.max_uses && (
                      <li>• Limited to {promo.max_uses} uses</li>
                    )}
                    {promo.promo_code && (
                      <li>• Use promo code: <span className="font-mono font-bold">{promo.promo_code}</span></li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Hungry for More Deals?</h3>
            <p className="text-red-100 mb-6">Follow us on social media to stay updated with our latest promotions and special offers!</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                Follow on Instagram
              </button>
              <button className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                Follow on Facebook
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PromoSection; 