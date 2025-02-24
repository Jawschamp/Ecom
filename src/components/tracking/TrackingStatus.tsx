import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, MapPin, Clock } from 'lucide-react';
import { ProgressBar } from '../ProgressBar';

interface TrackingStatusProps {
  orderNumber: string;
  estimatedDelivery: string;
  currentStatus: string;
  orderDate: string;
  shippingMethod: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export const TrackingStatus: React.FC<TrackingStatusProps> = ({
  orderNumber,
  estimatedDelivery,
  currentStatus,
  orderDate,
  shippingMethod,
  items
}) => {
  const stages = [
    { icon: Package, label: 'Order Placed', completed: true },
    { icon: Truck, label: 'In Transit', completed: true },
    { icon: MapPin, label: 'Out for Delivery', completed: false },
    { icon: Clock, label: 'Delivered', completed: false }
  ];

  const currentStage = 2; // This would be dynamic based on the actual status
  const progress = (currentStage / (stages.length - 1)) * 100;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
          <Package className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <h2 className="font-burbank text-2xl text-white">Package Status</h2>
          <p className="text-gray-400">We'll keep you updated on your delivery</p>
        </div>
      </div>

      <div className="bg-purple-500 bg-opacity-20 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-burbank text-white mb-2">Your package is on its way!</h3>
        <p className="text-gray-400 mb-4">Estimated delivery: {estimatedDelivery}</p>
        <ProgressBar 
          value={progress}
          label="Delivery Progress"
          variant="default"
          className="w-full"
          ariaLabel="Package delivery progress"
        />
      </div>

      {/* Progress Timeline */}
      <div className="relative mb-8">
        <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-700" />
        {stages.map((stage, index) => (
          <div key={index} className="relative flex items-start mb-6 last:mb-0">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
              index <= currentStage ? 'bg-purple-500' : 'bg-gray-700'
            }`}>
              <stage.icon className={`w-6 h-6 ${
                index <= currentStage ? 'text-white' : 'text-gray-400'
              }`} />
            </div>
            <div className="ml-4 flex-1">
              <h4 className={`font-medium ${
                index <= currentStage ? 'text-white' : 'text-gray-400'
              }`}>
                {stage.label}
              </h4>
              {index === currentStage && (
                <p className="text-purple-400 text-sm mt-1">{currentStatus}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order Details */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="font-burbank text-xl text-white mb-4">Order Details</h3>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-400">Order Number</span>
            <span className="text-white font-medium">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Order Date</span>
            <span className="text-white">{orderDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Shipping Method</span>
            <span className="text-white">{shippingMethod}</span>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-4">
          <h4 className="font-medium text-white mb-4">Items in this order</h4>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="text-white">{item.name}</p>
                  <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                </div>
                <p className="text-white">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};