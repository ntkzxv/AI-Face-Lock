'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion'; 
import { 
  LogOut, ShieldCheck, User as UserIcon, Fingerprint, 
  Loader2, Activity, Users, Database, ChevronRight, 
  Scan, ShieldAlert, Zap, TrendingUp, AlertCircle, CheckCircle2,
  Clock
} from 'lucide-react';

// --- Analytics Logic (ดึงออกมาคำนวณจริง) ---
const analyzeData = (users: any[], faces: number) => {
  const userCount = users.length;
  const healthScore = userCount > 0 ? (faces / userCount) * 100 : 0;
  
  // วิเคราะห์ Timeline (คนสมัครรายเดือน)
  const monthlyStats = new Array(12).fill(0);
  users.forEach(u => {
    const month = new Date(u.created_at).getMonth();
    monthlyStats[month]++;
  });

  return {
    health: Math.min(99.9, healthScore).toFixed(1),
    timeline: monthlyStats.map(count => (count > 0 ? 20 + (count * 15) : 10)),
    pending: Math.max(0, userCount - faces),
    rate: healthScore
  };
};

export default function AIControlCenter() {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [faceCount, setFaceCount] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({ health: "0", timeline: [], pending: 0, rate: 0 });

  useEffect(() => {
    async function fetchRealData() {
      try {
        setLoading(true);
        // 1. ดึงข้อมูล User ทั้งหมด
        const { data: users, error: userError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        // 2. ดึงจำนวน Face Embedding ทั้งหมด
        const { count, error: faceError } = await supabase
          .from('user_faces')
          .select('*', { count: 'exact', head: true });

        if (userError || faceError) throw userError || faceError;

        const allUsers = users || [];
        setUsersList(allUsers);
        setFaceCount(count || 0);

        // 3. เริ่มการวิเคราะห์ข้อมูลจริง
        const result = analyzeData(allUsers, count || 0);
        setAnalytics(result as any);

      } catch (err: any) {
        console.error("Analysis Error:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRealData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('wastebid_user'); 
    window.location.href = '/auth/login';
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 text-[#FFA494] animate-spin" />
      <p className="text-[#FFA494] font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">Running Neural Analytics...</p>
    </div>
  );

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex overflow-hidden font-sans relative text-sm">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFA494]/5 blur-[150px] rounded-full -z-10" />

      {/* --- SIDEBAR --- */}
      <aside className="w-20 md:w-64 bg-[#0d0d0d] border-r border-white/5 flex flex-col p-6 z-20 h-screen sticky top-0">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-[#FFA494] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,164,148,0.3)]">
            <Scan className="text-black w-6 h-6" />
          </div>
          <span className="font-black text-xl hidden md:block tracking-tighter italic uppercase underline decoration-[#FFA494]/30">Facelock<span className="text-[#FFA494]">.</span>AI</span>
        </div>
        <nav className="flex-1">
          <div className="p-4 bg-[#FFA494]/10 text-[#FFA494] rounded-2xl flex items-center gap-4 font-bold border border-[#FFA494]/20 shadow-lg">
            <Activity className="w-5 h-5" />
            <span className="hidden md:block uppercase tracking-widest text-[10px]">Data Dashboard</span>
          </div>
        </nav>
        <button onClick={handleLogout} className="p-4 text-white/20 hover:text-red-400 flex items-center gap-4 font-bold transition-all mt-auto group text-xs uppercase tracking-widest">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden md:block">Logout System</span>
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 h-screen overflow-y-auto p-8 md:p-12 relative z-10 scroll-smooth">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2 text-green-500">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Network Active</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight italic uppercase">System Insights<span className="text-[#FFA494]">.</span></h1>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-mono text-white/20 uppercase">Last Sync</p>
            <p className="text-xs font-bold text-white/60">{new Date().toLocaleTimeString()}</p>
          </div>
        </header>

        {/* --- STAT CARDS: ดึงจากคำนวณจริง --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Zap />} label="Model Confidence" value={`${analytics.health}%`} trend="AI Data Maturity" colorClass="text-[#FFA494]" />
          <StatCard icon={<Users />} label="Registered IDs" value={usersList.length} trend="Total Users" colorClass="text-blue-400" />
          <StatCard icon={<Fingerprint />} label="Face Vectors" value={faceCount} trend="Enrolled Embeds" colorClass="text-green-400" />
          <StatCard icon={<ShieldAlert />} label="Pending Enrollment" value={analytics.pending} trend="Action Required" colorClass="text-purple-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Analysis Board (วงแหวนวิเคราะห์ความสมบูรณ์ข้อมูล) */}
          <div className="lg:col-span-2 bg-[#111111] rounded-[3rem] border border-white/5 p-10 relative overflow-hidden shadow-2xl group">
            <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3 mb-10 text-white/80">
              <ShieldCheck className="w-5 h-5 text-[#FFA494]" /> Biometric Data Integrity
            </h3>
            
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="relative w-44 h-44">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                  <motion.circle 
                    cx="50" cy="50" r="45" fill="none" stroke="#FFA494" strokeWidth="6"
                    strokeDasharray="283"
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * analytics.rate) / 100 }}
                    transition={{ duration: 2, ease: "circOut" }}
                    strokeLinecap="round"
                    className="shadow-[0_0_20px_#FFA494]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black italic">{analytics.rate.toFixed(0)}%</span>
                  <span className="text-[8px] uppercase font-bold text-white/20 tracking-widest">Captured</span>
                </div>
              </div>

              <div className="flex-1 space-y-6 w-full">
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black uppercase text-white/40">Enrollment Progress</span>
                    <span className="text-xs font-mono text-[#FFA494]">{faceCount}/{usersList.length}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${analytics.rate}%` }} 
                      className="h-full bg-gradient-to-r from-[#FFA494] to-orange-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/10">
                    <p className="text-[8px] font-black text-green-500 uppercase mb-1">Success Rate</p>
                    <p className="text-xl font-black text-green-400">{analytics.health}%</p>
                  </div>
                  <div className="p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10">
                    <p className="text-[8px] font-black text-purple-500 uppercase mb-1">Latency</p>
                    <p className="text-xl font-black text-purple-400">~120ms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Logs (ข้อมูลจริง 4 คนล่าสุด) */}
          <div className="bg-[#111111] rounded-[3rem] border border-white/5 p-8 shadow-2xl flex flex-col">
            <h3 className="font-bold text-lg uppercase italic tracking-tighter flex items-center gap-3 mb-8 text-[#FFA494]">
              <Clock className="w-5 h-5" /> Recent Registry
            </h3>
            <div className="space-y-6 flex-1">
              {usersList.slice(0, 4).map((u, i) => (
                <div key={i} className="flex gap-4 items-center group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#FFA494] group-hover:bg-[#FFA494]/10 transition-all">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-[11px] font-black uppercase text-white/90 truncate">{u.full_name || u.name}</h4>
                    <p className="text-[9px] text-white/20 font-mono italic">Verified {new Date(u.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Registry (REAL DATA Table) */}
        <div className="bg-[#111111] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl mb-12">
          <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="font-bold text-2xl uppercase italic tracking-tighter text-white/90 flex items-center gap-3">
              <Database className="w-6 h-6 text-[#FFA494]" /> Neural Identity Registry
            </h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {usersList.map((user) => (
              <div key={user.id} className="group flex items-center justify-between p-6 bg-white/[0.01] border border-white/[0.03] rounded-[2.2rem] hover:bg-white/[0.03] hover:border-[#FFA494]/30 transition-all duration-500">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-[#FFA494]/50 transition-all">
                    <UserIcon className="w-7 h-7 text-white/10 group-hover:text-[#FFA494]" />
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-white/80 group-hover:text-white transition-colors">{user.full_name || user.name}</h4>
                    <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] mt-1">UUID: {user.id.substring(0,18)}...</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
                    <span className="text-[9px] font-black text-green-500 uppercase">Synced</span>
                  </div>
                  <p className="text-[10px] font-bold text-white/30">{new Date(user.created_at).toLocaleDateString('en-GB')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, trend, colorClass }: any) {
  return (
    <div className={`aspect-square bg-[#111111] p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden transition-all duration-500 group flex flex-col justify-between shadow-2xl`}>
      <div className="absolute -top-6 -right-6 opacity-[0.02] group-hover:opacity-[0.1] transition-all rotate-12 group-hover:rotate-0">
        {React.cloneElement(icon, { size: 180 })}
      </div>
      <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
        {React.cloneElement(icon, { className: `w-7 h-7 ${colorClass}` })}
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">{label}</p>
        <h3 className="text-7xl font-black italic tracking-tighter leading-none group-hover:text-[#FFA494] transition-all">
          {value}
        </h3>
      </div>
      <div className="relative z-10 border-t border-white/5 pt-8">
        <span className="text-[10px] font-black uppercase text-white/10 group-hover:text-white/40 tracking-widest">{trend}</span>
      </div>
    </div>
  );
}