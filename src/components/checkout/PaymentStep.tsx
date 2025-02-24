import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock } from 'lucide-react';

interface PaymentFormData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface PaymentStepProps {
  onNext: (data: PaymentFormData) => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({ onNext }) => {
  const [formData, setFormData] = React.useState<PaymentFormData>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-purple-500" />
        </div>
        <h2 className="font-burbank text-2xl text-white">Payment Details</h2>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg mb-6 flex items-center gap-2 text-gray-400">
        <Lock className="w-4 h-4" />
        <span className="text-sm">Your payment information is secure and encrypted</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-400 mb-1">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            required
            maxLength={19}
            value={formData.cardNumber}
            onChange={(e) => {
              e.target.value = formatCardNumber(e.target.value);
              handleChange(e);
            }}
            placeholder="1234 5678 9012 3456"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="cardName" className="block text-sm font-medium text-gray-400 mb-1">
            Name on Card
          </label>
          <input
            type="text"
            id="cardName"
            name="cardName"
            required
            value={formData.cardName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-400 mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              required
              maxLength={5}
              value={formData.expiryDate}
              onChange={(e) => {
                e.target.value = formatExpiryDate(e.target.value);
                handleChange(e);
              }}
              placeholder="MM/YY"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-400 mb-1">
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              required
              maxLength={4}
              value={formData.cvv}
              onChange={handleChange}
              placeholder="123"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-burbank text-xl py-4 rounded-lg hover:opacity-90 transition-opacity mt-6"
        >
          Complete Purchase
        </button>
      </form>
    </motion.div>
  );
};