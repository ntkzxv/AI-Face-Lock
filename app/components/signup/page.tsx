'use client';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Lock, Camera } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/10 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/10 blur-[150px] rounded-full -z-10" />

      <div className="max-w-5xl w-full bg-[#161616] rounded-[3rem] border border-white/5 overflow-hidden flex flex-col md:flex-row shadow-2xl">
        
        {/* ฝั่งซ้าย: Form Registration */}
        <div className="flex-[1.2] p-8 md:p-16 space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tighter">Create Account</h2>
            <p className="text-white/40 font-medium">เริ่มต้นใช้งานระบบ ARWIP ของคุณ</p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">First Name</label>
                <input type="text" placeholder="John" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#FFA494]/50 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Last Name</label>
                <input type="text" placeholder="Doe" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#FFA494]/50 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Username</label>
              <input type="text" placeholder="johndoe_ai" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#FFA494]/50 transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Password</label>
              <input type="password" placeholder="••••••••" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#FFA494]/50 transition-all" />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <button className="w-full py-5 bg-[#FFA494] text-black font-black rounded-full text-lg shadow-xl shadow-orange-950/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              Create Account
            </button>
            <p className="text-center text-sm text-white/30">
              Already have an account? <Link href="/components/signin" className="text-[#FFA494] font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>

        {/* ฝั่งขวา: Visual Section (AI Bio-Authentication) */}
        <div className="hidden md:flex flex-1 bg-black/40 p-16 flex-col justify-between relative border-l border-white/5">
          <div className="space-y-6 relative z-10">
            <h3 className="text-4xl font-black text-white leading-tight tracking-tighter">
              Verify your <br /> <span className="text-[#FFA494]">Identity</span> with AI.
            </h3>
            <p className="text-white/40 font-medium leading-relaxed">
              ลงทะเบียนด้วยใบหน้าเพื่อการเข้าถึงที่รวดเร็วและปลอดภัยที่สุด ด้วยเทคโนโลยี AI Biometric ล่าสุด
            </p>
          </div>

          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
              <Camera className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* ตกแต่งลายเส้นใยแมงมุมเท่ๆ แบบในรูป */}
          <div className="absolute bottom-[-10%] right-[-10%] w-full h-full opacity-20 pointer-events-none">
            <div className="w-full h-full border-[1px] border-white/20 rounded-full scale-[1.5]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}