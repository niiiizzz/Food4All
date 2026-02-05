
import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodItem } from '../../types';
import { Plus, Leaf, Trash2, Image as ImageIcon, Upload, X, Percent } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ProfileView from '../../components/ProfileView';

const RestaurantDashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { currentUser, addFoodItem, deleteFoodItem, foodItems, donateFood } = useApp();
  const [newItem, setNewItem] = useState<Partial<FoodItem>>({ name: '', price: 0, quantity: 1, imageUrl: '', discount: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle mocked file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a fake URL for the uploaded file (in a real app, upload to S3)
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string, itemName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to remove "${itemName}" from your menu? This cannot be undone.`)) {
      deleteFoodItem(id);
    }
  };

  if (activeTab === 'profile' && currentUser) {
      return <ProfileView user={currentUser} />;
  }

  if (activeTab === 'menu') {
    const restaurantItems = foodItems.filter(f => f.restaurantId === currentUser?.id && !f.isSurplus);

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="glass-panel p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
            <Plus className="text-lavandier" /> Add Menu Item
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Item Name</label>
                    <input 
                        placeholder="e.g., Grilled Salmon" 
                        className="w-full bg-black/30 p-3 rounded-lg border border-gray-700 text-white focus:border-lavandier focus:outline-none"
                        value={newItem.name}
                        onChange={e => setNewItem({...newItem, name: e.target.value})}
                    />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Price ($)</label>
                        <input 
                            placeholder="0.00" 
                            type="number"
                            min="0"
                            className="w-full bg-black/30 p-3 rounded-lg border border-gray-700 text-white focus:border-lavandier focus:outline-none"
                            value={newItem.price}
                            onChange={e => setNewItem({...newItem, price: Number(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Quantity</label>
                        <input 
                            placeholder="Qty" 
                            type="number"
                            min="1"
                            className="w-full bg-black/30 p-3 rounded-lg border border-gray-700 text-white focus:border-lavandier focus:outline-none"
                            value={newItem.quantity}
                            onChange={e => setNewItem({...newItem, quantity: Number(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Discount (%)</label>
                        <div className="relative">
                            <input 
                                placeholder="0" 
                                type="number"
                                min="0"
                                max="100"
                                className="w-full bg-black/30 p-3 rounded-lg border border-gray-700 text-white focus:border-lavandier focus:outline-none"
                                value={newItem.discount || ''}
                                onChange={e => setNewItem({...newItem, discount: Number(e.target.value)})}
                            />
                            <Percent size={12} className="absolute top-4 right-3 text-gray-500" />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Food Image</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <ImageIcon size={16} className="absolute top-3 left-3 text-gray-500" />
                            <input 
                                placeholder="Enter Image URL" 
                                className="w-full bg-black/30 p-3 pl-10 rounded-lg border border-gray-700 text-white focus:border-lavandier focus:outline-none"
                                value={newItem.imageUrl}
                                onChange={e => setNewItem({...newItem, imageUrl: e.target.value})}
                            />
                        </div>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white/10 hover:bg-white/20 p-3 rounded-lg text-white flex items-center justify-center transition-colors"
                            title="Upload Image"
                        >
                            <Upload size={20} />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileUpload}
                        />
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col justify-between">
                 <div className="flex-1 bg-black/20 rounded-lg border border-gray-800 flex items-center justify-center overflow-hidden relative min-h-[150px]">
                    {newItem.imageUrl ? (
                        <>
                            <img src={newItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                                onClick={() => setNewItem({...newItem, imageUrl: ''})}
                                className="absolute top-2 right-2 bg-red-500/80 p-1.5 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg z-10"
                                title="Remove Image"
                            >
                                <X size={14} />
                            </button>
                        </>
                    ) : (
                        <div className="text-center text-gray-600">
                            <ImageIcon size={40} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Image Preview</p>
                        </div>
                    )}
                 </div>
                 <button 
                    type="button"
                    onClick={() => {
                        if (currentUser && newItem.name) {
                        addFoodItem({
                            id: Date.now().toString(),
                            restaurantId: currentUser.id,
                            restaurantName: currentUser.organizationName || currentUser.name,
                            name: newItem.name,
                            description: 'Freshly added to menu',
                            price: newItem.price || 0,
                            isSurplus: false,
                            quantity: newItem.quantity || 1,
                            imageUrl: newItem.imageUrl || 'https://picsum.photos/200/200?random=' + Math.random(),
                            discount: newItem.discount || 0
                        });
                        setNewItem({ name: '', price: 0, quantity: 1, imageUrl: '', discount: 0 });
                        alert("Menu item added successfully!");
                        } else {
                            alert("Please enter at least a name.");
                        }
                    }}
                    className="w-full mt-4 bg-lavandier text-black font-bold py-3 rounded-lg hover:bg-white transition-all transform active:scale-95"
                    >
                    Add to Menu
                </button>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold mt-8 text-white">Current Menu Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurantItems.map(item => (
                <div key={item.id} className="glass-panel p-4 rounded-xl flex justify-between items-center border border-gray-800 hover:border-lavandier/30 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden relative bg-gray-800">
                            <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
                        </div>
                        <div>
                            <p className="font-bold text-white text-lg">{item.name}</p>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <span className="text-accent font-mono">${item.price}</span>
                                <span>•</span>
                                <span>Qty: {item.quantity}</span>
                                {item.discount && item.discount > 0 ? (
                                    <>
                                        <span>•</span>
                                        <span className="text-green-400 font-bold">{item.discount}% Off (Donation)</span>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <button 
                            type="button"
                            onClick={() => donateFood(item, 5)}
                            className="text-xs bg-accentTeal/10 text-accentTeal px-3 py-1.5 rounded border border-accentTeal/30 hover:bg-accentTeal hover:text-black transition-colors font-semibold"
                        >
                        Mark Surplus
                        </button>
                        <button 
                            type="button"
                            onClick={(e) => handleDelete(e, item.id, item.name)}
                            className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer border border-transparent hover:border-red-500/20"
                        >
                           <Trash2 size={14} /> Remove
                        </button>
                    </div>
                </div>
            ))}
             {restaurantItems.length === 0 && (
                 <div className="col-span-2 text-center py-10 text-gray-500 bg-white/5 rounded-xl border border-dashed border-gray-700">
                     No items in menu. Add some above!
                 </div>
             )}
        </div>
      </div>
    );
  }

  if (activeTab === 'surplus') {
     const surplusItems = foodItems.filter(f => f.restaurantId === currentUser?.id && f.isSurplus);
     return (
         <div className="space-y-6 animate-fadeIn">
             <div className="bg-gradient-to-r from-green-900/40 to-transparent p-6 rounded-xl border border-green-500/20">
                 <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
                     <Leaf /> Impact Tracker
                 </h2>
                 <p className="text-gray-300 mt-2">You have saved <span className="text-white font-bold">{surplusItems.reduce((acc, i) => acc + i.quantity, 0)}</span> items from waste today.</p>
             </div>

             <h3 className="text-xl font-bold text-white">Active Surplus Listings (Visible to NGOs)</h3>
             <div className="grid grid-cols-1 gap-4">
                 {surplusItems.map(item => (
                     <div key={item.id} className="glass-panel p-4 rounded-lg border-l-4 border-accent flex justify-between items-center">
                         <div className="flex items-center gap-4">
                             <img src={item.imageUrl} className="w-12 h-12 rounded object-cover opacity-80" alt=""/>
                             <div>
                                <p className="font-bold text-lg text-white">{item.name}</p>
                                <p className="text-sm text-gray-400">Qty: {item.quantity} | Free for NGOs</p>
                             </div>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                             <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">Pending Pickup</span>
                             <button 
                                type="button"
                                onClick={(e) => handleDelete(e, item.id, item.name)}
                                className="text-xs text-red-400 hover:underline flex items-center gap-1"
                             >
                                 <X size={12} /> Cancel Listing
                             </button>
                         </div>
                     </div>
                 ))}
                 {surplusItems.length === 0 && <p className="text-gray-500">No surplus items listed.</p>}
             </div>
         </div>
     )
  }

  if (activeTab === 'analytics') {
    const data = [
        { name: 'Mon', saved: 4, sales: 24 },
        { name: 'Tue', saved: 3, sales: 13 },
        { name: 'Wed', saved: 10, sales: 38 },
        { name: 'Thu', saved: 2, sales: 20 },
        { name: 'Fri', saved: 8, sales: 45 },
    ];
      return (
          <div className="h-96 glass-panel p-6 rounded-xl animate-fadeIn">
              <h3 className="text-xl font-bold mb-6 text-white">Weekly Performance</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="name" stroke="#888888" tick={{fill: '#888'}} />
                    <YAxis stroke="#888888" tick={{fill: '#888'}} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Bar dataKey="saved" fill="#00c4b3" name="Food Saved" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sales" fill="#c3a8f9" name="Sales" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
          </div>
      )
  }

  return <div className="text-center mt-10 text-gray-500">Select an option from sidebar</div>;
};

export default RestaurantDashboard;
