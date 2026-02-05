
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Download, Trash2, Search, Shield, Users, TrendingUp } from 'lucide-react';
import ProfileView from '../../components/ProfileView';

const AdminDashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { currentUser, users, orders, foodItems, deleteUser } = useApp();
  const [filterRole, setFilterRole] = useState<string>('ALL');

  const filteredUsers = users.filter(u => filterRole === 'ALL' || u.role === filterRole);

  const downloadCSV = () => {
      const headers = "ID,Name,Organization,Email,Phone,Address,Role,EcoScore,JoinedAt\n";
      const rows = users.map(u => 
        `${u.id},"${u.name}","${u.organizationName || ''}",${u.email},${u.phoneNumber || ''},"${u.location?.address || ''}",${u.role},${u.ecoScore},${u.joinedAt}`
      ).join("\n");
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'food4all_users_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  if (activeTab === 'profile' && currentUser) {
      return <ProfileView user={currentUser} />;
  }

  if (activeTab === 'overview') {
      const totalFoodSaved = foodItems.filter(f => f.isSurplus).reduce((acc, item) => acc + item.quantity, 0);
      const totalDonations = orders.filter(o => o.type === 'DONATION').length;

      return (
          <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-panel p-6 rounded-xl border-t-4 border-lavandier">
                      <div className="flex items-center gap-4">
                          <div className="p-3 bg-lavandier/20 rounded-lg text-lavandier"><Users size={24}/></div>
                          <div>
                              <p className="text-gray-400 text-sm">Total Users</p>
                              <p className="text-3xl font-bold">{users.length}</p>
                          </div>
                      </div>
                  </div>
                  <div className="glass-panel p-6 rounded-xl border-t-4 border-accent">
                      <div className="flex items-center gap-4">
                          <div className="p-3 bg-accent/20 rounded-lg text-accent"><TrendingUp size={24}/></div>
                          <div>
                              <p className="text-gray-400 text-sm">Food Items Saved</p>
                              <p className="text-3xl font-bold">{totalFoodSaved}</p>
                          </div>
                      </div>
                  </div>
                  <div className="glass-panel p-6 rounded-xl border-t-4 border-green-500">
                      <div className="flex items-center gap-4">
                          <div className="p-3 bg-green-500/20 rounded-lg text-green-500"><Shield size={24}/></div>
                          <div>
                              <p className="text-gray-400 text-sm">Active Donations</p>
                              <p className="text-3xl font-bold">{totalDonations}</p>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="glass-panel p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-4">Platform Health</h3>
                  <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-lavandier to-accent w-3/4 animate-pulse"></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Server Load: Optimal (mock)</p>
              </div>
          </div>
      )
  }

  if (activeTab === 'users') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl font-bold">User Management Database</h2>
            <button onClick={downloadCSV} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Download size={18} /> Export Data (Excel/CSV)
            </button>
        </div>

        <div className="glass-panel p-4 rounded-xl">
            <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
                <span className="text-sm font-bold text-gray-400">Filter:</span>
                {['ALL', ...Object.values(UserRole)].slice(0, 6).map(role => (
                    <button 
                        key={role}
                        onClick={() => setFilterRole(role)}
                        className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                            filterRole === role ? 'bg-lavandier text-black' : 'bg-black/40 text-gray-400'
                        }`}
                    >
                        {role}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-400 border-b border-gray-700 text-sm">
                            <th className="p-3 font-medium">Name / Organization</th>
                            <th className="p-3 font-medium">Contact</th>
                            <th className="p-3 font-medium">Role</th>
                            <th className="p-3 font-medium">Stats</th>
                            <th className="p-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                                <td className="p-3">
                                    <div className="font-bold">{user.name}</div>
                                    {user.organizationName && (
                                        <div className="text-xs text-accent">{user.organizationName}</div>
                                    )}
                                </td>
                                <td className="p-3">
                                    <div className="text-xs text-gray-400">{user.email}</div>
                                    {user.phoneNumber && <div className="text-xs text-gray-400">{user.phoneNumber}</div>}
                                </td>
                                <td className="p-3">
                                    <span className="bg-white/10 px-2 py-1 rounded text-[10px] uppercase tracking-wider">{user.role}</span>
                                </td>
                                <td className="p-3">
                                     <div className="text-xs">Score: {user.ecoScore}</div>
                                     <div className="text-[10px] text-gray-500">Joined: {new Date(user.joinedAt).toLocaleDateString()}</div>
                                </td>
                                <td className="p-3 text-right">
                                    {/* Prevent deletion of Admins for safety in this mock */}
                                    {user.role !== UserRole.ADMIN && (
                                        <button 
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                if(window.confirm('Are you sure you want to remove this user from the database?')) {
                                                    deleteUser(user.id);
                                                }
                                            }}
                                            className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded transition-colors"
                                            title="Remove User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No users found for this filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    );
  }

  return <div className="text-center mt-10 text-gray-500">Government Report Module Placeholder</div>;
};

export default AdminDashboard;
