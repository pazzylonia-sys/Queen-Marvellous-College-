
import React from 'react';
import { AppView, SiteConfig } from '../types';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  config: SiteConfig;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, config }) => {
  const navItems = [
    { label: 'Home', view: AppView.HOME },
    { label: 'Admissions', view: AppView.ADMISSIONS },
    { label: 'Staff', view: AppView.STAFF },
    { label: 'Admin', view: AppView.ADMIN },
    { label: 'About', view: AppView.ABOUT },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-indigo-900 text-white shadow-xl border-b border-indigo-800 backdrop-blur-md bg-indigo-900/95">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="flex items-center space-x-4 cursor-pointer group"
          onClick={() => setView(AppView.HOME)}
        >
          <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-3 transition-all overflow-hidden border-2 border-amber-300/20">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
            ) : (
              <span className="text-indigo-900 font-black text-xl tracking-tighter">{config.shortName}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg md:text-xl tracking-tight hidden md:block leading-none font-serif uppercase">{config.collegeName}</span>
            <span className="text-[9px] text-amber-400 font-black tracking-[0.4em] hidden md:block uppercase mt-1 opacity-80">{config.tagline}</span>
          </div>
        </div>
        
        <div className="flex space-x-1 md:space-x-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`px-4 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${
                currentView === item.view 
                  ? 'bg-amber-400 text-indigo-900 shadow-lg scale-105' 
                  : 'text-indigo-100 hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
