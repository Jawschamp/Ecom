import React from 'react';
import { Package, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const orders = [
  {
    id: 'ORD123456',
    date: 'March 1, 2025',
    status: 'Delivered',
    total: 149.97,
    items: [
      {
        name: 'Magic Rainbow Socks',
        quantity: 2,
        price: 19.99
      },
      {
        name: 'Anti-Gravity Coffee Mug',
        quantity: 1,
        price: 24.99
      }
    ]
  },
  {
    id: 'ORD123457',
    date: 'February 28, 2025',
    status: 'In Transit',
    total: 84.99,
    items: [
      {
        name: 'Invisible Pen',
        quantity: 1,
        price: 9.99
      },
      {
        name: 'RGB Gaming Gloves',
        quantity: 1,
        price: 39.99
      }
    ]
  }
];

export const OrdersPage = () => {
  return (
    <div className="min-h-screen bg-[#1a1c20] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-burbank text-4xl mb-8">My Orders</h1>
        
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Package className="w-6 h-6 text-purple-500" />
                    <div>
                      <h3 className="font-burbank text-xl">Order #{order.id}</h3>
                      <p className="text-gray-400">{order.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Order Total</div>
                      <div className="font-burbank text-xl">${order.total.toFixed(2)}</div>
                    </div>
                    <Link
                      to={`/tracking/${order.id}`}
                      className="bg-gray-700 hover:bg-gray-600 transition-colors px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <span>Track Order</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'Delivered' 
                      ? 'bg-green-500 bg-opacity-20 text-green-400'
                      : 'bg-purple-500 bg-opacity-20 text-purple-400'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="font-medium text-gray-400 mb-4">Order Items</h4>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">{item.name}</h5>
                        <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-burbank">${item.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-400">
                          Subtotal: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};