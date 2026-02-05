import React from 'react';
import { QrCode } from 'lucide-react';

interface Props {
  value: string;
  size?: number;
}

const QRCodeDisplay: React.FC<Props> = ({ value, size = 150 }) => {
  // In a real app, use a library like 'qrcode.react'. Here we visually simulate it.
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-inner" style={{ width: size + 32, height: size + 32 }}>
      <div className="relative w-full h-full bg-gray-900 flex items-center justify-center rounded overflow-hidden">
        {/* Abstract visual representation of QR */}
        <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', 
            backgroundSize: '10px 10px' 
        }}></div>
        <QrCode size={size * 0.6} className="text-white relative z-10" />
        <div className="absolute bottom-1 text-[8px] text-gray-400 font-mono">{value}</div>
      </div>
      <p className="text-black text-xs mt-2 font-bold">Scan to Verify</p>
    </div>
  );
};

export default QRCodeDisplay;