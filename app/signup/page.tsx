'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Lock, ArrowRight, Contact } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // แก้ไขในไฟล์ app/components/signup/page.tsx
const handleNextStep = (e: React.FormEvent) => {
  e.preventDefault();

  if (!firstName || !lastName || !username || !password) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  const userData = {
    firstName,
    lastName,
    username,
    password
  };

  // เก็บข้อมูลชั่วคราว
  sessionStorage.setItem("temp_user_data", JSON.stringify(userData));

  // ไปหน้ากล้อง
  router.push("/signup/camera");
};

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/10 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/10 blur-[150px] rounded-full -z-10" />

      <div className="max-w-4xl w-full bg-[#161616] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col md:row">
        <div className="p-8 md:p-14 space-y-6 w-full">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">Step 1: Info<span className="text-[#FFA494]">.</span></h2>
            <p className="text-white/40 font-medium text-sm">กรอกข้อมูลพื้นฐานเพื่อสร้างบัญชี</p>
          </div>

          <form onSubmit={handleNextStep} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">First Name</label>
                <div className="relative">
                  <Contact className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="ชื่อจริง" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-[#FFA494]/50 transition-all text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Last Name</label>
                <div className="relative">
                  <input required value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder="นามสกุล" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#FFA494]/50 transition-all text-sm" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input required value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="ตั้งชื่อผู้ใช้งาน" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-[#FFA494]/50 transition-all text-sm" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="รหัสผ่าน" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-[#FFA494]/50 transition-all text-sm" />
              </div>
            </div>

            <button type="submit" className="w-full mt-4 py-4 bg-[#FFA494] text-black font-black rounded-full text-md shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2">
              Continue to Camera <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}