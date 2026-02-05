
import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { LayoutDashboard, Utensils, Truck, Heart, LogOut, User, Globe, ClipboardList, History } from 'lucide-react';
import Logo from './Logo';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const { currentUser, logout } = useApp();

  const getMenuItems = () => {
    const common = [{ id: 'profile', label: 'Profile', icon: User }];
    
    switch (currentUser?.role) {
      case UserRole.CUSTOMER:
        return [
          { id: 'home', label: 'Browse Food', icon: Utensils },
          { id: 'orders', label: 'My Orders', icon: Truck },
          { id: 'donate', label: 'Donate/Send', icon: Heart },
          ...common
        ];
      case UserRole.RESTAURANT:
        return [
          { id: 'menu', label: 'Menu Manager', icon: Utensils },
          { id: 'surplus', label: 'Surplus Donations', icon: Heart },
          { id: 'orders', label: 'Incoming Orders', icon: Truck },
          { id: 'analytics', label: 'Analytics', icon: LayoutDashboard },
          ...common
        ];
      case UserRole.NGO:
        return [
          { id: 'claim', label: 'Claim Food', icon: Heart },
          { id: 'deliveries', label: 'Incoming', icon: Truck },
          ...common
        ];
      case UserRole.DELIVERY:
        return [
          { id: 'jobs', label: 'Open Jobs', icon: ClipboardList },
          { id: 'active', label: 'My Deliveries', icon: Truck },
          { id: 'history', label: 'History', icon: History },
          ...common
        ];
      case UserRole.ADMIN:
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'users', label: 'Manage Users', icon: User },
          { id: 'reports', label: 'Govt Reports', icon: Globe },
          ...common
        ];
      default:
        return common;
    }
  };

  return (
    <div className="h-screen w-20 md:w-64 glass-panel border-r border-white/10 flex flex-col justify-between fixed left-0 top-0 z-50 transition-all duration-300">
      <div>
        <div className="p-4 md:p-6 flex items-center justify-center md:justify-start gap-3 overflow-hidden">
          <Logo size="sm" variant="icon" />
          <span className="hidden md:block text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lavandier to-white whitespace-nowrap">
            Food4All
          </span>
        </div>

        <nav className="mt-8 px-2 space-y-2">
          {getMenuItems().map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-lavandier text-black font-semibold shadow-lg shadow-purple-900/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="hidden md:block">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <div className="hidden md:block mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-gray-400">EcoScore</p>
          <p className="text-lg font-bold text-accent">{currentUser?.ecoScore} pts</p>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={20} />
          <span className="hidden md:block">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
