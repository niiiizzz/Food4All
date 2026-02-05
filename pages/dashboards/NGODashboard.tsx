
import React from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus, OrderType } from '../../types';
import LiveMap from '../../components/LiveMap';
import QRCodeDisplay from '../../components/QRCodeDisplay';
import ProfileView from '../../components/ProfileView';
import { CheckCircle } from 'lucide-react';

const NGODashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { foodItems, currentUser, placeOrder, orders } = useApp();

  const handleClaim = (item: any) => {
    if (!currentUser) return;
    placeOrder({
        id: Date.now().toString(),
        customerId: currentUser.id,
        restaurantId: item.restaurantId,
        items: [item],
        totalAmount: 0,
        status: OrderStatus.PENDING,
        type: OrderType.DONATION,
        qrCodeValue: `F4A-NGO-CLAIM-${Date.now()}`,
        createdAt: new Date(),
        deliveryAddress: currentUser.location?.address || 'NGO HQ'
    });
    alert('Food claimed! Delivery partner notified.');
  };

  if (activeTab === 'profile' && currentUser) {
      return <ProfileView user={currentUser} />;
  }

  if (activeTab === 'claim') {
    const availableSurplus = foodItems.filter(f => f.isSurplus);
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-4">Available Donations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableSurplus.map(item => (
            <div key={item.id} className="glass-panel rounded-xl overflow-hidden border border-accent/30">
              <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-400 mb-2">From: {item.restaurantName}</p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-accent font-bold text-sm">{item.quantity} units</span>
                    <button 
                        onClick={() => handleClaim(item)}
                        className="bg-accent text-black font-bold px-4 py-2 rounded hover:bg-white transition-colors"
                    >
                        Claim Now
                    </button>
                </div>
              </div>
            </div>
          ))}
          {availableSurplus.length === 0 && (
              <div className="col-span-3 text-center py-20 text-gray-500">
                  No surplus food available nearby right now.
              </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'deliveries') {
      const myClaims = orders.filter(o => o.customerId === currentUser?.id);
      return (
          <div className="space-y-6">
              <h2 className="text-2xl font-bold">Incoming Deliveries</h2>
              <LiveMap orders={myClaims} role="NGO" />
              <div className="space-y-4 mt-6">
                  {myClaims.map(order => (
                      <div key={order.id} className="glass-panel p-4 rounded-xl flex justify-between items-center">
                          <div>
                              <p className="font-bold">Order #{order.id.slice(-4)}</p>
                              <p className="text-sm text-gray-400">Status: {order.status}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            {order.status === OrderStatus.DELIVERED ? (
                                <div className="flex items-center gap-2 text-green-400">
                                    <CheckCircle size={20} /> Received
                                </div>
                            ) : (
                                <div className="scale-75 origin-right">
                                    <QRCodeDisplay value={order.qrCodeValue} size={60} />
                                </div>
                            )}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )
  }

  return <div>Select Tab</div>;
};

export default NGODashboard;
