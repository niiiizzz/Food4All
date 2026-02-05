
import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-50 bg-[#050505]">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1025] via-[#050505] to-[#000000]"></div>
      
      {/* Subtle accent blob */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-lavandier/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default Background;
