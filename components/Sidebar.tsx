
import React from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-gauge-high' },
    { id: 'map', label: 'Live Map', icon: 'fa-map-location-dot' },
    { id: 'profile', label: 'Pet Profile', icon: 'fa-paw' },
    { id: 'alerts', label: 'Alerts', icon: 'fa-bell' },
  ];

  return (
    <aside className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col transition-all">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">
          <i className="fa-solid fa-shield-dog"></i>
        </div>
        <span className="hidden md:block text-xl font-bold text-slate-800 tracking-tight">PawSense</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg w-6`}></i>
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 hidden md:block">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white">
          <p className="text-xs font-medium opacity-80 mb-1">PRO FEATURES</p>
          <p className="text-sm font-bold mb-3">AI Vet Assistant</p>
          <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
