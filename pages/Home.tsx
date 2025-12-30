
import React, { useState, useEffect } from 'react';
import { getDailyQuote } from '../services/geminiService';
import { Notice, CustomQuote, StaffProfile, SiteConfig } from '../types';

interface HomeProps {
  config: SiteConfig;
}

export const Home: React.FC<HomeProps> = ({ config }) => {
  const [quoteData, setQuoteData] = useState<{ quote: string; author: string } | null>(null);
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200');
  const [directorImage, setDirectorImage] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [staffPreview, setStaffPreview] = useState<StaffProfile[]>([]);

  useEffect(() => {
    // Quote Logic
    const storedOverride = localStorage.getItem('qmc_quote_override');
    if (storedOverride) {
      const parsed: CustomQuote = JSON.parse(storedOverride);
      if (parsed.isOverride) {
        setQuoteData({ quote: parsed.text, author: parsed.author });
      } else {
        getDailyQuote().then(setQuoteData);
      }
    } else {
      getDailyQuote().then(setQuoteData);
    }
    
    // Branding Media
    const storedHero = localStorage.getItem('qmc_hero_image');
    const storedDirector = localStorage.getItem('qmc_director_image');
    if (storedHero) setHeroImage(storedHero);
    if (storedDirector) setDirectorImage(storedDirector);

    // Notices
    const storedNotices = localStorage.getItem('qmc_notices');
    if (storedNotices) setNotices(JSON.parse(storedNotices));

    // Staff
    const savedStaff = localStorage.getItem('qmc_staff_data');
    if (savedStaff) {
      setStaffPreview(JSON.parse(savedStaff).slice(0, 4));
    }
  }, []);

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative h-[800px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/80 via-indigo-950/40 to-indigo-950/90 z-10"></div>
        <img 
          src={heroImage} 
          alt="College Campus" 
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-slowZoom"
        />
        <div className="relative z-20 text-center px-4 max-w-6xl">
          <div className="mb-10 inline-flex flex-col items-center">
            <span className="bg-amber-400 text-indigo-900 px-8 py-2 rounded-full text-[10px] font-black tracking-[0.5em] uppercase mb-8 shadow-2xl">
              Est. 2019 • Badagry, Lagos
            </span>
            <span className="text-amber-200 font-serif italic text-3xl md:text-4xl drop-shadow-2xl">
              "{config.tagline}"
            </span>
          </div>
          <h1 className="text-7xl md:text-[10rem] font-bold mb-10 drop-shadow-2xl leading-none font-serif tracking-tight">{config.shortName}</h1>
          <p className="text-2xl md:text-3xl mb-16 font-light drop-shadow-lg max-w-4xl mx-auto opacity-90 leading-relaxed font-serif">
            Welcome to <span className="text-amber-400 font-bold">{config.collegeName}</span>. <br/>A premier legacy institution raising the next generation of global leaders.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <button className="bg-amber-500 hover:bg-amber-600 text-indigo-900 font-black py-6 px-16 rounded-[2rem] transition-all transform hover:scale-105 shadow-2xl uppercase tracking-[0.2em] text-xs">
              Apply for Admission
            </button>
            <button className="bg-white/10 backdrop-blur-3xl hover:bg-white/20 text-white border border-white/40 font-bold py-6 px-16 rounded-[2rem] transition-all shadow-2xl text-xs uppercase tracking-[0.2em]">
              Campus Experience
            </button>
          </div>
        </div>
      </section>

      {/* Quote of the Day */}
      <section className="py-32 bg-indigo-950 text-white relative overflow-hidden text-center">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-amber-400 font-black text-[10px] uppercase tracking-[0.6em] mb-12">Institutional Philosophy</div>
          {quoteData ? (
            <div className="animate-fadeIn">
              <blockquote className="text-4xl md:text-6xl font-serif italic mb-10 leading-tight">
                "{quoteData.quote}"
              </blockquote>
              <cite className="text-amber-400 font-black not-italic tracking-[0.4em] uppercase text-sm">— {quoteData.author}</cite>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center"><div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div></div>
          )}
        </div>
      </section>

      {/* Director's Welcome */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-1/2 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl"></div>
              <img 
                src={directorImage} 
                alt="Director" 
                className="relative rounded-[4rem] shadow-2xl z-10 object-cover aspect-[3/4] w-full max-w-md mx-auto border-[12px] border-slate-50"
              />
            </div>
            <div className="lg:w-1/2">
              <span className="text-indigo-900 text-[10px] font-black uppercase tracking-[0.4em] mb-8 block">Founding Director's Message</span>
              <h2 className="text-6xl font-bold text-gray-900 mb-10 leading-[1.1] font-serif">Raising <span className="text-indigo-800 italic">Visionaries</span> with Character</h2>
              <p className="text-gray-500 text-xl leading-relaxed mb-12">
                At <span className="text-indigo-900 font-bold">{config.collegeName}</span>, we believe education is a sacred journey. Our mission is to equip our students not just with academic knowledge, but with the wisdom and integrity required to lead in a complex world.
              </p>
              <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100">
                <h4 className="font-bold text-indigo-950 text-3xl font-serif mb-2">Dr. Wahab Tajudeen Babatunde</h4>
                <p className="text-amber-600 text-[10px] uppercase tracking-[0.4em] font-black">Executive Director of Studies</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
