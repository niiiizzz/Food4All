
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodItem, OrderType, OrderStatus } from '../../types';
import LiveMap from '../../components/LiveMap';
import PaymentModal from '../../components/PaymentModal';
import QRCodeDisplay from '../../components/QRCodeDisplay';
import ProfileView from '../../components/ProfileView';
import { ShoppingBag, Heart, Star, Gift } from 'lucide-react';

const CustomerDashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { foodItems, placeOrder, currentUser, orders } = useApp();
  const [paymentItem, setPaymentItem] = useState<FoodItem | null>(null);
  const [currentOrderType, setCurrentOrderType] = useState<OrderType>(OrderType.REGULAR);

  const calculateUnitPrice = (item: FoodItem, type: OrderType) => {
    if (type === OrderType.REGULAR) return item.price;
    // For donations, apply the discount if it exists
    const discount = item.discount || 0;
    return item.price * (1 - discount / 100);
  };

  const handleOrderClick = (item: FoodItem, type: OrderType) => {
    if (!currentUser) return;
    setCurrentOrderType(type);
    setPaymentItem(item);
  };

  const confirmOrder = (quantity: number) => {
    if (!currentUser || !paymentItem) return;
    
    const unitPrice = calculateUnitPrice(paymentItem, currentOrderType);
    const finalAmount = unitPrice * quantity;

    // Create a copy of the item with the specific ordered quantity
    const orderedItem = { ...paymentItem, quantity: quantity };

    placeOrder({
      id: Date.now().toString(),
      customerId: currentUser.id,
      restaurantId: paymentItem.restaurantId,
      items: [orderedItem],
      totalAmount: finalAmount,
      status: OrderStatus.PENDING,
      type: currentOrderType,
      qrCodeValue: `F4A-${Date.now()}`,
      createdAt: new Date(),
      deliveryAddress: currentUser.location?.address || 'My Current Location'
    });
    setPaymentItem(null);
    
    const message = currentOrderType === OrderType.DONATION 
        ? `Donation Successful! You paid $${finalAmount.toFixed(2)} and earned points.` 
        : 'Order Placed Successfully!';
    // Alert is optional now since modal shows success, but good for backup feedback
    // alert(message); 
  };

  if (activeTab === 'profile' && currentUser) {
      return <ProfileView user={currentUser} />;
  }

  if (activeTab === 'home') {
    return (
      <div className="space-y-6 animate-fadeIn relative">
        {paymentItem && (
            <PaymentModal 
                unitPrice={calculateUnitPrice(paymentItem, currentOrderType)}
                maxStock={paymentItem.quantity}
                onClose={() => setPaymentItem(null)} 
                onSuccess={(qty) => confirmOrder(qty)} 
            />
        )}

        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-white">Nearby Food</h2>
            <p className="text-gray-400">Order fresh or donate to others</p>
          </div>
          <div className="flex gap-4">
             <div className="hidden md:flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/30 text-yellow-500">
                 <Star size={16} fill="currentColor" />
                 <span className="font-bold">{currentUser?.ecoScore} Points</span>
             </div>
             <div className="bg-lavandier/20 text-lavandier px-4 py-2 rounded-full text-sm border border-lavandier/30">
               Location: {currentUser?.location?.address || 'London, UK'}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodItems.filter(f => !f.isSurplus && f.quantity > 0).map((item) => {
            const donationPrice = calculateUnitPrice(item, OrderType.DONATION);
            return (
              <div key={item.id} className="glass-panel rounded-xl overflow-hidden group hover:border-lavandier/50 transition-all">
                <div className="h-40 bg-gray-800 relative overflow-hidden">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                    {item.restaurantName}
                  </div>
                  {item.discount && item.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold shadow-md">
                          Donate & Save {item.discount}%
                      </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white">{item.name}</h3>
                    <span className="font-mono text-accent text-lg">${item.price}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                  <div className="text-xs text-gray-500 mb-4">
                    Available: <span className="text-white font-bold">{item.quantity}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleOrderClick(item, OrderType.REGULAR)}
                      className="bg-white text-black py-2 rounded-lg font-bold hover:bg-gray-200 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={16} /> Order
                    </button>
                    <button 
                      onClick={() => handleOrderClick(item, OrderType.DONATION)}
                      className="bg-lavandier/20 text-lavandier border border-lavandier/30 py-2 rounded-lg font-bold hover:bg-lavandier/30 flex items-center justify-center gap-2 text-sm"
                    >
                      <Heart size={16} /> Donate {item.discount && item.discount > 0 ? `($${donationPrice.toFixed(2)})` : ''}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {foodItems.filter(f => !f.isSurplus && f.quantity > 0).length === 0 && (
             <div className="col-span-3 text-center py-10 text-gray-500">
                 No food items currently available.
             </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'orders') {
    const myOrders = orders.filter(o => o.customerId === currentUser?.id);
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Order Tracking</h2>
        <LiveMap orders={myOrders} role="CUSTOMER" />
        <div className="space-y-4">
          {myOrders.map(order => (
            <div key={order.id} className="glass-panel p-4 rounded-xl flex flex-col md:flex-row justify-between items-center border-l-4 border-lavandier gap-4">
              <div className="flex-1">
                <div className="flex justify-between">
                    <p className="font-bold text-white text-lg">{order.items[0].name} <span className="text-sm text-gray-400">x{order.items[0].quantity}</span></p>
                    <p className="text-accent font-mono">${order.totalAmount.toFixed(2)}</p>
                </div>
                <p className="text-sm text-gray-400">{order.restaurantId === '2' ? 'Tasty Bites' : 'Restaurant'}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === OrderStatus.DELIVERED ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                        {order.status}
                    </span>
                    {order.type === OrderType.DONATION && (
                        <span className="bg-pink-500/20 text-pink-400 px-2 py-1 rounded-full text-xs border border-pink-500/30 flex items-center gap-1">
                            <Heart size={10} /> Donation
                        </span>
                    )}
                </div>
              </div>
              
              {/* Show QR Code for delivery verification */}
              {order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED && (
                  <div className="bg-white p-2 rounded-lg">
                      <QRCodeDisplay value={order.qrCodeValue} size={80} />
                  </div>
              )}
              
              <div className="text-right text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
          {myOrders.length === 0 && (
            <div className="text-center py-10 text-gray-500">No active orders. Go grab some food!</div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'donate') {
      return (
          <div className="text-center py-20 glass-panel rounded-xl">
              <Gift size={64} className="mx-auto text-lavandier mb-6" />
              <h2 className="text-3xl font-bold mb-4">Donate & Earn Badges</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                  Select "Donate" on any food item to purchase it for a local shelter. 
                  You earn 50 EcoPoints for every donation!
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                {currentUser?.badges.map(badge => (
                    <div key={badge} className="bg-gradient-to-r from-accent to-orange-500 text-black font-bold px-4 py-2 rounded-full flex items-center gap-2">
                        <Star size={14} fill="black" /> {badge}
                    </div>
                ))}
              </div>
          </div>
      )
  }

  return <div className="text-center text-gray-500 mt-20">Select a tab</div>;
};

export default CustomerDashboard;
