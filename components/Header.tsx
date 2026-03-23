
import React, { useState } from 'react';
import { PetProfile } from '../types';

interface HeaderProps {
  activeProfile: PetProfile;
  profiles: PetProfile[];
  onSwitchProfile: (id: string) => void;
  alertsCount: number;
}

const Header: React.FC<HeaderProps> = ({ activeProfile, profiles, onSwitchProfile, alertsCount }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-2xl transition-all border border-slate-200 group"
          >
            <img src={activeProfile.avatar} alt={activeProfile.name} className="w-8 h-8 rounded-full border border-white shadow-sm" />
            <span className="font-bold text-slate-700">{activeProfile.name}</span>
            <i className={`fa-solid fa-chevron-down text-xs text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
          </button>

          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)}
              ></div>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 py-2 animate-in fade-in zoom-in-95 duration-100">
                <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Switch Pet</p>
                {profiles.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSwitchProfile(p.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-indigo-50 transition-colors ${p.id === activeProfile.id ? 'bg-indigo-50/50' : ''}`}
                  >
                    <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-800">{p.name}</p>
                      <p className="text-[10px] text-slate-500">{p.breed}</p>
                    </div>
                    {p.id === activeProfile.id && <i className="fa-solid fa-check ml-auto text-indigo-500 text-xs"></i>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <h1 className="text-slate-800 font-medium hidden sm:block">
          is currently <span className="text-emerald-500 font-bold">Safe</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer hover:scale-110 transition-transform">
          <i className="fa-solid fa-bell text-slate-400 text-xl"></i>
          {alertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold animate-bounce">
              {alertsCount}
            </span>
          )}
        </div>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-bold text-slate-800">John Doe</p>
            <p className="text-xs text-slate-400 font-bold">ADMIN</p>
          </div>
          <img 
            src="https://picsum.photos/seed/owner/100" 
            alt="User" 
            className="w-10 h-10 rounded-full border-2 border-slate-100 group-hover:border-indigo-400 transition-all"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
