'use client';
import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Webcam from 'react-webcam'; // นำเข้า Library กล้อง
import { supabase } from '../../lib/supabase';
import { ArrowLeft, ScanFace, ShieldCheck, Loader2, Camera, X, Lock, User } from 'lucide-react';

export default function FaceIDSignIn() {
  const webcamRef = useRef<Webcam>(null); // สร้าง Ref สำหรับควบคุมกล้อง
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [showTestLogin, setShowTestLogin] = useState(false);
  
  const [testUsername, setTestUsername] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันเริ่มสแกน (จำลองการถ่ายรูปและเช็ค AI)
  const startScan = useCallback(() => {
    setIsScanning(true);
    
    // ตรงนี้คือจุดที่เราจะสั่งถ่ายรูป (Capture)
    const imageSrc = webcamRef.current?.getScreenshot();
    console.log("Captured Image:", imageSrc);

    // จำลองการส่งไปเช็คกับ AI 2 วินาที
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      // window.location.href = '/index'; // ถ้าจะให้ผ่านเลย
    }, 2000);
  }, [webcamRef]);

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

        {/* --- ส่วนแสดงหน้ากล้องจริง --- */}
        <div className="relative aspect-square w-full max-w-[280px] mx-auto mb-10 overflow-hidden rounded-[3rem] border-2 border-white/5 bg-black">
          
          {/* กรอบสแกนล้ำๆ */}
          <div className={`absolute inset-0 transition-all duration-500 z-20 pointer-events-none
            ${isScanning ? 'border-4 border-[#FFA494] shadow-[inset_0_0_50px_rgba(255,164,148,0.2)]' : 'border-2 border-white/10'}`} 
          />
          
          {/* กล้อง Webcam */}
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

          {/* แสงเลเซอร์สแกน */}
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
              <button onClick={() => setShowTestLogin(true)} className="text-[10px] text-white/20 hover:text-[#FFA494] font-bold uppercase tracking-[0.2em]">
                ( Use Dev Password )
              </button>
            </>
          ) : (
            <button onClick={() => window.location.href='/index'} className="w-full py-5 bg-green-500 text-white font-black rounded-full text-lg block animate-pulse">
              CONTINUE TO DASHBOARD
            </button>
          )}
        </div>
      </div>

      {/* ... [Popup Test Login เดิมของคุณ] ... */}

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