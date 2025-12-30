
import React, { useState, useEffect, useRef } from 'react';
import { StaffProfile } from '../types';

const INITIAL_STAFF: StaffProfile[] = [
  { 
    id: '0', 
    name: 'Dr. Wahab Tajudeen Babatunde', 
    role: 'Executive Director of Studies', 
    department: 'Directorate', 
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    email: 'director@qmc.edu.ng',
    qualifications: ['Ph.D. Educational Management', 'M.Ed.', 'B.A. Ed.'],
    bio: 'A visionary leader dedicated to academic excellence. Seen here in his official regal traditional yellow lace attire, Dr. Wahab embodies the fusion of heritage and modern innovation that QMC represents.'
  },
  { 
    id: '1', 
    name: 'Dr. Sarah Johnson', 
    role: 'Academic Principal', 
    department: 'Administration', 
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    bio: 'Expert in secondary school curriculum development and pedagogical innovation.'
  },
  { 
    id: '2', 
    name: 'Mr. David Okafor', 
    role: 'Head of STEM', 
    department: 'Science', 
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
    bio: 'Leading our robotics and coding initiatives across all grade levels.'
  },
  { 
    id: '3', 
    name: 'Mrs. Linda Peters', 
    role: 'Humanities Coordinator', 
    department: 'Arts', 
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    bio: 'Champion of literature and creative writing excellence.'
  }
];

export const StaffCorner: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffProfile[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadStaff = () => {
      const savedStaff = localStorage.getItem('qmc_staff_data');
      if (savedStaff) {
        setStaffList(JSON.parse(savedStaff));
      } else {
        setStaffList(INITIAL_STAFF);
        localStorage.setItem('qmc_staff_data', JSON.stringify(INITIAL_STAFF));
      }
    };

    loadStaff();
    window.addEventListener('storage', loadStaff);
    return () => window.removeEventListener('storage', loadStaff);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedStaff) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        const updatedList = staffList.map(s => 
          s.id === selectedStaff.id ? { ...s, imageUrl: base64Image } : s
        );
        
        setStaffList(updatedList);
        localStorage.setItem('qmc_staff_data', JSON.stringify(updatedList));
        setSelectedStaff({ ...selectedStaff, imageUrl: base64Image });
        
        // Notify other components
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const director = staffList.find(s => s.id === '0') || INITIAL_STAFF[0];
  const otherStaff = filteredStaff.filter(s => s.id !== '0');

  return (
    <div className="container mx-auto px-4 py-20 animate-fadeIn min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div className="max-w-xl">
           <h2 className="text-amber-500 font-black uppercase tracking-[0.4em] text-xs mb-4">The Faculty</h2>
           <h1 className="text-6xl font-bold text-indigo-950 font-serif leading-tight">Portraits of <br/>Academic Vision</h1>
        </div>
        <div className="w-full max-w-sm relative">
          <input 
            type="text" 
            placeholder="Search our educators..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-8 py-5 bg-white shadow-xl rounded-[2rem] border border-indigo-50 outline-none focus:ring-2 focus:ring-amber-400 font-medium transition-all"
          />
        </div>
      </div>

      {/* Featured Director Section */}
      {!searchTerm && (
        <section className="mb-32">
           <div className="bg-indigo-950 rounded-[4rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl items-stretch">
              <div className="lg:w-2/5 relative min-h-[500px]">
                 <img src={director.imageUrl} className="w-full h-full object-cover" alt={director.name} />
                 <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-transparent to-transparent"></div>
              </div>
              <div className="lg:w-3/5 p-12 lg:p-24 flex flex-col justify-center">
                 <span className="text-amber-400 font-black text-[10px] uppercase tracking-[0.5em] mb-6">Executive Profile</span>
                 <h2 className="text-5xl font-bold text-white font-serif mb-6">{director.name}</h2>
                 <p className="text-amber-200 text-xl font-medium italic mb-10">"{director.bio}"</p>
                 <div className="flex gap-4">
                    <button onClick={() => setSelectedStaff(director)} className="bg-white text-indigo-900 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl">Portfolio Details</button>
                    <a href={`mailto:${director.email}`} className="text-white border-b border-white/30 pb-1 text-[10px] font-black uppercase tracking-widest flex items-center h-fit mt-4">Contact Director →</a>
                 </div>
              </div>
           </div>
        </section>
      )}

      <div className="flex items-center gap-6 mb-16">
         <h2 className="text-3xl font-bold text-indigo-950 font-serif">Faculty Gallery</h2>
         <div className="h-[2px] bg-slate-200 flex-grow"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {otherStaff.map((staff) => (
          <div 
            key={staff.id} 
            onClick={() => setSelectedStaff(staff)}
            className="group cursor-pointer animate-fadeIn"
          >
            <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl mb-8 relative bg-slate-100">
               <img src={staff.imageUrl} alt={staff.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
               <div className="absolute inset-0 bg-indigo-950/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <span className="text-white text-[10px] font-black uppercase tracking-widest border border-white/30 px-6 py-3 rounded-full backdrop-blur-sm">View Profile</span>
               </div>
            </div>
            <div className="px-4 text-center">
               <h3 className="font-bold text-2xl text-indigo-950 font-serif mb-1 group-hover:text-indigo-600 transition-colors">{staff.name}</h3>
               <p className="text-amber-600 text-[10px] font-black uppercase tracking-widest">{staff.role}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedStaff && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-indigo-950/95 backdrop-blur-xl animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden animate-scaleIn flex flex-col md:flex-row min-h-[500px]">
            <div className="md:w-1/3 relative group">
               <img src={selectedStaff.imageUrl} className="w-full h-full object-cover" alt={selectedStaff.name} />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-6 text-center">
                  <p className="text-white text-[10px] font-black uppercase tracking-widest mb-4">Change Portrait</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white text-indigo-900 p-4 rounded-full shadow-2xl hover:bg-amber-400 transition-all"
                  >
                    📷
                  </button>
               </div>
            </div>
            <div className="md:w-2/3 p-12 md:p-16 relative">
              <button onClick={() => setSelectedStaff(null)} className="absolute top-10 right-10 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-all z-10">✕</button>
              <span className="text-amber-500 font-black text-[10px] uppercase tracking-[0.5em] mb-6 inline-block">Staff Record</span>
              <h2 className="text-5xl font-bold text-indigo-950 font-serif mb-4">{selectedStaff.name}</h2>
              <p className="text-xl font-medium text-indigo-600 mb-10">{selectedStaff.role}</p>
              
              <div className="space-y-12">
                 {selectedStaff.qualifications && (
                   <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Credentials</h4>
                      <div className="flex flex-wrap gap-3">
                         {selectedStaff.qualifications.map((q, i) => (
                            <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-indigo-900">{q}</span>
                         ))}
                      </div>
                   </div>
                 )}
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Institutional Philosophy</h4>
                    <p className="text-gray-600 leading-relaxed text-lg font-serif italic">"{selectedStaff.bio || 'Excellence is a habit, not an act.'}"</p>
                 </div>
                 
                 <div className="pt-8 border-t border-gray-100">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-900 transition-colors flex items-center gap-2"
                    >
                      <span className="text-lg">✎</span> Update Official Portrait
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                    />
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
