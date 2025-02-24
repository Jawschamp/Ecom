import React from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ConfirmationStepProps {
  orderNumber: string;
  onClose: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ orderNumber, onClose }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-20 h-20 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="w-12 h-12 text-green-500" />
      </motion.div>

      <h2 className="font-burbank text-3xl text-white mb-4">Order Confirmed!</h2>
      <p className="text-gray-400 mb-6">
        Thank you for your purchase. We'll email you the order confirmation and tracking details.
      </p>

      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-6 h-6 text-purple-500" />
          <span className="text-white font-medium">Order #{orderNumber}</span>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Estimated delivery: 3-5 business days
        </p>
        <button
          onClick={() => navigate(`/tracking/${orderNumber}`)}
          className="w-full bg-gray-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
        >
          <Truck className="w-5 h-5" />
          Track Shipment
        </button>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-burbank text-xl py-4 rounded-lg hover:opacity-90 transition-opacity"
      >
        Continue Shopping
      </button>
    </motion.div>
  );
};