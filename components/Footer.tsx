
import React from 'react';
import { SiteConfig } from '../types';

interface FooterProps {
  config: SiteConfig;
}

export const Footer: React.FC<FooterProps> = ({ config }) => {
  return (
    <footer className="bg-indigo-950 text-gray-300 py-20 mt-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-40"></div>
      
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
        <div>
          <div className="flex items-center space-x-4 mb-8">
             <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-indigo-900 font-black text-xl shadow-xl">{config.shortName}</div>
             <h3 className="text-white text-2xl font-bold tracking-tight font-serif">{config.collegeName}</h3>
          </div>
          <p className="text-sm leading-relaxed mb-8 opacity-70 max-w-sm">Empowering minds, shaping the future of global leaders. Excellence in education and character development at the heart of Badagry, Lagos.</p>
          <div className="inline-block bg-white/5 border-l-4 border-amber-400 px-6 py-2">
            <span className="text-amber-400 text-[10px] font-black tracking-[0.3em] uppercase">{config.tagline}</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-black text-[10px] uppercase tracking-[0.4em] mb-10 opacity-50">Academic Portals</h4>
          <ul className="grid grid-cols-1 gap-5 text-sm font-medium">
            <li><a href="#" className="hover:text-amber-400 transition-all flex items-center group"><span className="mr-3 text-amber-500 opacity-30 group-hover:opacity-100">/</span> Official Student Portal</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-all flex items-center group"><span className="mr-3 text-amber-500 opacity-30 group-hover:opacity-100">/</span> Alumni Network</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-all flex items-center group"><span className="mr-3 text-amber-500 opacity-30 group-hover:opacity-100">/</span> Research Repository</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-all flex items-center group"><span className="mr-3 text-amber-500 opacity-30 group-hover:opacity-100">/</span> Staff Intranet</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-black text-[10px] uppercase tracking-[0.4em] mb-10 opacity-50">Campus Registry</h4>
          <div className="space-y-6 text-sm">
            <div className="flex items-start gap-4">
              <span className="text-xl">📍</span>
              <div className="opacity-80">
                <p className="font-bold text-white">Ikoga Badagry Campus</p>
                <p>Pastor Tihunnu Street, Ikoga Zebbe</p>
                <p>Lagos State, Nigeria</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl">📞</span>
              <p className="font-bold text-white tracking-widest">07015002169</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl">✉️</span>
              <p className="font-medium opacity-80 underline underline-offset-4">registrar@qmc.edu.ng</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 border-t border-white/10 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-[0.2em] font-black opacity-40">
        <p>&copy; {new Date().getFullYear()} {config.collegeName}. All Rights Reserved.</p>
        <p className="mt-4 md:mt-0 flex gap-6">
          <span>Privacy Policy</span>
          <span>Terms of Academic Conduct</span>
          <span>Accreditation Details</span>
        </p>
      </div>
    </footer>
  );
};
