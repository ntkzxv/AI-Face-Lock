'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  LogOut, ShieldCheck, User as UserIcon, Fingerprint, Clock, 
  Loader2, Activity, Users, Database, Search, ChevronRight, 
  Circle, Scan, ShieldAlert, Zap, TrendingUp, CheckCircle2, X as CloseIcon
} from 'lucide-react';

export default function AIControlCenter() {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [faceCount, setFaceCount] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const [aiStats] = useState({ avgAccuracy: 99.2, threatsBlocked: 0 });
  const [neuralData, setNeuralData] = useState(Array.from({ length: 18 }, () => Math.floor(Math.random() * 60) + 30));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'success') {
      setShowToast(true);
      window.history.replaceState({}, '', window.location.pathname);
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    async function fetchDatabaseInfo() {
      try {
        const { data: users, error: userError } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        const { count, error: faceError } = await supabase.from('user_faces').select('user_id', { count: 'exact', head: true });
        if (!userError) setUsersList(users || []);
        if (!faceError) setFaceCount(count || 0);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    fetchDatabaseInfo();
    const interval = setInterval(() => {
      setNeuralData(prev => prev.map(h => Math.max(20, Math.min(100, h + (Math.random() - 0.5) * 15))));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/'; 
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-[#FFA494] animate-spin" />
    </div>
  );

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex overflow-hidden font-sans relative text-sm">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFA494]/5 blur-[120px] rounded-full -z-10" />

      {/* --- TOAST --- */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-right-full fade-in duration-500 ease-out">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl flex items-start gap-4 min-w-[340px] relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 h-[2px] bg-green-500/50 animate-[progress_5s_linear_forwards]" />
            <div className="bg-green-500/20 p-2 rounded-full shrink-0 group-hover:scale-110 transition-transform"><CheckCircle2 className="w-5 h-5 text-green-400" /></div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white tracking-tight">Login Successful</h4>
              <p className="text-[11px] text-white/40 mt-1">ยืนยันตัวตนสำเร็จ ข้อมูล AI พร้อมใช้งาน</p>
            </div>
            <button onClick={() => setShowToast(false)} className="text-white/20 hover:text-white p-1"><CloseIcon className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className="w-20 md:w-64 bg-[#0d0d0d] border-r border-white/5 flex flex-col p-6 z-20 h-screen shrink-0 sticky top-0">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-[#FFA494] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,164,148,0.2)] animate-pulse">
            <Scan className="text-black w-6 h-6" />
          </div>
          <span className="font-black text-xl hidden md:block tracking-tighter italic uppercase underline decoration-[#FFA494]/30">Facelock<span className="text-[#FFA494]">.</span>AI</span>
        </div>
        <nav className="flex-1 space-y-2 text-xs">
          <div className="p-4 bg-white/5 text-[#FFA494] rounded-2xl flex items-center gap-4 font-bold border border-[#FFA494]/10 shadow-lg cursor-pointer transition-all"><Activity className="w-5 h-5" /><span className="hidden md:block">Control Center</span></div>
          <div className="p-4 text-white/20 hover:text-white rounded-2xl flex items-center gap-4 font-bold transition-all group cursor-pointer"><Database className="w-5 h-5 group-hover:text-[#FFA494]" /><span className="hidden md:block">Vector Sets</span></div>
        </nav>
        <button onClick={handleLogout} className="p-4 text-white/40 hover:text-red-400 flex items-center gap-4 font-bold transition-all mt-auto group shrink-0 text-xs">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /><span className="hidden md:block">Logout System</span>
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 h-screen overflow-y-auto p-8 md:p-12 relative z-10 scroll-smooth">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">AI Biometric Engine Active</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight italic uppercase">Control Center<span className="text-[#FFA494]">.</span></h1>
          </div>
          <p className="text-[10px] font-mono text-white/10 uppercase tracking-widest hidden md:block">Neural Sync Status: Optimal</p>
        </header>

        {/* --- SECTION 1: SQUARE CARDS (แก้ไขให้ใหญ่และแน่น) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <StatCard icon={<Zap />} label="Model Accuracy" value="99.2" trend="Neural Sync" hoverBg="hover:bg-[#FFA494]" colorClass="text-[#FFA494]" />
          <StatCard icon={<Users />} label="Registered IDs" value={usersList.length} trend="Database" hoverBg="hover:bg-blue-500" colorClass="text-blue-400" />
          <StatCard icon={<Fingerprint />} label="Face Vectors" value={faceCount} trend="Active Embed" hoverBg="hover:bg-green-500" colorClass="text-green-400" />
          <StatCard icon={<ShieldAlert />} label="Security Node" value="0" trend="Safe Area" hoverBg="hover:bg-purple-600" colorClass="text-purple-400" />
        </div>

        {/* SECTION 2: GRAPH & LOGS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-[#111111] rounded-[3.5rem] border border-white/5 p-10 relative overflow-hidden group hover:border-[#FFA494]/30 transition-all duration-700 shadow-2xl">
            <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3 mb-12 text-white/80">
              <TrendingUp className="w-5 h-5 text-[#FFA494]" /> Neural Load Analysis
            </h3>
            <div className="h-56 flex items-end gap-2 px-2">
              {neuralData.map((h, i) => (
                <div key={i} className="flex-1 bg-white/5 rounded-full relative overflow-hidden h-full">
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#FFA494] to-pink-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(255,164,148,0.2)]" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-between items-center text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">
              <span>Vector Input</span>
              <span className="text-[#FFA494]/30 animate-pulse italic">Neural Link Active...</span>
              <span>Identity Match</span>
            </div>
          </div>

          <div className="bg-[#111111] rounded-[3.5rem] border border-white/5 p-8 shadow-2xl relative flex flex-col hover:border-white/20 transition-all duration-700 overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-[0.05] rotate-12 transition-transform group-hover:scale-110"><ShieldCheck size={180} /></div>
            <h3 className="font-bold text-lg uppercase italic tracking-tighter flex items-center gap-3 mb-8 text-[#FFA494] relative z-10">
              <ShieldAlert className="w-5 h-5" /> Live Log Feed
            </h3>
            <div className="space-y-8 relative flex-1 z-10">
              <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-white/5" />
              <div className="flex gap-6 items-start relative z-10 group cursor-default">
                <div className="w-8 h-8 rounded-full bg-[#FFA494] text-black flex items-center justify-center border-2 border-[#FFA494] shadow-[0_0_12px_rgba(255,164,148,0.4)] animate-pulse"><ShieldCheck className="w-4 h-4" /></div>
                <div>
                   <h4 className="text-[11px] font-black uppercase group-hover:text-[#FFA494] transition-colors">{usersList[0]?.full_name || 'System Unit'}</h4>
                   <p className="text-[10px] text-white/30 tracking-tight leading-tight">Verified Successfully</p>
                   <span className="text-[9px] font-mono text-white/10 italic">Just Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: USER REGISTRY */}
        <div className="bg-[#111111] rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl mb-12">
          <div className="p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <h3 className="font-bold text-2xl uppercase italic tracking-tighter flex items-center gap-3 text-white/90">
              <Fingerprint className="w-6 h-6 text-[#FFA494]" /> User Registry
            </h3>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input type="text" placeholder="Search Identities..." className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-xs outline-none focus:border-[#FFA494]/30 transition-all placeholder:text-white/10" />
            </div>
          </div>
          <div className="p-8 space-y-4">
            {usersList.map((user) => (
              <div key={user.id} className="group flex flex-col md:flex-row items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] transition-all duration-500 hover:bg-white/[0.04] hover:border-white/10">
                <div className="flex items-center gap-6 w-full md:w-1/3">
                  <div className="w-16 h-16 bg-black/40 rounded-[1.5rem] flex items-center justify-center border border-white/5 group-hover:border-[#FFA494]/50 transition-all duration-500">
                    <UserIcon className="w-8 h-8 text-[#FFA494]/40 group-hover:text-[#FFA494]" />
                  </div>
                  <div>
                    <h4 className="font-black text-xl group-hover:text-[#FFA494] transition-colors">{user.full_name}</h4>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] font-mono mt-1 italic">UID: {user.id.substring(0,18)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-green-500/5 rounded-full border border-green-500/10 transition-all group-hover:bg-green-500/10">
                    <Circle className="w-1.5 h-1.5 fill-green-500 text-green-500 shadow-[0_0_5px_#22c55e]" />
                    <span className="text-[9px] font-black text-green-500 uppercase">Linked Identity</span>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-[10px] font-black text-white/10 uppercase tracking-widest mb-1">Enrollment</p>
                  <p className="text-sm font-bold text-white/60">{new Date(user.created_at).toLocaleDateString('en-GB')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes progress { from { width: 100%; } to { width: 0%; } }
      `}</style>
    </div>
  );
}

// --- UPGRADED SQUARE CARD COMPONENT (แน่นและตัวเลขยักษ์) ---
function StatCard({ icon, label, value, trend, hoverBg, colorClass }: any) {
  return (
    <div className={`
      aspect-square bg-[#111111] p-10 rounded-[3.5rem] border border-white/5 
      relative overflow-hidden transition-all duration-700 cursor-default
      hover:scale-[1.03] ${hoverBg} group shadow-2xl flex flex-col justify-between
    `}>
      {/* Background Watermark - ถมพื้นที่ให้ดูแน่น */}
      <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-[0.12] transition-all duration-700 rotate-12 group-hover:rotate-0">
        {React.cloneElement(icon, { size: 180 })}
      </div>
      
      <div className="relative z-10 flex justify-between items-start">
        <div className={`w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center transition-all duration-500 group-hover:bg-black group-hover:shadow-[0_0_25px_rgba(0,0,0,0.6)]`}>
          {React.cloneElement(icon, { className: `w-8 h-8 ${colorClass} transition-all duration-500 group-hover:text-white group-hover:scale-110` })}
        </div>
        <div className="text-right">
           <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/10 group-hover:text-black/30">Verified</div>
           <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/10 group-hover:text-black/30">Neural</div>
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 mb-2 transition-colors duration-500 group-hover:text-black/50">
          {label}
        </p>
        {/* ขนาดตัวเลขยักษ์ถมพื้นที่ */}
        <h3 className="text-7xl font-black italic tracking-tighter transition-all duration-500 group-hover:text-black leading-none group-hover:scale-[1.05] origin-left">
          {value}
        </h3>
      </div>

      <div className="relative z-10 flex justify-between items-center border-t border-white/5 pt-8 group-hover:border-black/10">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase text-[#FFA494] group-hover:text-black">
            {trend}
          </span>
          <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
             <div className={`h-full w-2/3 ${colorClass.replace('text', 'bg')} animate-pulse`} />
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-white/5 group-hover:text-black/20" />
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}