'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase'; // นำเข้า supabase client
import { ArrowLeft, User, Mail, Lock, Camera, Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // รวมชื่อเพื่อเก็บในตาราง users.full_name (เพราะ table คุณตั้งไว้เป็น unique)
      // หรือจะใช้ค่าจากช่อง username มาเก็บที่ full_name ก็ได้ครับตามโครงสร้างตาราง
      const { data, error } = await supabase
        .from('users')
        .insert([
          { 
            full_name: username, // ใช้ username เก็บในช่อง full_name ตาม constraint unique
            password: password 
          }
        ])
        .select();

      if (error) {
        alert('เกิดข้อผิดพลาด: ' + error.message);
      } else {
        alert('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบเพื่อเทส');
        router.push('/components/signin');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/10 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/10 blur-[150px] rounded-full -z-10" />

      <div className="max-w-5xl w-full bg-[#161616] rounded-[3rem] border border-white/5 overflow-hidden flex flex-col md:flex-row shadow-2xl">
        <div className="flex-[1.2] p-8 md:p-16 space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tighter">Create Account</h2>
            <p className="text-white/40 font-medium">เริ่มต้นใช้งานระบบ ARWIP ของคุณ</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">First Name</label>
                <input 
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text" placeholder="John" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#FFA494]/50 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Last Name</label>
                <input 
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text" placeholder="Doe" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#FFA494]/50 transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Username (Full Name in DB)</label>
              <input 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text" placeholder="johndoe_ai" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#FFA494]/50 transition-all" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Password</label>
              <input 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password" placeholder="••••••••" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-[#FFA494]/50 transition-all" 
              />
            </div>

            <div className="space-y-4 pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#FFA494] text-black font-black rounded-full text-lg shadow-xl shadow-orange-950/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
              </button>
              <p className="text-center text-sm text-white/30">
                Already have an account? <Link href="/components/signin" className="text-[#FFA494] font-bold hover:underline">Sign In</Link>
              </p>
            </div>
          </form>
        </div>

        <div className="hidden md:flex flex-1 bg-black/40 p-16 flex-col justify-between relative border-l border-white/5">
          <div className="space-y-6 relative z-10">
            <h3 className="text-4xl font-black text-white leading-tight tracking-tighter">
              Verify your <br /> <span className="text-[#FFA494]">Identity</span> with AI.
            </h3>
            <p className="text-white/40 font-medium leading-relaxed">
              ลงทะเบียนข้อมูลพื้นฐานเพื่อเตรียมสแกนใบหน้าในขั้นตอนถัดไป
            </p>
          </div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Camera className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="absolute bottom-[-10%] right-[-10%] w-full h-full opacity-20 pointer-events-none">
            <div className="w-full h-full border-[1px] border-white/20 rounded-full scale-[1.5]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}