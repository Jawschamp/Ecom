import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowLeft, Truck, CreditCard, Package, ArrowRight } from 'lucide-react';
import type { Item } from '../types';
import { ShippingStep } from './checkout/ShippingStep';
import { PaymentStep } from './checkout/PaymentStep';
import { Link } from 'react-router-dom';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{ item: Item; quantity: number }>;
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onPurchaseComplete: () => void;
}

const CartSkeleton = () => (
  <div className="animate-pulse">
    {[1, 2].map((i) => (
      <div key={i} className="flex gap-4 mb-6">
        <div className="w-20 lg:w-24 h-20 lg:h-24 bg-gray-700 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>
    ))}
  </div>
);

const checkoutSteps = [
  { icon: ShoppingBag, label: 'Cart' },
  { icon: Truck, label: 'Shipping' },
  { icon: CreditCard, label: 'Payment' },
  { icon: Package, label: 'Tracking' }
];

const cartVariants = {
  hidden: { 
    x: '100%',
    opacity: 0,
    y: 0
  },
  visible: { 
    x: 0,
    opacity: 1,
    y: [0, -10, 0],
    transition: { 
      x: { type: "spring", stiffness: 300, damping: 30 },
      y: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      },
      opacity: { duration: 0.2 }
    }
  },
  exit: { 
    x: '100%',
    opacity: 0,
    transition: { 
      duration: 0.2 
    }
  }
};

export const Cart: React.FC<CartProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem,
  onPurchaseComplete 
}) => {
  const [loading, setLoading] = React.useState(true);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [orderNumber, setOrderNumber] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const subtotal = items.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleShippingSubmit = (data: any) => {
    setCurrentStep(2);
  };

  const handlePaymentSubmit = (data: any) => {
    const newOrderNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
    setOrderNumber(newOrderNumber);
    onPurchaseComplete();
    setCurrentStep(3);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setCurrentStep(0);
      setOrderNumber('');
    }, 300);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ShippingStep onNext={handleShippingSubmit} />;
      case 2:
        return <PaymentStep onNext={handlePaymentSubmit} />;
      case 3:
        return (
          <div className="p-4 lg:p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h2 className="font-burbank text-xl text-white">Order #{orderNumber}</h2>
                <p className="text-gray-400">Estimated delivery: Today</p>
              </div>
            </div>

            <div className="bg-purple-500 bg-opacity-20 p-4 lg:p-6 rounded-lg mb-6">
              <h3 className="text-xl font-burbank text-white mb-2">Your order is confirmed!</h3>
              <p className="text-gray-400">We'll send you shipping confirmation when your order ships.</p>
            </div>

            <Link
              to={`/tracking/${orderNumber}`}
              className="flex items-center justify-between w-full bg-gray-700 p-4 rounded-lg mb-6 hover:bg-gray-600 transition-colors"
              onClick={handleClose}
            >
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-purple-500" />
                <div>
                  <h4 className="font-medium text-white">Track Your Package</h4>
                  <p className="text-sm text-gray-400">View real-time delivery updates</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>

            <button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-burbank text-xl py-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              Continue Shopping
            </button>
          </div>
        );
      default:
        return (
          <div className="p-4 lg:p-6">
            {loading ? (
              <CartSkeleton />
            ) : items.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {items.map(({ item, quantity }) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex gap-4 mb-6 bg-gray-800 p-4 rounded-lg"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-burbank text-lg lg:text-xl text-white mb-1">{item.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">${item.price}</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => quantity > 1 && onUpdateQuantity(item.id, quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <motion.span
                          key={quantity}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className="font-burbank text-xl min-w-[24px] text-center"
                        >
                          {quantity}
                        </motion.span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="ml-auto text-gray-400 hover:text-white transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="font-burbank text-2xl text-white mb-2">Your cart is empty</h3>
                <p className="text-gray-400 mb-6">Time to add some silly stuff!</p>
                <button
                  onClick={handleClose}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg font-burbank hover:bg-purple-600 transition-colors"
                >
                  Continue Shopping
                </button>
              </motion.div>
            )}
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          <motion.div
            variants={cartVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-gray-900 shadow-xl z-50 overflow-hidden"
            style={{
              boxShadow: "0 0 50px rgba(139, 92, 246, 0.3)"
            }}
          >
            <div className="p-4 lg:p-6 border-b border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={currentStep === 0 ? handleClose : () => setCurrentStep(prev => prev - 1)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="font-burbank text-xl lg:text-2xl text-white">
                  {currentStep === 0 ? 'Your Cart' : checkoutSteps[currentStep].label}
                </h2>
                <div className="w-6" />
              </div>

              <div className="flex justify-between">
                {checkoutSteps.map((step, index) => (
                  <div 
                    key={step.label}
                    className={`flex flex-col items-center ${index <= currentStep ? 'text-purple-500' : 'text-gray-600'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep ? 'bg-purple-500 bg-opacity-20' : 'bg-gray-800'
                    }`}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs mt-1 hidden sm:block">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[calc(100vh-280px)] overflow-y-auto">
              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>
            </div>

            {items.length > 0 && currentStep === 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 lg:p-6">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-burbank text-xl">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-burbank text-xl py-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};