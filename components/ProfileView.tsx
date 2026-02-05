
import React from 'react';
import { User } from '../types';
import { User as UserIcon, Mail, Phone, MapPin, Award, Briefcase } from 'lucide-react';

interface Props {
  user: User;
}

const ProfileView: React.FC<Props> = ({ user }) => {
  return (
    <div className="glass-panel p-8 rounded-2xl max-w-4xl mx-auto animate-fadeIn">
      <div className="flex flex-col md:flex-row items-start gap-8">
        
        <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gradient-to-br from-lavandier to-accent rounded-full p-1">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                    <UserIcon size={64} className="text-white" />
                </div>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white text-center">{user.name}</h2>
            <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-mono mt-2">{user.role.replace('_', ' ')}</div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-1">
                    <Mail className="text-gray-400" size={18} />
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Email</span>
                </div>
                <p className="text-white font-medium truncate">{user.email}</p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-1">
                    <Phone className="text-gray-400" size={18} />
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Phone</span>
                </div>
                <p className="text-white font-medium">{user.phoneNumber || 'N/A'}</p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-1">
                    <MapPin className="text-gray-400" size={18} />
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Address</span>
                </div>
                <p className="text-white font-medium">{user.location?.address || 'N/A'}</p>
            </div>

            {user.organizationName && (
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 mb-1">
                        <Briefcase className="text-gray-400" size={18} />
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Organization</span>
                    </div>
                    <p className="text-white font-medium">{user.organizationName}</p>
                </div>
            )}

            <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-lavandier/10 to-transparent p-4 rounded-xl border border-lavandier/20">
                 <div className="flex items-center gap-3 mb-3">
                    <Award className="text-accent" size={24} />
                    <span className="text-sm text-gray-300 uppercase tracking-wider font-bold">Achievements</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <div className="bg-accent/20 text-accent border border-accent/30 px-3 py-1 rounded-lg font-bold flex items-center gap-2">
                        EcoScore: {user.ecoScore}
                    </div>
                    {user.badges.map(badge => (
                        <div key={badge} className="bg-white/10 text-white border border-white/20 px-3 py-1 rounded-lg text-sm">
                            {badge}
                        </div>
                    ))}
                    {user.badges.length === 0 && <span className="text-gray-500 text-sm italic">No badges yet. Start donating!</span>}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileView;
