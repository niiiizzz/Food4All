import React, { useEffect, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Order } from '../types';

// Since we cannot guarantee external CSS loading in some preview environments, 
// we will build a "Simulated" Interactive Map UI that looks like Leaflet but uses standard HTML/CSS.
// This ensures the layout is perfect.

interface LiveMapProps {
  orders?: Order[];
  role: string;
}

const LiveMap: React.FC<LiveMapProps> = ({ orders = [], role }) => {
  const [userLocation, setUserLocation] = useState({ x: 50, y: 50 });

  // Simulate movement
  useEffect(() => {
    const interval = setInterval(() => {
      setUserLocation(prev => ({
        x: Math.min(90, Math.max(10, prev.x + (Math.random() - 0.5) * 2)),
        y: Math.min(90, Math.max(10, prev.y + (Math.random() - 0.5) * 2)),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-64 md:h-96 bg-slate-900 rounded-xl overflow-hidden relative border border-gray-800 shadow-2xl group">
      {/* Mock Map Tiles */}
      <div className="absolute inset-0 opacity-30 grayscale" 
           style={{ 
             backgroundImage: 'url(https://picsum.photos/1000/800?grayscale)', 
             backgroundSize: 'cover',
             backgroundPosition: 'center'
           }}>
      </div>
      
      {/* Grid Overlay for Tech feel */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(195,168,249,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(195,168,249,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* User Marker */}
      <div 
        className="absolute transition-all duration-[2000ms] ease-in-out z-20 flex flex-col items-center"
        style={{ top: `${userLocation.y}%`, left: `${userLocation.x}%` }}
      >
        <div className="w-4 h-4 bg-lavandier rounded-full animate-ping absolute"></div>
        <div className="w-4 h-4 bg-lavandier rounded-full border-2 border-white shadow-lg"></div>
        <div className="bg-black/80 text-xs text-white px-2 py-1 rounded mt-1 backdrop-blur-sm">
          You
        </div>
      </div>

      {/* Order Markers (Simulated positions based on hash) */}
      {orders.map((order, idx) => {
        const mockX = (order.id.charCodeAt(0) * 7 + idx * 20) % 80 + 10;
        const mockY = (order.id.charCodeAt(1) * 5 + idx * 15) % 80 + 10;
        
        return (
          <div 
            key={order.id}
            className="absolute z-10 flex flex-col items-center hover:scale-110 transition-transform cursor-pointer"
            style={{ top: `${mockY}%`, left: `${mockX}%` }}
          >
            <MapPin className="w-6 h-6 text-accent drop-shadow-md" fill="currentColor" />
            <div className="bg-black/80 text-[10px] text-white px-1 rounded mt-0.5 hidden group-hover:block">
              {order.restaurantId === '2' ? 'Tasty Bites' : 'Pickup'}
            </div>
          </div>
        );
      })}

      {/* UI Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="p-2 bg-white/10 backdrop-blur rounded-lg hover:bg-white/20 text-white">
          <Navigation size={18} />
        </button>
      </div>

      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs border border-white/10 text-lavandier font-mono">
        LIVE TRACKING: ACTIVE
      </div>
    </div>
  );
};

export default LiveMap;