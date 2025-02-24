import React, { useState } from 'react';
import { Star, ShoppingCart, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cart } from '../components/Cart';
import { Header } from '../components/Header';
import { useEasterEgg } from '../hooks/useEasterEgg';
import { SHOP_CATEGORIES } from '../data/categories';
import { AuthModal } from '../components/auth/AuthModal';
import { ProfileMenu } from '../components/ProfileMenu';
import type { Item } from '../types';

export const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [cartItems, setCartItems] = useState<Array<{ item: Item; quantity: number }>>([]);
  const [floatingItems, setFloatingItems] = useState<Array<{
    id: string;
    item: Item;
    startX: number;
    startY: number;
  }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<Set<number>>(new Set());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { poopClicks, floatingPoops, handlePoopClick } = useEasterEgg();
  const cartCount = cartItems.reduce((sum, { quantity }) => sum + quantity, 0);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setUserName('John Doe');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('');
  };

  const addToCart = (item: Item, event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const startX = event.clientX - rect.left;
    const startY = event.clientY - rect.top;

    const newFloatingItem = {
      id: `${item.id}-${Date.now()}`,
      item,
      startX,
      startY,
    };

    setFloatingItems((prev) => [...prev, newFloatingItem]);
    
    setTimeout(() => {
      setFloatingItems((prev) => prev.filter((fi) => fi.id !== newFloatingItem.id));
      
      setCartItems(prev => {
        const existingItem = prev.find(({ item: i }) => i.id === item.id);
        if (existingItem) {
          return prev.map(cartItem =>
            cartItem.item.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        }
        return [...prev, { item, quantity: 1 }];
      });
    }, 1000);
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    setCartItems(prev =>
      prev.map(cartItem =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );
  };

  const removeItem = (itemId: number) => {
    setCartItems(prev => prev.filter(({ item }) => item.id !== itemId));
  };

  const openCart = () => {
    setIsCartLoading(true);
    setIsCartOpen(true);
    setTimeout(() => setIsCartLoading(false), 1500);
  };

  const handlePurchaseComplete = () => {
    const newPurchasedItems = new Set(purchasedItems);
    cartItems.forEach(({ item }) => {
      newPurchasedItems.add(item.id);
    });
    setPurchasedItems(newPurchasedItems);
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-[#1a1c20] text-white">
      {/* Mobile Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <ProfileMenu onLogout={handleLogout} userName={userName} />
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-burbank hover:opacity-90 transition-opacity text-sm"
              >
                Sign In
              </button>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={openCart}
              className="relative"
            >
              <ShoppingCart className={`w-6 h-6 text-white ${isCartLoading ? 'animate-pulse' : ''}`} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  >
                    {cartCount}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block fixed top-4 right-4 z-50 flex items-center gap-4">
        {isAuthenticated ? (
          <ProfileMenu onLogout={handleLogout} userName={userName} />
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-burbank hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={openCart}
          className="relative"
        >
          <ShoppingCart className={`w-8 h-8 text-white ${isCartLoading ? 'animate-pulse' : ''}`} />
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
              >
                {cartCount}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="pt-16 lg:pt-0 p-4 lg:p-8">
        <Header 
          poopClicks={poopClicks}
          onPoopClick={handlePoopClick}
          floatingPoops={floatingPoops}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {Object.entries(SHOP_CATEGORIES).map(([key, category]) => (
            <div
              key={key}
              className="bg-gray-800 rounded-xl p-4 lg:p-6 hover:bg-gray-700 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                {category.icon()}
                <h2 className="font-burbank text-xl lg:text-2xl">{category.title}</h2>
              </div>
              <p className="text-gray-400 mb-4 text-sm lg:text-base">{category.description}</p>
              <div className="space-y-4">
                {category.items.map((item) => (
                  <motion.div 
                    key={item.id} 
                    className="bg-gray-900 rounded-lg p-4 cursor-pointer relative overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedItem(item)}
                  >
                    {purchasedItems.has(item.id) && (
                      <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                        Previously Bought
                      </div>
                    )}
                    <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                    <h3 className="font-burbank text-lg lg:text-xl mb-2">{item.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {Array.from({ length: item.quality }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                    <p className="text-xl lg:text-2xl font-burbank text-green-400">${item.price}</p>
                    <p className="text-sm text-gray-500 mt-2 italic">{item.sellerComment}</p>
                    <motion.button
                      className="absolute bottom-4 right-4 bg-purple-500 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-sm lg:text-base"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item, e);
                      }}
                    >
                      Add to Cart
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gray-800 rounded-xl p-4 lg:p-6 max-w-lg w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <img 
                src={selectedItem.image} 
                alt={selectedItem.name}
                className="w-full h-48 lg:h-64 object-cover rounded-lg mb-4 lg:mb-6"
              />
              
              <h2 className="font-burbank text-2xl lg:text-3xl mb-2">{selectedItem.name}</h2>
              
              <div className="flex items-center gap-2 mb-4">
                {Array.from({ length: selectedItem.quality }).map((_, i) => (
                  <Star key={i} className="w-4 lg:w-5 h-4 lg:h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-300 mb-4 text-sm lg:text-base">{selectedItem.description}</p>
              
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <p className="text-gray-300 italic text-sm lg:text-base">{selectedItem.sellerComment}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-2xl lg:text-3xl font-burbank text-green-400">
                  ${selectedItem.price}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    addToCart(selectedItem, e);
                    setSelectedItem(null);
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-burbank text-lg lg:text-xl hover:opacity-90 transition-opacity"
                >
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Component */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onPurchaseComplete={handlePurchaseComplete}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Floating Items Animation */}
      <AnimatePresence>
        {floatingItems.map(({ id, startX, startY }) => (
          <motion.div
            key={id}
            initial={{ 
              position: 'fixed',
              x: startX,
              y: startY,
              scale: 1,
              opacity: 1,
              zIndex: 100
            }}
            animate={{
              x: window.innerWidth - 60,
              y: 20,
              scale: 0.5,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
              duration: 1
            }}
            className="pointer-events-none"
          >
            <ShoppingCart className="w-8 h-8 text-purple-500" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};