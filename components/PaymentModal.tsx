
import React, { useState, useEffect } from 'react';
import { X, CreditCard, CheckCircle, Minus, Plus } from 'lucide-react';

interface Props {
  unitPrice: number;
  maxStock: number;
  onClose: () => void;
  onSuccess: (quantity: number) => void;
}

const PaymentModal: React.FC<Props> = ({ unitPrice, maxStock, onClose, onSuccess }) => {
  const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');
  const [quantity, setQuantity] = useState(1);

  const totalAmount = unitPrice * quantity;

  const handlePayment = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess(quantity);
      }, 1500);
    }, 2000);
  };

  const adjustQuantity = (delta: number) => {
    setQuantity(prev => {
        const newValue = prev + delta;
        if (newValue < 1) return 1;
        if (newValue > maxStock) return maxStock;
        return newValue;
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-white">Secure Checkout</h2>
        <p className="text-gray-400 mb-6">Complete your order for Food4All</p>

        {step === 'method' && (
          <>
            <div className="bg-white/5 p-4 rounded-xl mb-6">
                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-4">
                    <span className="text-gray-300">Price per item</span>
                    <span className="font-mono text-lavandier">${unitPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-300">Quantity</span>
                    <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-gray-700">
                        <button 
                            onClick={() => adjustQuantity(-1)}
                            disabled={quantity <= 1}
                            className="p-1 hover:text-lavandier disabled:opacity-30 transition-colors"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="font-bold w-8 text-center">{quantity}</span>
                        <button 
                            onClick={() => adjustQuantity(1)}
                            disabled={quantity >= maxStock}
                            className="p-1 hover:text-lavandier disabled:opacity-30 transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-300 font-bold">Total Amount</span>
                    <span className="text-2xl font-bold text-white">${totalAmount.toFixed(2)}</span>
                </div>
            </div>

            <div className="space-y-3">
                <button 
                onClick={handlePayment}
                className="w-full bg-[#0070ba] text-white font-bold py-3 rounded-xl hover:bg-[#005ea6] transition-colors flex items-center justify-center gap-2"
                >
                <span className="font-serif italic font-bold text-xl">PayPal</span>
                </button>
                <button 
                onClick={handlePayment}
                className="w-full bg-gray-800 text-white border border-gray-700 font-bold py-3 rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                <CreditCard size={20} /> Credit / Debit Card
                </button>
            </div>
          </>
        )}

        {step === 'processing' && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-lavandier border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">Processing payment of ${totalAmount.toFixed(2)}...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8 animate-fadeIn">
            <CheckCircle size={50} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
            <p className="text-gray-400 mt-2">Your order for {quantity} item{quantity > 1 ? 's' : ''} has been placed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
