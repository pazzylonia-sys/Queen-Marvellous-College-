
import React, { useState, useEffect } from 'react';
import { AppView, SiteConfig } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Admissions } from './pages/Admissions';
import { StaffCorner } from './pages/StaffCorner';
import { AdminDashboard } from './pages/AdminDashboard';

const DEFAULT_CONFIG: SiteConfig = {
  collegeName: 'Queen Marvellous College',
  shortName: 'QMC',
  tagline: 'Achieving Excellence Together',
  mission: 'To foster an inclusive learning community dedicated to intellectual growth, personal integrity, and active global citizenship.',
  vision: 'To be a premier global institution recognized for nurturing future leaders who possess both the competence and the conscience to change the world.',
  logoUrl: '',
  admissionYear: '2024/2025'
};

const About: React.FC<{ config: SiteConfig }> = ({ config }) => (
  <div className="container mx-auto px-4 py-20 max-w-4xl animate-fadeIn">
    <h1 className="text-5xl font-bold text-indigo-900 mb-8 font-serif">Our Heritage</h1>
    <div className="prose prose-lg text-gray-700 leading-relaxed">
      <p className="mb-8 text-xl text-gray-500 italic">"Empowering the vision of today for the leadership of tomorrow."</p>
      <p className="mb-6">Founded in 2019, <span className="font-bold text-indigo-900">{config.collegeName}</span> was established with a singular vision: to create an environment where every student is recognized as a unique potential waiting to be realized.</p>
      <p className="mb-6">Our campus in Badagry is more than just buildings; it's a living laboratory for innovation, creativity, and character formation. With a faculty comprised of world-class educators, we offer a curriculum that balances academic excellence with emotional intelligence.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
        <div className="bg-indigo-900 text-white p-10 rounded-[2.5rem] shadow-2xl transform hover:-translate-y-2 transition-transform">
          <div className="w-12 h-12 bg-amber-400 rounded-xl mb-6 flex items-center justify-center text-indigo-900 text-xl font-black">M</div>
          <h3 className="text-2xl font-bold mb-4 font-serif">Our Mission</h3>
          <p className="text-indigo-100 leading-relaxed">{config.mission}</p>
        </div>
        <div className="bg-amber-400 text-indigo-900 p-10 rounded-[2.5rem] shadow-2xl transform hover:-translate-y-2 transition-transform">
          <div className="w-12 h-12 bg-indigo-900 rounded-xl mb-6 flex items-center justify-center text-amber-400 text-xl font-black">V</div>
          <h3 className="text-2xl font-bold mb-4 font-serif">Our Vision</h3>
          <p className="text-indigo-950 leading-relaxed">{config.vision}</p>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    const stored = localStorage.getItem('qmc_site_config');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure existing storage gets the new field if it doesn't exist
      if (!parsed.admissionYear) parsed.admissionYear = DEFAULT_CONFIG.admissionYear;
      setSiteConfig(parsed);
      document.title = parsed.collegeName || DEFAULT_CONFIG.collegeName;
    } else {
      localStorage.setItem('qmc_site_config', JSON.stringify(DEFAULT_CONFIG));
    }
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'qmc_site_config' && e.newValue) {
        const parsed = JSON.parse(e.newValue);
        setSiteConfig(parsed);
        document.title = parsed.collegeName || DEFAULT_CONFIG.collegeName;
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME: return <Home config={siteConfig} />;
      case AppView.ADMISSIONS: return <Admissions config={siteConfig} />;
      case AppView.STAFF: return <StaffCorner />;
      case AppView.ADMIN: return <AdminDashboard />;
      case AppView.ABOUT: return <About config={siteConfig} />;
      default: return <Home config={siteConfig} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 selection:bg-indigo-200 selection:text-indigo-900">
      <Navbar currentView={currentView} setView={setCurrentView} config={siteConfig} />
      <main className="flex-grow">
        {renderView()}
      </main>
      <Footer config={siteConfig} />
    </div>
  );
};

export default App;
