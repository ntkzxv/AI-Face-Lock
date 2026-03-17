'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ScanFace, ShieldCheck, Loader2, Camera, X, Lock, User } from 'lucide-react';

export default function FaceIDSignIn() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  
  // --- [TEST ONLY] State สำหรับเปิด/ปิด Popup Test Login ---
  const [showTestLogin, setShowTestLogin] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 2000);
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

        {/* ส่วนแสดงหน้ากล้อง */}
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

              {/* --- [TEST ONLY SECTION] ส่วนนี้ใช้สำหรับเทส ลบทิ้งได้เมื่อระบบสแกนเสร็จ --- */}
              <button 
                onClick={() => setShowTestLogin(true)}
                className="text-[10px] text-white/20 hover:text-[#FFA494] font-bold uppercase tracking-[0.2em] transition-colors"
              >
                ( Dev Mode: ใช้รหัสผ่านสำหรับเทส )
              </button>
              {/* --- END TEST ONLY SECTION --- */}
            </>
          ) : (
            <Link href="/dashboard" className="w-full py-5 bg-green-500 text-white font-black rounded-full text-lg block animate-pulse">
              เข้าสู่ระบบสำเร็จ
            </Link>
          )}
        </div>
      </div>

      {/* --- [POPUP TEST LOGIN] ส่วนนี้คือ Popup ที่ต้องลบทิ้งในภายหลัง --- */}
      {showTestLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1c1c1c] w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative">
            <button onClick={() => setShowTestLogin(false)} className="absolute top-6 right-6 text-white/40 hover:text-white"><X /></button>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white tracking-tight">Test Login</h3>
              <p className="text-white/40 text-xs mt-1">ใช้สำหรับตรวจสอบระบบช่วงพัฒนาเท่านั้น</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input type="text" placeholder="Username" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#FFA494]/50" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input type="password" placeholder="Password" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#FFA494]/50" />
              </div>
              <button className="w-full py-4 bg-white/5 text-white hover:bg-[#FFA494] hover:text-black rounded-2xl font-bold transition-all">
                Login (Bypass)
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- END POPUP TEST LOGIN --- */}

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