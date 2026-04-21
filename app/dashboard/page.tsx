'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { calculateAIHealth, getSystemStatus } from '../lib/analytics';
import { motion } from 'framer-motion'; 
import { 
  LogOut, ShieldCheck, User as UserIcon, Fingerprint, 
  Loader2, Activity, Users, Database, 
  Scan, ShieldAlert, Zap, Clock, AlertCircle
} from 'lucide-react';

export default function AIControlCenter() {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [faceCount, setFaceCount] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({ health: "0", rate: 0, pending: 0 });

  useEffect(() => {
    async function fetchRealData() {
      try {
        setLoading(true);

        // 🛡️ 1. ดึงข้อมูล User พร้อม "จอย" กับตาราง user_faces เพื่อเช็คสถานะรายคน
        const { data: users, error: userError } = await supabase
          .from('users')
          .select(`
            id,
            full_name,
            created_at,
            user_faces (id) 
          `)
          .order('created_at', { ascending: false });

        // 2. ดึงจำนวน Face Embedding ทั้งหมดมาทำสถิติรวม
        const { count, error: faceError } = await supabase
          .from('user_faces')
          .select('*', { count: 'exact', head: true });

        if (userError || faceError) throw userError || faceError;

        const uCount = users?.length || 0;
        const fCount = count || 0;
        
        // 📊 3. คำนวณ Analytics สำหรับวงแหวนวิเคราะห์
        const health = uCount > 0 ? (fCount / uCount) * 100 : 0;

        setUsersList(users || []);
        setFaceCount(fCount);
        setAnalytics({
          health: Math.min(99.9, health).toFixed(1),
          rate: health,
          pending: Math.max(0, uCount - fCount)
        });

      } catch (err: any) {
        setError(err.message);
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
      <p className="text-[#FFA494] font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">Analyzing Neural Data...</p>
    </div>
  );

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex overflow-hidden font-sans relative text-sm">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFA494]/5 blur-[150px] rounded-full -z-10 animate-pulse" />

      {/* --- SIDEBAR --- */}
      <aside className="w-20 md:w-64 bg-[#0d0d0d] border-r border-white/5 flex flex-col p-6 z-20 h-screen sticky top-0 shrink-0">
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
          <span className="hidden md:block">Disconnect</span>
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 h-screen overflow-y-auto p-8 md:p-12 relative z-10 scroll-smooth">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2 text-green-500">
               <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Sync: {getSystemStatus(loading, error)}</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight italic uppercase">Command Center<span className="text-[#FFA494]">.</span></h1>
          </div>
        </header>

        {/* --- STAT CARDS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Zap />} label="AI Confidence" value={`${analytics.health}%`} trend="Model Precision" colorClass="text-[#FFA494]" />
          <StatCard icon={<Users />} label="Identities" value={usersList.length} trend="Total Registry" colorClass="text-blue-400" />
          <StatCard icon={<Fingerprint />} label="Face Vectors" value={faceCount} trend="Enrolled Data" colorClass="text-green-400" />
          <StatCard icon={<ShieldAlert />} label="Pending" value={analytics.pending} trend="Require Action" colorClass="text-purple-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* 🔘 วงแหวนวิเคราะห์ความสมบูรณ์ข้อมูล (กลับมาแล้ว!) */}
          <div className="lg:col-span-2 bg-[#111111] rounded-[3rem] border border-white/5 p-10 relative overflow-hidden shadow-2xl">
            <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3 mb-10 text-white/80">
              <ShieldCheck className="w-5 h-5 text-[#FFA494]" /> Biometric Data Integrity
            </h3>
            
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="relative w-44 h-44 shrink-0">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="7" className="text-white/5" />
                  <motion.circle 
                    cx="50" cy="50" r="45" fill="none" stroke="#FFA494" strokeWidth="7"
                    strokeDasharray="283"
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * analytics.rate) / 100 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    strokeLinecap="round"
                    className="shadow-[0_0_20px_#FFA494]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black italic">{analytics.rate.toFixed(0)}%</span>
                  <span className="text-[8px] uppercase font-bold text-white/20 tracking-widest">Success Rate</span>
                </div>
              </div>

              <div className="flex-1 space-y-6 w-full">
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <div className="flex justify-between items-center mb-4 text-[10px] font-black uppercase">
                    <span className="text-white/40">Enrollment Completion</span>
                    <span className="text-[#FFA494]">{faceCount}/{usersList.length} Units</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${analytics.rate}%` }} className="h-full bg-[#FFA494]" />
                  </div>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
                  <AlertCircle className="w-5 h-5 text-[#FFA494]" />
                  <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-tight">
                    {analytics.pending > 0 ? `แจ้งเตือน: ตรวจพบ ${analytics.pending} รายการที่ข้อมูลใบหน้ายังไม่สมบูรณ์` : "ข้อมูลไบโอเมตริกซ์สมบูรณ์ครบ 100%"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Registry Logs */}
          <div className="bg-[#111111] rounded-[3rem] border border-white/5 p-8 shadow-2xl overflow-hidden flex flex-col">
            <h3 className="font-bold text-lg uppercase italic tracking-tighter flex items-center gap-3 mb-8 text-[#FFA494]">
              <Clock className="w-5 h-5" /> Recent Activity
            </h3>
            <div className="space-y-6 flex-1">
              {usersList.slice(0, 4).map((u, i) => (
                <div key={i} className="flex gap-4 items-center group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#FFA494]/10 transition-all">
                    <ShieldCheck size={16} className="text-white/10 group-hover:text-[#FFA494]" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-[11px] font-black uppercase text-white/90 truncate">{u.full_name}</h4>
                    <p className="text-[9px] text-white/20 uppercase tracking-widest">{new Date(u.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- USER REGISTRY (สถานะ Not Sync / Enrolled ถูกต้อง) --- */}
        <div className="bg-[#111111] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl mb-12">
          <div className="p-10 border-b border-white/5 bg-white/[0.01]">
            <h3 className="font-bold text-2xl uppercase italic tracking-tighter text-white/90 flex items-center gap-3">
              <Database className="w-6 h-6 text-[#FFA494]" /> Neural Identity Registry
            </h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {usersList.map((user) => {
              const isEnrolled = user.user_faces && user.user_faces.length > 0;

              return (
                <div key={user.id} className="group flex items-center justify-between p-6 bg-white/[0.01] border border-white/[0.03] rounded-[2.2rem] hover:bg-white/[0.03] hover:border-[#FFA494]/30 transition-all duration-500">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isEnrolled ? 'bg-[#FFA494]/10 border-[#FFA494]/20 shadow-[0_0_15px_rgba(255,164,148,0.1)]' : 'bg-black border-white/5'}`}>
                      <UserIcon className={`w-7 h-7 transition-all ${isEnrolled ? 'text-[#FFA494]' : 'text-white/10'}`} />
                    </div>
                    <div>
                      <h4 className={`font-black text-xl transition-colors ${isEnrolled ? 'text-white' : 'text-white/30'}`}>
                        {user.full_name}
                      </h4>
                      <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] mt-1">
                        UUID: {user.id.substring(0,18)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${isEnrolled ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isEnrolled ? 'text-green-500' : 'text-red-500'}`}>
                        {isEnrolled ? 'Enrolled' : 'Not Sync'}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-white/30">{new Date(user.created_at).toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

// Reusable Stat Card
function StatCard({ icon, label, value, trend, colorClass }: any) {
  return (
    <div className="aspect-square bg-[#111111] p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden transition-all duration-500 group flex flex-col justify-between shadow-2xl">
      <div className="absolute -top-6 -right-6 opacity-[0.02] group-hover:opacity-[0.08] transition-all rotate-12 group-hover:rotate-0">
        {React.cloneElement(icon, { size: 180 })}
      </div>
      <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
        {React.cloneElement(icon, { className: `w-7 h-7 ${colorClass}` })}
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">{label}</p>
        <h3 className="text-7xl font-black italic tracking-tighter leading-none group-hover:text-[#FFA494] transition-all">{value}</h3>
      </div>
      <div className="relative z-10 border-t border-white/5 pt-8">
        <span className="text-[10px] font-black uppercase text-white/10 tracking-widest">{trend}</span>
      </div>
    </div>
  );
}