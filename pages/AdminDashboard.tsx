
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Notice, MediaAsset, CustomQuote, AdmissionForm, StaffProfile, SiteConfig } from '../types';

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  category: 'Security' | 'Staff' | 'Branding' | 'System';
}

export const AdminDashboard: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'branding' | 'apps' | 'staff' | 'media' | 'notices' | 'quote' | 'security' | 'logs'>('overview');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Admin Security State - Updated with user provided credentials
  const [adminCreds, setAdminCreds] = useState({ user: 'pazzyloia', pass: '12345678' });

  // Branding State
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    collegeName: 'Queen Marvellous College',
    shortName: 'QMC',
    tagline: 'Achieving Excellence Together',
    mission: '',
    vision: '',
    logoUrl: '',
    admissionYear: '2024/2025'
  });

  // Staff Management State
  const [staffList, setStaffList] = useState<StaffProfile[]>([]);
  const [editingStaff, setEditingStaff] = useState<Partial<StaffProfile> | null>(null);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<LogEntry[]>([]);

  // Data State
  const [applications, setApplications] = useState<AdmissionForm[]>([]);
  const [registeredCount, setRegisteredCount] = useState(1240);
  const [lastRegId, setLastRegId] = useState('QMC/REG/2024/1240');
  const [regHistory, setRegHistory] = useState<string[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [customQuote, setCustomQuote] = useState<CustomQuote>({ text: '', author: '', isOverride: false });

  // Chart Data
  const data = [
    { name: 'Mon', apps: 4 }, { name: 'Tue', apps: 7 }, { name: 'Wed', apps: 5 },
    { name: 'Thu', apps: 12 }, { name: 'Fri', apps: 9 }, { name: 'Sat', apps: 3 }, { name: 'Sun', apps: 6 }
  ];

  useEffect(() => {
    // Load Admin Credentials
    const storedCreds = localStorage.getItem('qmc_admin_creds');
    if (storedCreds) {
        setAdminCreds(JSON.parse(storedCreds));
    } else {
        // Ensure default is saved if nothing exists
        localStorage.setItem('qmc_admin_creds', JSON.stringify({ user: 'pazzyloia', pass: '12345678' }));
    }

    // Load Audit Logs
    const storedLogs = localStorage.getItem('qmc_audit_logs');
    if (storedLogs) setAuditLogs(JSON.parse(storedLogs));

    if (isLoggedIn) {
      const storedConfig = localStorage.getItem('qmc_site_config');
      if (storedConfig) setSiteConfig(JSON.parse(storedConfig));

      setApplications(JSON.parse(localStorage.getItem('qmc_applications') || '[]'));
      setStaffList(JSON.parse(localStorage.getItem('qmc_staff_data') || '[]'));
      setNotices(JSON.parse(localStorage.getItem('qmc_notices') || '[]'));
      
      const storedMedia = localStorage.getItem('qmc_media_gallery');
      if (storedMedia) setMediaAssets(JSON.parse(storedMedia));

      setRegisteredCount(parseInt(localStorage.getItem('qmc_registered_count') || '1240'));
      setLastRegId(localStorage.getItem('qmc_last_reg_id') || `QMC/REG/${new Date().getFullYear()}/1240`);
      setRegHistory(JSON.parse(localStorage.getItem('qmc_reg_history') || '[]'));
      
      const storedQuote = localStorage.getItem('qmc_quote_override');
      if (storedQuote) setCustomQuote(JSON.parse(storedQuote));
    }
  }, [isLoggedIn]);

  const addLog = (action: string, details: string, category: LogEntry['category']) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      user: adminCreds.user,
      action,
      details,
      category
    };
    const updatedLogs = [newLog, ...auditLogs].slice(0, 100); // Keep last 100 logs
    setAuditLogs(updatedLogs);
    localStorage.setItem('qmc_audit_logs', JSON.stringify(updatedLogs));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === adminCreds.user && loginPassword === adminCreds.pass) {
      setIsLoggedIn(true);
      addLog('Login Success', 'Administrative portal accessed', 'Security');
    } else {
      addLog('Login Failure', `Attempt with username: ${loginUsername}`, 'Security');
      alert("Invalid credentials. Please use the designated administrator login.");
    }
  };

  const handleUpdateSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('qmc_admin_creds', JSON.stringify(adminCreds));
    addLog('Security Update', 'Admin credentials modified', 'Security');
    alert("Administrative credentials updated successfully.");
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('qmc_site_config', JSON.stringify(siteConfig));
    addLog('Branding Update', `Updated ${siteConfig.collegeName} configuration`, 'Branding');
    window.dispatchEvent(new Event('storage'));
    alert("Site branding and mission/vision updated successfully.");
  };

  const handleStaffUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff?.name) return;

    let updatedList;
    const isNew = !editingStaff.id;
    if (editingStaff.id) {
      updatedList = staffList.map(s => s.id === editingStaff.id ? editingStaff as StaffProfile : s);
    } else {
      const newStaff = { ...editingStaff, id: Date.now().toString() } as StaffProfile;
      updatedList = [...staffList, newStaff];
    }

    setStaffList(updatedList);
    localStorage.setItem('qmc_staff_data', JSON.stringify(updatedList));
    addLog(isNew ? 'Staff Added' : 'Staff Updated', `Record for ${editingStaff.name}`, 'Staff');
    setEditingStaff(null);
    alert("Staff records updated.");
  };

  const handleDeleteStaff = (id: string) => {
    const staff = staffList.find(s => s.id === id);
    if (window.confirm("Are you sure you want to remove this faculty member?")) {
      const updatedList = staffList.filter(s => s.id !== id);
      setStaffList(updatedList);
      localStorage.setItem('qmc_staff_data', JSON.stringify(updatedList));
      addLog('Staff Deleted', `Removed ${staff?.name || 'unknown'} from records`, 'Staff');
    }
  };

  const handleStaffImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingStaff) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingStaff({ ...editingStaff, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-gray-50 animate-fadeIn">
        <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-indigo-50 p-12">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-indigo-900 text-2xl font-black">AD</span>
            </div>
            <h1 className="text-3xl font-bold text-indigo-900 font-serif">Admin Dashboard</h1>
            <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest font-black">Institutional Access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest ml-1">Username</label>
              <input type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-amber-400 transition-all" placeholder="Enter Admin ID" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest ml-1">Password</label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-amber-400 transition-all" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-indigo-900 text-white font-black py-4 rounded-xl hover:bg-indigo-800 transition-all uppercase tracking-widest text-xs shadow-xl">Secure Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-indigo-900 font-serif">Management Console</h1>
          <div className="flex flex-wrap gap-2 mt-6">
            {(['overview', 'branding', 'apps', 'staff', 'security', 'logs'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2.5 rounded-full transition-all ${activeTab === tab ? 'bg-amber-400 text-indigo-900 shadow-xl scale-105' : 'text-gray-400 hover:bg-white hover:text-indigo-900'}`}
              >
                {tab === 'logs' ? 'Audit Logs' : tab}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => { setIsLoggedIn(false); addLog('Logout', 'User signed out manually', 'Security'); }} className="bg-red-50 text-red-500 font-black text-[10px] uppercase tracking-widest px-8 py-3 rounded-full border border-red-100 hover:bg-red-100 transition-all">Sign Out</button>
      </div>

      {activeTab === 'logs' && (
        <div className="animate-fadeIn">
          <div className="bg-white rounded-[3rem] shadow-2xl border border-indigo-50 overflow-hidden">
            <div className="p-10 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-indigo-900 font-serif">Administrative Trail</h2>
                <p className="text-gray-400 text-sm">Real-time log of all system and record changes.</p>
              </div>
              <button 
                onClick={() => { if(window.confirm('Clear all logs?')) { setAuditLogs([]); localStorage.removeItem('qmc_audit_logs'); } }}
                className="text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
              >
                Clear History
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-indigo-50/50 text-indigo-900 font-black text-[10px] uppercase tracking-[0.2em]">
                    <th className="px-10 py-6">Timestamp</th>
                    <th className="px-6 py-6">Category</th>
                    <th className="px-6 py-6">Action</th>
                    <th className="px-10 py-6">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {auditLogs.length > 0 ? auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-10 py-5 text-[11px] font-mono text-gray-400">{log.timestamp}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          log.category === 'Security' ? 'bg-red-50 text-red-500' :
                          log.category === 'Staff' ? 'bg-indigo-50 text-indigo-600' :
                          log.category === 'Branding' ? 'bg-amber-50 text-amber-600' :
                          'bg-gray-50 text-gray-500'
                        }`}>
                          {log.category}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-indigo-900">{log.action}</td>
                      <td className="px-10 py-5 text-sm text-gray-500">{log.details}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-10 py-20 text-center text-gray-400 italic">No administrative actions recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="animate-fadeIn space-y-8">
          <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-indigo-950 font-serif">Faculty Registry</h2>
            <button 
              onClick={() => setEditingStaff({ name: '', role: '', department: '', bio: '', imageUrl: '', qualifications: [] })}
              className="bg-indigo-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-800 transition-all"
            >
              + Add New Staff
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffList.map(staff => (
              <div key={staff.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-xl transition-all">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border-2 border-indigo-50">
                   <img src={staff.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-bold text-indigo-900 truncate">{staff.name}</h3>
                  <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest">{staff.role}</p>
                </div>
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => setEditingStaff(staff)} className="p-2 text-indigo-400 hover:text-indigo-600">✎</button>
                  <button onClick={() => handleDeleteStaff(staff.id)} className="p-2 text-red-300 hover:text-red-500">✕</button>
                </div>
              </div>
            ))}
          </div>

          {editingStaff && (
            <div className="fixed inset-0 z-[1001] bg-indigo-950/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-scaleIn">
                <form onSubmit={handleStaffUpdate} className="p-12 space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-indigo-900 font-serif">{editingStaff.id ? 'Edit Faculty Member' : 'Add Faculty Member'}</h3>
                    <button type="button" onClick={() => setEditingStaff(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block">Full Name</label>
                      <input 
                        type="text" 
                        required 
                        value={editingStaff.name} 
                        onChange={e => setEditingStaff({...editingStaff, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block">Role</label>
                      <input 
                        type="text" 
                        required 
                        value={editingStaff.role} 
                        onChange={e => setEditingStaff({...editingStaff, role: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block">Department</label>
                    <input 
                      type="text" 
                      value={editingStaff.department} 
                      onChange={e => setEditingStaff({...editingStaff, department: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block">Staff Portrait</label>
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden border-2 border-indigo-50">
                         {editingStaff.imageUrl && <img src={editingStaff.imageUrl} className="w-full h-full object-cover" />}
                       </div>
                       <input type="file" accept="image/*" onChange={handleStaffImageUpload} className="text-xs text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block">Biography / Philosophy</label>
                    <textarea 
                      rows={3}
                      value={editingStaff.bio} 
                      onChange={e => setEditingStaff({...editingStaff, bio: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    />
                  </div>

                  <button type="submit" className="w-full bg-indigo-900 text-white font-black py-4 rounded-2xl hover:bg-indigo-800 transition-all uppercase tracking-widest text-xs mt-4">
                    Save Faculty Record
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="animate-fadeIn max-w-2xl mx-auto">
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-indigo-50">
            <div className="mb-10 text-center">
               <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🛡️</div>
               <h2 className="text-3xl font-bold text-indigo-900 font-serif">Credential Vault</h2>
               <p className="text-gray-400 text-sm mt-2">Update your administrative access credentials.</p>
            </div>

            <form onSubmit={handleUpdateSecurity} className="space-y-8">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block">New Administrative Username</label>
                  <input 
                    type="text" 
                    value={adminCreds.user} 
                    onChange={e => setAdminCreds({...adminCreds, user: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-400/10"
                  />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block">New Master Password</label>
                  <input 
                    type="password" 
                    value={adminCreds.pass} 
                    onChange={e => setAdminCreds({...adminCreds, pass: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-400/10"
                  />
               </div>
               <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                  <p className="text-[10px] text-amber-700 font-bold leading-relaxed">NOTE: Changing these credentials will instantly affect the login process for all administrative users. Ensure you have stored the new credentials safely.</p>
               </div>
               <button type="submit" className="w-full bg-indigo-950 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-indigo-900 transition-all uppercase tracking-[0.2em] text-xs">
                  Update Security Profile
               </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'branding' && (
        <div className="animate-fadeIn max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-indigo-50">
            <div className="flex items-center gap-6 mb-12 border-b border-gray-100 pb-10">
              <div className="w-20 h-20 bg-amber-400 rounded-[2.5rem] flex items-center justify-center text-indigo-900 overflow-hidden shadow-lg border-4 border-white">
                {siteConfig.logoUrl ? <img src={siteConfig.logoUrl} className="w-full h-full object-contain" /> : <span className="text-3xl font-black">🏛️</span>}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-indigo-900 font-serif">Site Identity</h2>
                <p className="text-gray-400 font-medium">Control the institutional branding and academic settings.</p>
              </div>
            </div>
            
            <form onSubmit={handleSaveConfig} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block">College Site Name</label>
                  <input 
                    type="text" 
                    value={siteConfig.collegeName} 
                    onChange={e => setSiteConfig({...siteConfig, collegeName: e.target.value})}
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-amber-400/20 transition-all font-bold text-indigo-950" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block">Short Name (Initials)</label>
                  <input 
                    type="text" 
                    value={siteConfig.shortName} 
                    onChange={e => setSiteConfig({...siteConfig, shortName: e.target.value})}
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block">Academic Admission Year</label>
                  <input 
                    type="text" 
                    value={siteConfig.admissionYear} 
                    onChange={e => setSiteConfig({...siteConfig, admissionYear: e.target.value})}
                    className="w-full px-6 py-5 bg-indigo-50 border border-indigo-100 rounded-3xl outline-none font-bold text-indigo-900 focus:ring-4 focus:ring-amber-400/20" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block">Official Tagline</label>
                  <input 
                    type="text" 
                    value={siteConfig.tagline} 
                    onChange={e => setSiteConfig({...siteConfig, tagline: e.target.value})}
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none italic" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block">Mission Statement</label>
                <textarea 
                  value={siteConfig.mission} 
                  onChange={e => setSiteConfig({...siteConfig, mission: e.target.value})}
                  rows={3}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none resize-none font-medium leading-relaxed" 
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block">Vision Statement</label>
                <textarea 
                  value={siteConfig.vision} 
                  onChange={e => setSiteConfig({...siteConfig, vision: e.target.value})}
                  rows={3}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none resize-none font-medium leading-relaxed" 
                />
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                 <button type="submit" className="bg-indigo-900 text-white font-black py-5 px-14 rounded-3xl shadow-2xl hover:bg-indigo-800 transition-all uppercase tracking-[0.2em] text-xs">
                   Publish Institutional Updates
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border-t-8 border-amber-400">
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Total Students</p>
              <h3 className="text-5xl font-black text-indigo-950 mb-8">{registeredCount.toLocaleString()}</h3>
            </div>
            <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-gray-100">
               <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Pending Admissions</p>
               <h3 className="text-5xl font-black text-indigo-950">{applications.filter(a => a.status === 'Pending').length}</h3>
            </div>
            <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-gray-100">
               <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Active Faculty</p>
               <h3 className="text-5xl font-black text-indigo-950">{staffList.length}</h3>
            </div>
            <div className="bg-indigo-900 p-10 rounded-[3.5rem] shadow-2xl text-white">
               <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Registry Portal</p>
               <p className="text-sm font-mono font-bold mt-12 tracking-widest opacity-90 uppercase">Status: Live</p>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-gray-100 h-[500px]">
             <h3 className="text-2xl font-bold text-indigo-950 font-serif mb-12">Institutional Momentum</h3>
             <ResponsiveContainer width="100%" height="80%">
               <BarChart data={data}>
                 <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 700}} />
                 <YAxis hide />
                 <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)'}} />
                 <Bar dataKey="apps" fill="#4338ca" radius={[16, 16, 0, 0]} barSize={60} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
