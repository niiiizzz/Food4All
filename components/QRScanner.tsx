
import React, { useState } from 'react';
import { X, Camera, CheckCircle, AlertTriangle } from 'lucide-react';

interface Props {
  expectedValue: string;
  onClose: () => void;
  onScan: () => void;
}

const QRScanner: React.FC<Props> = ({ expectedValue, onClose, onScan }) => {
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<'success' | 'error' | null>(null);

  // Simulate scan action
  const handleSimulateScan = () => {
    // In a real app, we would interpret the camera feed.
    // Here we simulate a successful match.
    setScanning(false);
    setResult('success');
    setTimeout(() => {
        onScan();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-black border border-gray-800 rounded-3xl overflow-hidden relative shadow-2xl">
         {/* Scanner Overlay */}
         <div className="absolute inset-0 z-10 pointer-events-none">
             <div className="w-full h-full border-[40px] border-black/50 relative">
                <div className="w-full h-1 bg-red-500/80 absolute top-1/2 animate-pulse shadow-[0_0_10px_red]"></div>
             </div>
         </div>

         <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full text-white">
           <X size={20} />
         </button>

         {/* Fake Camera Feed */}
         <div className="h-96 bg-gray-800 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url(https://picsum.photos/800/800?grayscale)' }}></div>
            
            {result === 'success' && (
                <div className="absolute inset-0 bg-green-500/80 flex flex-col items-center justify-center z-30 animate-fadeIn">
                    <CheckCircle size={64} className="text-white mb-2" />
                    <p className="text-white font-bold text-xl">Verified!</p>
                </div>
            )}
         </div>

         <div className="p-6 bg-gray-900 text-center relative z-20">
            <p className="text-gray-400 text-sm mb-4">Point camera at the receiver's QR Code</p>
            <button 
              onClick={handleSimulateScan}
              disabled={result === 'success'}
              className="w-full bg-lavandier text-black font-bold py-3 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              <Camera size={20} /> {result === 'success' ? 'Processing...' : 'Simulate Scan'}
            </button>
            <p className="text-[10px] text-gray-600 mt-2 font-mono">DEBUG: Expected {expectedValue.substring(0, 8)}...</p>
         </div>
      </div>
    </div>
  );
};

export default QRScanner;
