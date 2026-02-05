
import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { UserRole } from './types';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Background from './components/Background';

// Import Dashboard fragments
import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import RestaurantDashboard from './pages/dashboards/RestaurantDashboard';
import NGODashboard from './pages/dashboards/NGODashboard';
import DeliveryDashboard from './pages/dashboards/DeliveryDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import { Truck } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('home');

  // Default tabs mapping per role for initial load
  React.useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role === UserRole.RESTAURANT) setActiveTab('menu');
    if (currentUser.role === UserRole.NGO) setActiveTab('claim');
    if (currentUser.role === UserRole.DELIVERY) setActiveTab('jobs');
    if (currentUser.role === UserRole.ADMIN) setActiveTab('overview');
  }, [currentUser]);

  if (!currentUser) {
    return <Login />;
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case UserRole.CUSTOMER:
        return <CustomerDashboard activeTab={activeTab} />;
      case UserRole.RESTAURANT:
        return <RestaurantDashboard activeTab={activeTab} />;
      case UserRole.NGO:
        return <NGODashboard activeTab={activeTab} />;
      case UserRole.DELIVERY:
        return <DeliveryDashboard activeTab={activeTab} />;
      case UserRole.ADMIN:
        return <AdminDashboard activeTab={activeTab} />;
      default:
        return <div className="p-10 text-center">Role Dashboard Coming Soon</div>;
    }
  };

  return (
    <div className="flex min-h-screen text-white relative">
       <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
       <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 transition-all duration-300 z-10">
          <header className="flex justify-between items-center mb-8">
             <div>
               <h1 className="text-2xl font-bold">Welcome, {currentUser.name}</h1>
               <p className="text-gray-400 text-sm">{currentUser.role.replace('_', ' ')} Account</p>
             </div>
             <div className="hidden md:block text-right">
               <p className="text-xs text-gray-500">CURRENT LOCATION</p>
               <p className="font-mono text-lavandier">London, UK</p>
             </div>
          </header>
          {renderDashboard()}
       </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Background />
      <MainLayout />
    </AppProvider>
  );
};

export default App;
