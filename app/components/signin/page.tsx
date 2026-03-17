'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // นำเข้า useRouter
import { supabase } from '../../lib/supabase'; // นำเข้า supabase client
import { ArrowLeft, ScanFace, ShieldCheck, Loader2, Camera, X, Lock, User } from 'lucide-react';

export default function FaceIDSignIn() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [showTestLogin, setShowTestLogin] = useState(false);
  
  // --- [TEST ONLY] States สำหรับเก็บค่าเทส Login ---
  const [testUsername, setTestUsername] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 2000);
  };

  // --- [TEST ONLY] ฟังก์ชัน Login ผ่าน Password (ตาราง users) ---
  const handleBypassLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('full_name', testUsername)
        .eq('password', testPassword) // เช็คตรงๆ ตามตารางที่คุณออกแบบ
        .single();

      if (error || !data) {
        alert('ไม่พบผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      } else {
        alert('ยินดีต้อนรับคุณ ' + data.full_name);
        router.push('/index'); // ไปหน้า Dashboard (ถ้ามี)
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FFA494]/10 blur-[120px] rounded-full" />
      
      <div className="max-w-[450px] w-full bg-[#161616] p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative z-10 text-center">
        <div className="mb-10 space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-[#FFA494] transition-colors text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            <ArrowLeft className="w-3 h-3" /> Back to home
          </Link>
          <h2 className="text-4xl font-black text-white tracking-tighter">AI Face Login</h2>
          <p className="text-white/40 font-medium tracking-tight">ระบบสแกนใบหน้าเพื่อเข้าใช้งาน</p>
        </div>

        <div className="relative aspect-square w-full max-w-[260px] mx-auto mb-10 group">
          <div className={`absolute inset-0 border-2 rounded-[3rem] transition-all duration-500 z-20 
            ${isScanning ? 'border-[#FFA494] shadow-[0_0_30px_rgba(255,164,148,0.3)]' : 'border-white/10'}`} 
          />
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#FFA494] rounded-tl-[2rem] z-30" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#FFA494] rounded-tr-[2rem] z-30" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#FFA494] rounded-bl-[2rem] z-30" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#FFA494] rounded-br-[2rem] z-30" />

          {isScanning && (
            <div className="absolute left-0 right-0 h-1 bg-[#FFA494] shadow-[0_0_15px_#FFA494] z-30 animate-[scan_2s_infinite]" />
          )}

          <div className="w-full h-full bg-black/60 rounded-[3rem] flex items-center justify-center overflow-hidden">
            {scanComplete ? (
              <div className="text-center animate-bounce">
                <ShieldCheck className="w-16 h-16 text-green-400 mx-auto" />
              </div>
            ) : <ScanFace className="w-24 h-24 text-white/5" />}
          </div>
        </div>

        <div className="space-y-6">
          {!scanComplete ? (
            <>
              <button 
                onClick={startScan}
                disabled={isScanning}
                className="w-full py-5 bg-[#FFA494] text-black rounded-full font-black text-lg shadow-xl shadow-orange-950/20 active:scale-95 disabled:opacity-50 transition-all"
              >
                {isScanning ? 'กำลังสแกน...' : 'เริ่มการสแกนใบหน้า'}
              </button>

              <button 
                onClick={() => setShowTestLogin(true)}
                className="text-[10px] text-white/20 hover:text-[#FFA494] font-bold uppercase tracking-[0.2em] transition-colors"
              >
                ( Dev Mode: ใช้รหัสผ่านสำหรับเทส )
              </button>
            </>
          ) : (
            <Link href="/dashboard" className="w-full py-5 bg-green-500 text-white font-black rounded-full text-lg block animate-pulse">
              เข้าสู่ระบบสำเร็จ
            </Link>
          )}
        </div>
      </div>

      {showTestLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1c1c1c] w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative">
            <button onClick={() => setShowTestLogin(false)} className="absolute top-6 right-6 text-white/40 hover:text-white"><X /></button>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white tracking-tight">Test Login</h3>
              <p className="text-white/40 text-xs mt-1">ตรวจสอบ `users` table</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="text" 
                  value={testUsername}
                  onChange={(e) => setTestUsername(e.target.value)}
                  placeholder="Full Name (Username)" 
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#FFA494]/50" 
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="password" 
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  placeholder="Password" 
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#FFA494]/50" 
                />
              </div>
              <button 
                onClick={handleBypassLogin}
                disabled={loading}
                className="w-full py-4 bg-white/5 text-white hover:bg-[#FFA494] hover:text-black rounded-2xl font-bold transition-all disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Login (Bypass)'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}