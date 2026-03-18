// app/page.tsx
import Link from 'next/link';
import { ScanFace, LogIn, UserPlus, ShieldCheck, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Gradient แบบจัดจ้านตามรูป */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-pink-500/30 to-orange-500/30 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/20 to-blue-500/20 blur-[120px] rounded-full" />

      {/* Main Glass Card */}
      <div className="max-w-4xl w-full bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-4 md:p-12 flex flex-col md:flex-row gap-12 items-center shadow-2xl">
        
        {/* ฝั่งซ้าย: Content */}
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl shadow-lg">
            <ScanFace className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-4">
            <h1 className="text-6xl font-black text-white tracking-tighter leading-none">
              Face <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-pink-500">Lock System.</span>
            </h1>
            <p className="text-white/50 text-lg max-w-sm font-medium">
              ระบบจัดการคลังสินค้าอัจฉริยะที่ใช้ AI ยืนยันตัวตนผ่านใบหน้า เพื่อความปลอดภัยสูงสุด
            </p>
          </div>
        </div>

        {/* ฝั่งขวา: Action Buttons (เลียนแบบทรงปุ่มในรูป) */}
        <div className="w-full md:w-80 space-y-4">
          <Link href="/signin" className="group flex items-center justify-center gap-3 w-full py-5 bg-[#FFA494] text-[#111] rounded-full font-bold text-xl hover:bg-white transition-all shadow-xl active:scale-95">
            <LogIn className="w-6 h-6" /> เข้าสู่ระบบ
          </Link>

          <Link href="/signup" className="group flex items-center justify-center gap-3 w-full py-5 bg-white/5 text-white border border-white/10 rounded-full font-bold text-xl hover:bg-white/10 transition-all active:scale-95">
            <UserPlus className="w-6 h-6" /> สมัครสมาชิก
          </Link>
          
          <div className="pt-6 flex items-center justify-center md:justify-start gap-3 text-white/40">
             <ShieldCheck className="w-5 h-5" />
             <span className="text-xs font-bold uppercase tracking-widest">AI Face Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}