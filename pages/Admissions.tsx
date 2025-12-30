
import React, { useState, useRef, useEffect } from 'react';
import { getAdmissionChatResponse } from '../services/geminiService';
import { AdmissionForm, SiteConfig } from '../types';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface AdmissionsProps {
  config: SiteConfig;
}

export const Admissions: React.FC<AdmissionsProps> = ({ config }) => {
  const [formData, setFormData] = useState<Partial<AdmissionForm>>({
    fullName: '',
    dateOfBirth: '',
    email: '',
    gradeLevel: '',
    admissionClass: '',
    passportPhoto: ''
  });
  
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'assistant', text: `Welcome to the ${config.collegeName} Admissions Portal! I'm here to help you join our regal community for the ${config.admissionYear} session. Do you have any questions about requirements or the classes we offer?` }
  ]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsUsingCamera(true);
      }
    } catch (err) {
      alert("Could not access camera. Please check permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setFormData(prev => ({ ...prev, passportPhoto: dataUrl }));
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsUsingCamera(false);
    }
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formData.fullName) newErrors.fullName = "Required";
    if (!formData.email) newErrors.email = "Required";
    if (!formData.admissionClass) newErrors.admissionClass = "Class of admission required";
    if (!formData.passportPhoto) newErrors.passportPhoto = "Photo required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const newApp: AdmissionForm = {
        ...formData as any,
        id: `APP-${Date.now()}`,
        status: 'Pending',
        dateApplied: new Date().toISOString()
      };
      
      const existing = JSON.parse(localStorage.getItem('qmc_applications') || '[]');
      localStorage.setItem('qmc_applications', JSON.stringify([...existing, newApp]));
      
      setSubmitted(true);
    }
  };

  const handleAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    const userMsg = query.trim();
    setQuery('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    const response = await getAdmissionChatResponse(userMsg);
    setChatHistory(prev => [...prev, { role: 'assistant', text: response }]);
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-6xl animate-fadeIn">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-indigo-950 mb-4 font-serif">Admission Registration {config.admissionYear}</h1>
        <p className="text-gray-500 font-medium max-w-2xl mx-auto">Please complete the form below to begin the official {config.shortName} admission process. Ensure all details match your primary academic records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form Column */}
        <div className="lg:col-span-7">
          {submitted ? (
            <div className="bg-white p-16 rounded-[3rem] shadow-2xl border border-indigo-50 text-center animate-scaleIn">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner">✓</div>
              <h2 className="text-3xl font-bold text-indigo-950 mb-4">Application Success!</h2>
              <p className="text-gray-500 mb-10 leading-relaxed">Your application for <span className="font-bold text-indigo-900">{formData.admissionClass}</span> has been received. Our registry will contact you at <span className="italic">{formData.email}</span> within 3-5 business days.</p>
              <button onClick={() => window.location.reload()} className="bg-indigo-900 text-white font-black py-4 px-12 rounded-2xl shadow-xl uppercase tracking-widest text-sm hover:bg-indigo-800 transition-all">Start New Entry</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-indigo-50 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-3">Student Full Name</label>
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                    placeholder="Surname Firstname Middle"
                  />
                  {errors.fullName && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-3">Class of Admission</label>
                  <select 
                    value={formData.admissionClass}
                    onChange={e => setFormData({...formData, admissionClass: e.target.value})}
                    className="w-full px-6 py-4 bg-indigo-50 border border-indigo-100 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all appearance-none font-bold text-indigo-900"
                  >
                    <option value="">Select Entry Class</option>
                    <optgroup label="Junior Secondary">
                      <option value="JSS 1">JSS 1</option>
                      <option value="JSS 2">JSS 2</option>
                      <option value="JSS 3">JSS 3</option>
                    </optgroup>
                    <optgroup label="Senior Secondary">
                      <option value="SSS 1">SSS 1</option>
                      <option value="SSS 2">SSS 2</option>
                      <option value="SSS 3">SSS 3</option>
                    </optgroup>
                  </select>
                  {errors.admissionClass && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.admissionClass}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-3">Guardian Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                    placeholder="parent@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-3">Student Date of Birth</label>
                  <input 
                    type="date" 
                    value={formData.dateOfBirth}
                    onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Passport Component */}
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Passport Identification</label>
                <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <div className="w-40 aspect-square bg-white rounded-3xl overflow-hidden border-4 border-white shadow-xl flex items-center justify-center relative group">
                    {formData.passportPhoto ? (
                      <img src={formData.passportPhoto} className="w-full h-full object-cover" alt="Passport Preview" />
                    ) : isUsingCamera ? (
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center opacity-20 group-hover:opacity-40 transition-opacity">
                         <span className="text-4xl block mb-2">👤</span>
                         <span className="text-[8px] font-black uppercase tracking-widest">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow flex flex-col gap-3 w-full">
                    {!isUsingCamera ? (
                      <>
                        <button type="button" onClick={startCamera} className="bg-indigo-900 text-white font-black py-4 px-8 rounded-xl hover:bg-indigo-800 transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest">
                          <span>📷</span> Live Camera Capture
                        </button>
                        <div className="relative">
                          <input type="file" accept="image/*" onChange={e => {
                            const f = e.target.files?.[0];
                            if(f) {
                              const r = new FileReader();
                              r.onload = () => setFormData({...formData, passportPhoto: r.result as string});
                              r.readAsDataURL(f);
                            }
                          }} className="absolute inset-0 opacity-0 cursor-pointer" />
                          <button type="button" className="w-full bg-white text-indigo-900 font-black py-4 px-8 rounded-xl border border-indigo-100 hover:bg-slate-50 transition-all text-[10px] uppercase tracking-widest">
                            Upload from Device
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex gap-2">
                        <button type="button" onClick={capturePhoto} className="flex-grow bg-amber-400 text-indigo-900 font-black py-4 rounded-xl hover:bg-amber-500 transition-all text-[10px] uppercase tracking-widest">
                          Confirm Capture
                        </button>
                        <button type="button" onClick={stopCamera} className="px-6 bg-red-50 text-red-500 font-black rounded-xl hover:bg-red-100 transition-all text-[10px] uppercase tracking-widest">
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {errors.passportPhoto && <p className="text-red-500 text-[10px] font-bold">{errors.passportPhoto}</p>}
              </div>

              <button type="submit" className="w-full py-6 bg-indigo-950 text-white font-black rounded-[2rem] shadow-2xl hover:bg-indigo-900 transition-all uppercase tracking-[0.3em] text-xs">
                Submit Admission Dossier
              </button>
              <canvas ref={canvasRef} className="hidden" />
            </form>
          )}
        </div>

        {/* AI Column */}
        <div className="lg:col-span-5 flex flex-col h-[750px] bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-indigo-50">
          <div className="p-10 bg-indigo-950 text-white flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="flex items-center gap-5 relative z-10">
               <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center text-indigo-950 text-2xl shadow-xl">👑</div>
               <div>
                  <h3 className="font-bold text-xl font-serif tracking-tight">QMC Support</h3>
                  <p className="text-[9px] text-amber-400 uppercase tracking-[0.4em] font-black">Institutional Concierge</p>
               </div>
            </div>
          </div>
          
          <div className="flex-grow p-10 overflow-y-auto space-y-8 bg-slate-50/50">
            {chatHistory.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] p-6 rounded-[2rem] text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' : 'bg-white border border-indigo-50 text-gray-700 rounded-tl-none shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="flex gap-2 p-4 bg-white/50 rounded-2xl w-fit animate-pulse"><div className="w-2 h-2 bg-amber-400 rounded-full"></div><div className="w-2 h-2 bg-amber-400 rounded-full delay-75"></div><div className="w-2 h-2 bg-amber-400 rounded-full delay-150"></div></div>}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleAiChat} className="p-8 bg-white border-t border-slate-100 flex gap-5">
            <input 
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-grow px-8 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-400/20 outline-none transition-all placeholder:text-slate-300 font-medium"
              placeholder="Ask about classes, fees, or requirements..."
            />
            <button type="submit" className="w-14 h-14 bg-indigo-900 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-800 transition-all shadow-xl active:scale-90">
               <span className="text-xl">➔</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
