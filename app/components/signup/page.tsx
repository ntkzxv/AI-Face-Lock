'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, User, Lock, Camera, Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ full_name: username, password: password }])
        .select();

      if (error) {
        alert('Error: ' + error.message);
      } else {
        alert('สร้างบัญชีสำเร็จ! กรุณาเข้าสู่ระบบเพื่อทดสอบ');
        window.location.href = '/components/signin';
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/10 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/10 blur-[150px] rounded-full -z-10" />

      <div className="max-w-5xl w-full bg-[#161616] rounded-[3rem] border border-white/5 overflow-hidden flex flex-col md:flex-row shadow-2xl">
        <div className="flex-[1.2] p-8 md:p-16 space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tighter italic">CREATE ACCOUNT<span className="text-[#FFA494]">.</span></h2>
            <p className="text-white/40 font-medium">ลงทะเบียนเพื่อเริ่มต้นใช้งานระบบ ARWIP</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Full Name (Login ID)</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input required value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="ชื่อ-นามสกุล ของคุณ" className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-[#FFA494]/50 transition-all font-medium" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="ตั้งรหัสผ่านของคุณ" className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-[#FFA494]/50 transition-all font-medium" />
              </div>
            </div>

            <button disabled={loading} className="w-full py-5 bg-[#FFA494] text-black font-black rounded-full text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Register Now'}
            </button>
          </form>
          <p className="text-center text-sm text-white/30">Already have an account? <Link href="/components/signin" className="text-[#FFA494] font-bold hover:underline">Sign In</Link></p>
        </div>

        <div className="hidden md:flex flex-1 bg-black/40 p-16 flex-col justify-between relative border-l border-white/5">
          <h3 className="text-4xl font-black text-white leading-tight tracking-tighter">Secure Your <br /> <span className="text-[#FFA494]">Identity</span>.</h3>
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-pink-600 rounded-[2rem] flex items-center justify-center shadow-2xl"><Camera className="w-12 h-12 text-white" /></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-full h-full border-[1px] border-white/10 rounded-full scale-[1.5] opacity-20" />
        </div>
      </div>
    </div>
  );
}