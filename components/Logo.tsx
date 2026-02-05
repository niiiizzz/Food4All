
import React from 'react';
import { Utensils } from 'lucide-react';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
}

const Logo: React.FC<Props> = ({ className = '', size = 'md', variant = 'full' }) => {
  // Scale factors
  const scales = {
    sm: 0.75,
    md: 1,
    lg: 1.5,
    xl: 2
  };
  
  const s = scales[size];

  if (variant === 'icon') {
    return (
      <div className={`bg-gradient-to-br from-lavandier to-accent text-black p-2 rounded-lg inline-flex items-center justify-center ${className}`} style={{ transform: `scale(${s})` }}>
         <Utensils size={24} />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 select-none ${className}`} style={{ transform: `scale(${s})`, transformOrigin: 'left center' }}>
      <div className="bg-gradient-to-br from-lavandier to-accent text-black p-1.5 rounded-lg shadow-lg shadow-purple-900/20">
        <Utensils size={20} strokeWidth={2.5} />
      </div>
      <span className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
        Food<span className="text-lavandier">4</span>All
      </span>
    </div>
  );
};

export default Logo;
