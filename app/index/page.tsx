'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { 
  LogOut, 
  LayoutDashboard, 
  User, 
  Settings, 
  Package, 
  ShieldCheck,
  Bell
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ตรวจสอบว่ามี User ล็อกอินอยู่หรือไม่
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // ถ้าไม่มี User ให้เด้งกลับไปหน้า Signin (หรือใช้ข้อมูลจากตาราง users ของคุณ)
        // router.push('/components/signin'); 
      }
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert('Logged out successfully');
    router.push('/components/signin');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex overflow-hidden">
      
      {/* Side Navigation (Sidebar) */}
      <aside className="w-20 md:w-64 bg-[#161616] border-r border-white/5 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-[#FFA494] rounded-xl flex items-center justify-center">
            <ShieldCheck className="text-black w-6 h-6" />
          </div>
          <span className="font-black text-xl tracking-tighter hidden md:block italic">FACELOCK.</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active />
          <NavItem icon={<Package />} label="Inventory" />
          <NavItem icon={<User />} label="Profiles" />
          <NavItem icon={<Settings />} label="Settings" />
        </nav>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="mt-auto group flex items-center gap-4 p-4 text-white/40 hover:text-[#FFA494] hover:bg-white/5 rounded-2xl transition-all"
        >
          <LogOut className="w-6 h-6" />
          <span className="font-bold hidden md:block">Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFA494]/5 blur-[120px] rounded-full -z-10" />

        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tight">System Overview</h1>
            <p className="text-white/40 text-sm">ยินดีต้อนรับเข้าสู่ระบบจัดการคลังสินค้า ARWIP</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 bg-white/5 rounded-full border border-white/5 hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5 text-white/60" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full border border-white/10 shadow-lg"></div>
          </div>
        </header>

        {/* Stats Grid (ใส่อะไรก็ได้ตัวอย่าง) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Total Users" value="1,284" change="+12%" />
          <StatCard title="Face Verified" value="98.2%" change="+2.4%" />
          <StatCard title="Active Logs" value="452" change="-3%" />
        </div>

        {/* Big Dashboard Card */}
        <div className="w-full h-96 bg-[#161616] rounded-[2.5rem] border border-white/5 p-10 flex flex-col justify-center items-center text-center space-y-4">
           <div className="p-6 bg-white/5 rounded-full animate-pulse">
              <ShieldCheck className="w-20 h-20 text-[#FFA494]" />
           </div>
           <h2 className="text-2xl font-bold">Your system is secured</h2>
           <p className="text-white/30 max-w-sm">AI Biometric monitoring is active. All entry logs are being recorded with 256-bit encryption.</p>
        </div>
      </main>
    </div>
  );
}

// Components ย่อยภายในไฟล์
function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-[#FFA494] text-black shadow-lg shadow-orange-950/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
      {React.cloneElement(icon, { className: "w-6 h-6" })}
      <span className="font-bold hidden md:block">{label}</span>
    </div>
  );
}

function StatCard({ title, value, change }: { title: string, value: string, change: string }) {
  const isPositive = change.startsWith('+');
  return (
    <div className="bg-[#161616] p-8 rounded-[2rem] border border-white/5 space-y-2">
      <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-4xl font-black leading-none">{value}</h3>
        <span className={`text-xs font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
      </div>
    </div>
  );
}