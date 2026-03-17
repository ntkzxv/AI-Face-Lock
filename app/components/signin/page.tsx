'use client';
import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Webcam from 'react-webcam';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, ScanFace, ShieldCheck, Loader2, X, Lock, User } from 'lucide-react';

export default function FaceIDSignIn() {
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [showTestLogin, setShowTestLogin] = useState(false);

  // --- States สำหรับ Dev Login ---
  const [testUsername, setTestUsername] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const startScan = useCallback(() => {
    setIsScanning(true);
    const imageSrc = webcamRef.current?.getScreenshot();
    console.log("Captured Image:", imageSrc);

    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 2000);
  }, [webcamRef]);

  // --- ฟังก์ชัน Login ผ่านตาราง users ---
const handleBypassLogin = async () => {
    if (!testUsername || !testPassword) return; // ไม่ใช้ alert แล้ว
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('full_name', testUsername)
        .eq('password', testPassword)
        .single();

      if (error || !data) {
        setLoading(false);
      } else {
        setTimeout(() => {
          window.location.href = '/dashboard?login=success'; 
        }, 1500); 
      }
    } catch (err) {
      console.error(err);
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
          <h2 className="text-4xl font-black text-white tracking-tighter italic">AI FACE LOGIN<span className="text-[#FFA494]">.</span></h2>
          <p className="text-white/40 font-medium">กรุณาจัดใบหน้าให้อยู่ในกรอบ</p>
        </div>

        <div className="relative aspect-square w-full max-w-[280px] mx-auto mb-10 overflow-hidden rounded-[3rem] border-2 border-white/5 bg-black">
          <div className={`absolute inset-0 transition-all duration-500 z-20 pointer-events-none
            ${isScanning ? 'border-4 border-[#FFA494] shadow-[inset_0_0_50px_rgba(255,164,148,0.2)]' : 'border-2 border-white/10'}`}
          />

          {!scanComplete ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              className="w-full h-full object-cover grayscale-[0.3]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 backdrop-blur-md">
              <ShieldCheck className="w-20 h-20 text-green-400 animate-bounce" />
              <span className="text-green-400 font-black tracking-widest uppercase mt-4">Identity Verified</span>
            </div>
          )}

          {isScanning && (
            <div className="absolute left-0 right-0 h-1 bg-[#FFA494] shadow-[0_0_20px_#FFA494] z-30 animate-[scan_2s_infinite]" />
          )}
        </div>

        <div className="space-y-6">
          {!scanComplete ? (
            <>
              <button
                onClick={startScan}
                disabled={isScanning}
                className="w-full py-5 bg-[#FFA494] text-black rounded-full font-black text-lg shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
              >
                {isScanning ? 'ANALYZING FACE...' : 'START FACE SCAN'}
              </button>
              {/* ปุ่มเปิด Popup Login */}
              <button 
                onClick={() => setShowTestLogin(true)} 
                className="text-[10px] text-white/20 hover:text-[#FFA494] font-bold uppercase tracking-[0.2em]"
              >
                ( dev bypass without face scan )
              </button>
            </>
          ) : (
            <button onClick={() => window.location.href = '/dashboard'} className="w-full py-5 bg-green-500 text-white font-black rounded-full text-lg block animate-pulse">
              CONTINUE TO DASHBOARD
            </button>
          )}
        </div>
      </div>

      {/* --- POPUP MODAL สำหรับ DEV LOGIN (ส่วนที่หายไป) --- */}
      {showTestLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1c1c1c] w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative">
            <button onClick={() => setShowTestLogin(false)} className="absolute top-6 right-6 text-white/40 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white tracking-tight">Dev Test Login</h3>
              <p className="text-white/40 text-xs mt-1">เข้าสู่ระบบด้วยชื่อและรหัสผ่านจากฐานข้อมูล</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="text" 
                  value={testUsername}
                  onChange={(e) => setTestUsername(e.target.value)}
                  placeholder="Full Name (Username)" 
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#FFA494]/50 transition-all" 
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="password" 
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  placeholder="Password" 
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#FFA494]/50 transition-all" 
                />
              </div>
              <button 
                onClick={handleBypassLogin}
                disabled={loading}
                className="w-full py-4 bg-[#FFA494] text-black rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'LOGIN (BYPASS)'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes scan {
          0% { top: 5%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 95%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}