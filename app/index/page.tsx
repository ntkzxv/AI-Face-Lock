'use client';
import React from 'react';
import { LogOut, ShieldCheck, Package, LayoutDashboard, Bell } from 'lucide-react';

export default function DashboardIndex() {
  const handleLogout = () => {
    alert('Logging out...');
    window.location.href = '/components/signin';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-24 md:w-64 bg-[#161616] border-r border-white/5 flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-[#FFA494] rounded-xl flex items-center justify-center shadow-lg shadow-orange-950/40"><ShieldCheck className="text-black w-6 h-6" /></div>
          <span className="font-black text-xl hidden md:block tracking-tighter italic">ARWIP.</span>
        </div>
        <nav className="flex-1 space-y-4">
          <div className="p-4 bg-[#FFA494] text-black rounded-2xl flex items-center gap-4 font-bold shadow-lg"><LayoutDashboard className="w-6 h-6" /><span className="hidden md:block">Overview</span></div>
          <div className="p-4 text-white/40 hover:text-white rounded-2xl flex items-center gap-4 font-bold transition-all"><Package className="w-6 h-6" /><span className="hidden md:block">Inventory</span></div>
        </nav>
        <button onClick={handleLogout} className="p-4 text-white/40 hover:text-red-400 flex items-center gap-4 font-bold transition-all"><LogOut className="w-6 h-6" /><span className="hidden md:block">Logout</span></button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFA494]/5 blur-[120px] rounded-full -z-10" />
        
        <header className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-4xl font-black tracking-tight italic">DASHBOARD<span className="text-[#FFA494]">.</span></h1>
            <p className="text-white/40 font-medium">Welcome back, Admin</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 relative hover:bg-white/10 transition-all cursor-pointer">
            <Bell className="w-6 h-6 text-white/60" />
            <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#161616] p-10 rounded-[3rem] border border-white/5 flex flex-col items-center text-center space-y-6 shadow-2xl">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10"><ShieldCheck className="w-12 h-12 text-[#FFA494]" /></div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Security Status</h2>
              <p className="text-white/30 text-sm">Face recognition is active. All system logs are being encrypted and saved to Supabase.</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#FFA494] to-pink-500 p-10 rounded-[3rem] flex flex-col justify-between text-black shadow-2xl shadow-orange-950/20">
            <h2 className="text-3xl font-black leading-none tracking-tighter italic uppercase">Warehouse <br /> Capacity.</h2>
            <div className="space-y-2">
              <div className="h-2 w-full bg-black/20 rounded-full"><div className="h-2 w-[75%] bg-black rounded-full" /></div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">75% Storage Used</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}