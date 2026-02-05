
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import LiveMap from '../../components/LiveMap';
import QRScanner from '../../components/QRScanner';
import ProfileView from '../../components/ProfileView';
import { MapPin, Navigation, Box, CheckCircle, ScanLine } from 'lucide-react';

const DeliveryDashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { orders, currentUser, assignDriver, updateOrderStatus } = useApp();
  const [scanOrder, setScanOrder] = useState<string | null>(null);

  const availableJobs = orders.filter(o => o.status === OrderStatus.PENDING);
  const myJobs = orders.filter(o => o.deliveryPartnerId === currentUser?.id && o.status !== OrderStatus.DELIVERED);
  const history = orders.filter(o => o.deliveryPartnerId === currentUser?.id && o.status === OrderStatus.DELIVERED);

  const handleScanSuccess = (orderId: string) => {
      updateOrderStatus(orderId, OrderStatus.DELIVERED);
      setScanOrder(null);
      alert("Delivery Confirmed!");
  };

  if (activeTab === 'profile' && currentUser) {
      return <ProfileView user={currentUser} />;
  }

  if (activeTab === 'jobs') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <h2 className="text-2xl font-bold text-white">Open Jobs</h2>
        <LiveMap orders={availableJobs} role="DELIVERY" />
        <div className="grid grid-cols-1 gap-4 mt-4">
            {availableJobs.map(order => (
                <div key={order.id} className="glass-panel p-6 rounded-xl border-l-4 border-gray-500 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Box className="text-lavandier" size={20} />
                            <span className="font-bold">Order #{order.id.slice(-4)}</span>
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                            <p className="flex items-center gap-2"><MapPin size={14}/> Pickup: {order.restaurantId === '2' ? 'Tasty Bites' : 'Restaurant'}</p>
                            <p className="flex items-center gap-2"><Navigation size={14}/> Drop: {order.deliveryAddress}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => currentUser && assignDriver(order.id, currentUser.id)}
                        className="bg-lavandier text-black font-bold px-6 py-3 rounded-lg hover:bg-white transition-colors"
                    >
                        Accept Job
                    </button>
                </div>
            ))}
            {availableJobs.length === 0 && <div className="text-center py-10 text-gray-500">No open jobs currently available.</div>}
        </div>
      </div>
    );
  }

  if (activeTab === 'history') {
      return (
          <div className="space-y-6">
              <h2 className="text-2xl font-bold">Delivery History</h2>
              <div className="space-y-4">
                  {history.map(order => (
                      <div key={order.id} className="glass-panel p-4 rounded-lg flex justify-between items-center opacity-75">
                          <div>
                              <p className="font-bold">Order #{order.id.slice(-4)}</p>
                              <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-2 text-green-400">
                              <CheckCircle size={16} /> Delivered
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )
  }

  // My Active Jobs (Default or specific tab)
  return (
    <div className="space-y-6">
        {scanOrder && (
            <QRScanner 
                expectedValue={orders.find(o => o.id === scanOrder)?.qrCodeValue || ''} 
                onClose={() => setScanOrder(null)}
                onScan={() => handleScanSuccess(scanOrder)}
            />
        )}

        <h2 className="text-2xl font-bold text-white">My Active Deliveries</h2>
        <LiveMap orders={myJobs} role="DELIVERY" />
        <div className="space-y-4 mt-4">
            {myJobs.map(order => (
                <div key={order.id} className="glass-panel p-6 rounded-xl border-l-4 border-accent">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-lg">Current Task</h3>
                            <p className="text-accent font-mono text-sm">{order.status}</p>
                        </div>
                        <div className="bg-white/10 p-2 rounded text-xs font-mono">
                            ID: {order.id}
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        {order.status === OrderStatus.ACCEPTED && (
                            <button 
                                onClick={() => updateOrderStatus(order.id, OrderStatus.PICKED_UP)}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold transition-colors"
                            >
                                Confirm Pickup
                            </button>
                        )}
                        
                        {order.status === OrderStatus.PICKED_UP && (
                            <button 
                                onClick={() => setScanOrder(order.id)}
                                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                <ScanLine /> Scan to Deliver
                            </button>
                        )}
                        
                        <button className="px-4 py-3 bg-white/10 rounded-lg hover:bg-white/20">
                            <Navigation size={20} />
                        </button>
                    </div>
                </div>
            ))}
            {myJobs.length === 0 && <div className="text-center py-10 text-gray-500">No active deliveries. Go to 'Open Jobs' to find work.</div>}
        </div>
    </div>
  );
};

export default DeliveryDashboard;
