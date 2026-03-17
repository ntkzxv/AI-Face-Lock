'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, ShieldCheck, Package, LayoutDashboard, Bell, Loader2 } from 'lucide-react';

export default function DashboardIndex() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      // ตรวจสอบ Session จาก Supabase
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current Session:", session); // เช็คใน Inspect > Console ของ Browser
      setUser(session?.user ?? null);
      setLoading(false);
    }
    getSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/components/signin';
  };

  // ถ้ายังโหลดอยู่ให้โชว์หน้า Loading แทนการดีดกลับ
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#FFA494] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-24 md:w-64 bg-[#161616] border-r border-white/5 flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-[#FFA494] rounded-xl flex items-center justify-center shadow-lg shadow-orange-950/40">
            <ShieldCheck className="text-black w-6 h-6" />
          </div>
          <span className="font-black text-xl hidden md:block tracking-tighter italic">ARWIP.</span>
        </div>
        
        <nav className="flex-1 space-y-4">
          <div className="p-4 bg-[#FFA494] text-black rounded-2xl flex items-center gap-4 font-bold shadow-lg">
            <LayoutDashboard className="w-6 h-6" />
            <span className="hidden md:block">Overview</span>
          </div>
          <div className="p-4 text-white/40 hover:text-white rounded-2xl flex items-center gap-4 font-bold transition-all">
            <Package className="w-6 h-6" />
            <span className="hidden md:block">Inventory</span>
          </div>
        </nav>

        <button onClick={handleLogout} className="p-4 text-white/40 hover:text-red-400 flex items-center gap-4 font-bold transition-all">
          <LogOut className="w-6 h-6" />
          <span className="hidden md:block">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFA494]/5 blur-[120px] rounded-full -z-10" />
        
        <header className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-4xl font-black tracking-tight italic uppercase">
              Dashboard<span className="text-[#FFA494]">.</span>
            </h1>
            <p className="text-white/40 font-medium">
              {user ? `Welcome, ${user.email}` : 'Mode: Bypass (Dev Test)'}
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 relative">
            <Bell className="w-6 h-6 text-white/60" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#161616] p-10 rounded-[3rem] border border-white/5 flex flex-col items-center text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
              <ShieldCheck className="w-10 h-10 text-[#FFA494]" />
            </div>
            <h2 className="text-2xl font-bold">Security Active</h2>
            <p className="text-white/30 text-sm leading-relaxed">
              ระบบฐานข้อมูล Supabase เชื่อมต่อสำเร็จ คุณสามารถตรวจสอบข้อมูลในตาราง users ได้แบบ Real-time
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#FFA494] to-pink-500 p-10 rounded-[3rem] flex flex-col justify-between text-black shadow-2xl">
            <h2 className="text-3xl font-black tracking-tighter italic">WAREHOUSE<br/>SYSTEM.</h2>
            <p className="font-bold opacity-60 italic">Ready for Face Scan Integration</p>
          </div>
        </div>
      </main>
    </div>
  );
}