'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  LogOut, ShieldCheck, User as UserIcon, Fingerprint, Clock, 
  Loader2, Activity, Users, Database, Search, ChevronRight, 
  Circle, Scan, ShieldAlert, Zap, TrendingUp
} from 'lucide-react';

export default function AIControlCenter() {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [faceCount, setFaceCount] = useState(0); 
  const [loading, setLoading] = useState(true);
  
  const [aiStats] = useState({
    avgAccuracy: 99.2,
    threatsBlocked: 0,
  });

  const [neuralData, setNeuralData] = useState(
    Array.from({ length: 18 }, () => Math.floor(Math.random() * 60) + 30)
  );

  useEffect(() => {
    async function fetchDatabaseInfo() {
      setLoading(true);
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      const { count, error: faceError } = await supabase
        .from('user_faces')
        .select('user_id', { count: 'exact', head: true });

      if (!userError) setUsersList(users || []);
      if (!faceError) setFaceCount(count || 0);
      setLoading(false);
    }
    fetchDatabaseInfo();

    // กราฟขยับแบบสมูทขึ้น
    const interval = setInterval(() => {
      setNeuralData(prev => prev.map(h => {
        const change = (Math.random() - 0.5) * 15;
        return Math.max(20, Math.min(100, h + change));
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    window.location.href = '/components/signin';
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-[#FFA494] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex overflow-hidden font-sans relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFA494]/5 blur-[120px] rounded-full -z-10" />

      {/* --- SIDEBAR --- */}
      <aside className="w-20 md:w-64 bg-[#0d0d0d] border-r border-white/5 flex flex-col p-6 z-20 transition-all duration-300">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-[#FFA494] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,164,148,0.2)] animate-pulse">
            <Scan className="text-black w-6 h-6" />
          </div>
          <span className="font-black text-xl hidden md:block tracking-tighter italic uppercase underline decoration-[#FFA494]/30">Facelock<span className="text-[#FFA494]">.</span>AI</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <div className="p-4 bg-white/5 text-[#FFA494] rounded-2xl flex items-center gap-4 font-bold border border-[#FFA494]/10 shadow-lg">
            <Activity className="w-5 h-5" />
            <span className="hidden md:block">Control Center</span>
          </div>
          <div className="p-4 text-white/20 hover:text-white rounded-2xl flex items-center gap-4 font-bold transition-all group cursor-pointer">
            <Database className="w-5 h-5 group-hover:text-[#FFA494]" />
            <span className="hidden md:block">Vector Sets</span>
          </div>
        </nav>

        <button onClick={handleLogout} className="p-4 text-white/20 hover:text-red-400 flex items-center gap-4 font-bold transition-all mt-auto group">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden md:block">Logout System</span>
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto relative z-10">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">AI Biometric Engine Active</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight italic uppercase">
            Control Center<span className="text-[#FFA494]">.</span>
          </h1>
        </header>

        {/* --- SECTION 1: TOP STAT CARDS (NEW ANIMATION) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            icon={<Zap />} 
            label="AI Accuracy" 
            value={`${aiStats.avgAccuracy}%`} 
            sub="Neural Match Score" 
            trend="AI Calculated" 
            hoverBg="hover:bg-[#FFA494]"
          />
          <StatCard 
            icon={<Fingerprint />} 
            label="Face Enrolled" 
            value={faceCount} 
            sub="Active Vectors" 
            trend="In Database" 
            hoverBg="hover:bg-blue-400"
          />
          <StatCard 
            icon={<ShieldAlert />} 
            label="Threats Blocked" 
            value={aiStats.threatsBlocked} 
            sub="Intrusion Shield" 
            trend="Safe" 
            hoverBg="hover:bg-purple-400"
          />
        </div>

        {/* --- SECTION 2: NEURAL VISUALIZER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-[#161616] rounded-[3rem] border border-white/5 p-10 relative overflow-hidden group hover:border-[#FFA494]/30 transition-all duration-700 shadow-2xl">
            <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3 mb-10">
              <TrendingUp className="w-5 h-5 text-[#FFA494]" /> Neural Load Analysis
            </h3>
            <div className="h-40 flex items-end gap-1.5 px-2">
              {neuralData.map((h, i) => (
                <div key={i} className="flex-1 bg-white/5 rounded-full relative overflow-hidden h-full">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#FFA494] to-pink-500 transition-all duration-700 ease-out"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#161616] rounded-[3rem] border border-white/5 p-8 shadow-2xl relative flex flex-col hover:border-white/20 transition-all duration-700">
            <h3 className="font-bold text-lg uppercase italic tracking-tighter flex items-center gap-3 mb-8">
              <ShieldAlert className="w-5 h-5 text-[#FFA494]" /> Activity Logs
            </h3>
            <div className="space-y-8 relative flex-1">
              <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#FFA494]/50 via-white/5 to-transparent" />
              <div className="flex gap-6 items-start relative z-10 group cursor-default">
                <div className="w-8 h-8 rounded-full bg-[#FFA494] text-black flex items-center justify-center border-2 border-[#FFA494] shadow-[0_0_12px_rgba(255,164,148,0.4)] animate-pulse"><ShieldCheck className="w-4 h-4" /></div>
                <div>
                   <h4 className="text-[11px] font-black uppercase group-hover:text-[#FFA494] transition-colors">{usersList[0]?.full_name || 'System'}</h4>
                   <p className="text-[10px] text-white/30">Verified & Authorized</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: USER REGISTRY --- */}
        <div className="bg-[#161616] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <h3 className="font-bold text-2xl uppercase italic tracking-tighter flex items-center gap-3">
              <Fingerprint className="w-6 h-6 text-[#FFA494]" /> User Registry
            </h3>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input type="text" placeholder="Search Identities..." className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-xs outline-none focus:border-[#FFA494]/30 transition-all" />
            </div>
          </div>
          <div className="p-8 space-y-4">
            {usersList.map((user) => (
              <div key={user.id} className="group flex flex-col md:flex-row items-center justify-between p-6 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-[2.5rem] transition-all duration-500">
                <div className="flex items-center gap-6 w-full md:w-1/3">
                  <div className="w-16 h-16 bg-black/40 rounded-[1.5rem] flex items-center justify-center border border-white/5 group-hover:border-[#FFA494]/50 transition-all">
                    <UserIcon className="w-8 h-8 text-[#FFA494]/40 group-hover:text-[#FFA494] transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-black text-xl group-hover:text-[#FFA494] transition-colors">{user.full_name}</h4>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] font-mono mt-1 italic">UID: {user.id.substring(0,18)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-green-500/5 rounded-full border border-green-500/10">
                    <Circle className="w-1.5 h-1.5 fill-green-500 text-green-500 shadow-[0_0_5px_#22c55e]" />
                    <span className="text-[9px] font-black text-green-500 uppercase">Registered</span>
                </div>
                <p className="text-sm font-bold text-white/60">{new Date(user.created_at).toLocaleDateString('en-GB')}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// อัปเกรด StatCard Animation
function StatCard({ icon, label, value, sub, trend, hoverBg }: any) {
  return (
    <div className={`
      bg-[#161616] p-8 rounded-[3rem] border border-white/5 
      relative overflow-hidden cursor-pointer
      transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
      hover:scale-[1.03] hover:-translate-y-2
      ${hoverBg} group shadow-2xl
    `}>
      <div className="relative z-10 space-y-5">
        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:bg-black group-hover:shadow-lg">
          {React.cloneElement(icon, { 
            className: "w-7 h-7 text-[#FFA494] transition-all duration-500 group-hover:scale-110 group-hover:text-white" 
          })}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2 transition-colors duration-500 group-hover:text-black/60">
            {label}
          </p>
          <h3 className="text-5xl font-black italic tracking-tighter mb-2 transition-colors duration-500 group-hover:text-black">
            {value}
          </h3>
          <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2 transition-colors duration-500 group-hover:border-black/10">
             <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest transition-colors duration-500 group-hover:text-black/40">
               {sub}
             </p>
             <span className="text-[9px] font-black uppercase text-[#FFA494] bg-[#FFA494]/10 px-3 py-1 rounded-full transition-all duration-500 group-hover:bg-black/20 group-hover:text-black">
               {trend}
             </span>
          </div>
        </div>
      </div>
      {/* Glow Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}