
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { ROLE_LABELS } from '../constants';
import { ArrowRight, User, MapPin, Phone as PhoneIcon, Building2 } from 'lucide-react';
import Logo from '../components/Logo';

const Login: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [isSignup, setIsSignup] = useState(false);

  // Signup Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [orgName, setOrgName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login({
        email,
        password,
        role,
        name,
        phone,
        address,
        orgName: role !== UserRole.CUSTOMER ? orgName : undefined,
        isSignup
    });

    if (success) {
        // Reset form handled by unmount, but just in case
    }
  };

  const isOrgRole = role !== UserRole.CUSTOMER && role !== UserRole.DELIVERY && role !== UserRole.ADMIN;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 z-10 relative py-10">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Decorative header */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-lavandier to-accent"></div>
        
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-2">
             <Logo size="sm" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Food4All</h1>
          <p className="text-gray-400 text-sm">Zero Hunger. Smart Delivery.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select User Role</label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
              {Object.values(UserRole).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`text-[10px] p-2 rounded border transition-all truncate ${
                    role === r 
                    ? 'bg-lavandier border-lavandier text-black font-bold' 
                    : 'border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

          {isSignup && (
              <>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Full Name</label>
                        <div className="relative">
                            <User size={14} className="absolute top-3 left-3 text-gray-500" />
                            <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/30 border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:border-lavandier focus:outline-none"
                            placeholder="John Doe"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Phone</label>
                        <div className="relative">
                            <PhoneIcon size={14} className="absolute top-3 left-3 text-gray-500" />
                            <input
                            type="text"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-black/30 border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:border-lavandier focus:outline-none"
                            placeholder="+1 234..."
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Address</label>
                    <div className="relative">
                        <MapPin size={14} className="absolute top-3 left-3 text-gray-500" />
                        <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-black/30 border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:border-lavandier focus:outline-none"
                        placeholder="123 Street Name, City"
                        />
                    </div>
                </div>
                {isOrgRole && (
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Organization Name</label>
                        <div className="relative">
                            <Building2 size={14} className="absolute top-3 left-3 text-gray-500" />
                            <input
                            type="text"
                            required
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            className="w-full bg-black/30 border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:border-lavandier focus:outline-none"
                            placeholder="Restaurant / NGO Name"
                            />
                        </div>
                    </div>
                )}
              </>
          )}

          <div>
            <label className="block text-xs text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-lavandier focus:outline-none"
              placeholder={role === UserRole.ADMIN ? "govt@admin.in" : "name@example.com"}
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-lavandier focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-lavandier text-black font-bold py-3 rounded-xl hover:bg-white transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 mt-2"
          >
            {isSignup ? 'Register & Login' : 'Sign In'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            onClick={() => setIsSignup(!isSignup)}
            className="text-xs text-gray-400 hover:text-lavandier transition-colors"
          >
            {isSignup ? 'Already have an account? Sign In' : 'New here? Create Account'}
          </button>
        </div>
        
        {role === UserRole.ADMIN && !isSignup && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-[10px] text-red-300 text-center">
                Authorized Government Personnel Only
            </div>
        )}
      </div>
    </div>
  );
};

export default Login;
