'use client';
import React, { useState, useRef, useCallback } from 'react'; // 1. เพิ่ม useRef, useCallback
import Link from 'next/link';
import Webcam from 'react-webcam'; // 2. Import Webcam library
import { supabase } from '../lib/supabase'; // ตรวจสอบ path ให้ถูกตามโปรเจกต์คุณ
import { ArrowLeft, ScanFace, ShieldCheck, Loader2, X, Lock, User } from 'lucide-react';

export default function FaceIDSignIn() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [showTestLogin, setShowTestLogin] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false); // New state

  const [testUsername, setTestUsername] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 3. สร้าง Ref สำหรับ Webcam
  const webcamRef = useRef<Webcam>(null);

  // 4. ฟังก์ชันเริ่มสแกนของจริง!
  const startScan = async () => {
    if (!webcamRef.current) return;
    
    setScanComplete(false);
    setIsScanning(true);

    try {
      // --- จังหวะที่ 1: ดึงรูปจาก Webcam (Base64) ---
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error("ไม่สามารถจับภาพจากกล้องได้");

      console.log("📸 Captured! Sending to AI...");

      // --- จังหวะที่ 2: ส่งรูปไปให้ Python API (Port 8000) ---
      const aiResponse = await fetch('http://127.0.0.1:8000/extract-vector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: [imageSrc] }) // ส่งไปรูปเดียวพอตอน Login
      });

      if (!aiResponse.ok) {
        const errData = await aiResponse.json();
        throw new Error(errData.error || "AI ประมวลผลหน้าไม่ได้");
      }

      const { vector: queryVector } = await aiResponse.json();
      console.log("✅ AI Vector extracted.");

      // --- จังหวะที่ 3: เรียกใช้ RPC ใน Supabase เพื่อหาคนที่หน้าเหมือนที่สุด ---
      const { data: matchedUsers, error: rpcError } = await supabase.rpc(
        'match_user_faces', 
        {
          query_embedding: queryVector,
          match_threshold: 0.5, // ค่าความเหมือน ถ้าหน้าไม่ตรงลองปรับเป็น 0.45
          match_count: 1
        }
      );

      if (rpcError) throw rpcError;

      // --- จังหวะที่ 4: ตรวจสอบผลลัพธ์ ---
      if (matchedUsers && matchedUsers.length > 0) {
        const user = matchedUsers[0];
        console.log("🎯 Match Found:", user.full_name, "Similarity:", user.similarity);
        
        // สแกนผ่าน!
        setIsScanning(false);
        setScanComplete(true);
        
        // หน่วงเวลาแป๊บนึงให้คนดู Success Icon แล้วค่อยวาร์ป
        setTimeout(() => {
          alert(`ยินดีต้อนรับเข้าสู่ระบบ คุณ${user.full_name}`);
          window.location.href = '/dashboard';
        }, 1500);

      } else {
        // สแกนไม่ผ่าน (ไม่พบหน้าในระบบ)
        setIsScanning(false);
        alert("ค้นหาใบหน้าไม่เจอ โปรดลงทะเบียน");
      }

    } catch (err: any) {
      console.error(err);
      setIsScanning(false);
      alert("Error: " + err.message);
    }
  };

  // 5. Callback เมื่อกล้องพร้อมทำงาน
  const handleUserMedia = useCallback(() => {
    setIsCameraReady(true);
  }, []);

  const handleBypassLogin = async () => {
    if (!testUsername || !testPassword) {
      return alert('กรุณากรอกข้อมูลให้ครบ');
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('full_name', testUsername)
        .eq('password', testPassword)
        .single();

      if (error || !data) {
        alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      } else {
        alert('เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับคุณ ' + data.first_name);
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  // 6. กำหนดค่ากล้อง (เหมือนหน้า Register)
  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "user"
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FFA494]/10 blur-[120px] rounded-full" />

      <div className="max-w-[450px] w-full bg-[#161616] p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative z-10 text-center">
        <div className="mb-10 space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-[#FFA494] transition-colors text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            <ArrowLeft className="w-3 h-3" /> Back to home
          </Link>
          <h2 className="text-4xl font-black text-white tracking-tighter italic">AI FACE LOGIN<span className="text-[#FFA494]">.</span></h2>
          <p className="text-white/40 font-medium text-sm">กรุณาวางใบหน้าให้ตรงกับกรอบสแกน</p>
        </div>

        {/* --- ส่วนของกล้อง (Camera Area) --- */}
        <div className="relative aspect-square w-full max-w-[260px] mx-auto mb-10">
          {/* กรอบสแกน (Border Decor) - แสดงเมื่อกล้องพร้อม */}
          {isCameraReady && !scanComplete && (
            <>
              <div className={`absolute inset-0 border-2 rounded-[3rem] transition-all duration-500 z-20 ${isScanning ? 'border-[#FFA494] shadow-[0_0_30px_rgba(255,164,148,0.3)]' : 'border-white/10'}`} />
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#FFA494] rounded-tl-[2rem] z-30" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#FFA494] rounded-tr-[2rem] z-30" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#FFA494] rounded-bl-[2rem] z-30" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#FFA494] rounded-br-[2rem] z-30" />
            </>
          )}

          {/* เส้นสแกน (Scanning Line Animation) */}
          {isScanning && <div className="absolute left-0 right-0 h-1 bg-[#FFA494] shadow-[0_0_15px_#FFA494] z-30 animate-[scan_2s_infinite]" />}

          {/* พื้นที่แสดงผล (Camera/Result) */}
          <div className="w-full h-full bg-black/60 rounded-[3rem] flex items-center justify-center overflow-hidden border border-white/5 relative">
            
            {scanComplete ? (
              // สถานะ: สแกนผ่าน
              <div className="relative z-10 w-full h-full flex items-center justify-center bg-black/80 backdrop-blur-sm">
                 <ShieldCheck className="w-16 h-16 text-green-400 animate-bounce" />
              </div>
            ) : (
              // สถานะ: เปิดกล้อง
              <>
                {/* 7. ใส่ Component Webcam จริง */}
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  onUserMedia={handleUserMedia} // เรียก callback เมื่อกล้องพร้อม
                  mirrored={true} // กระจก
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isCameraReady ? 'opacity-100' : 'opacity-0'}`}
                />
                
                {/* แสดงไอคอนรอโหลดถ้ากล้องยังไม่พร้อม */}
                {!isCameraReady && (
                  <ScanFace className="w-24 h-24 text-white/5 animate-pulse" />
                )}
              </>
            )}
          </div>
        </div>
        {/* --- จบส่วนของกล้อง --- */}

        <div className="space-y-6">
          {!scanComplete ? (
            <>
              <button 
                onClick={startScan} 
                disabled={isScanning || !isCameraReady} // ปิดปุ่มถ้าสแกนอยู่ หรือกล้องยังไม่พร้อม
                className="w-full py-5 bg-[#FFA494] text-black rounded-full font-black text-lg shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
              >
                {!isCameraReady ? 'กำลังโหลดกล้อง...' : isScanning ? 'กำลังสแกนใบหน้า...' : 'เริ่มการสแกนใบหน้า'}
              </button>
              <button onClick={() => setShowTestLogin(true)} className="text-[10px] text-white/20 hover:text-[#FFA494] font-bold uppercase tracking-[0.2em] transition-colors">
                ( Dev Mode: Bypass with Password )
              </button>
            </>
          ) : (
            <button onClick={() => window.location.href = '/dashboard'} className="w-full py-5 bg-green-500 text-white font-black rounded-full text-lg block animate-pulse">
              เข้าสู่ระบบสำเร็จ
            </button>
          )}
        </div>
      </div>

      {/* Test Login Modal (เหมือนเดิม) */}
      {showTestLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm modal-backdrop">
          <div className="bg-[#1c1c1c] w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative">
            <button onClick={() => setShowTestLogin(false)} className="absolute top-6 right-6 text-white/40 hover:text-white"><X /></button>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white tracking-tight">Test Login</h3>
              <p className="text-white/40 text-xs mt-1">ใช้ข้อมูลจากตาราง users ใน Supabase</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input type="text" value={testUsername} onChange={(e) => setTestUsername(e.target.value)} placeholder="Full Name (Username)" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#FFA494]/50 transition-all" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input type="password" value={testPassword} onChange={(e) => setTestPassword(e.target.value)} placeholder="Password" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#FFA494]/50 transition-all" />
              </div>
              <button onClick={handleBypassLogin} disabled={loading} className="w-full py-4 bg-[#FFA494] text-black rounded-2xl font-bold transition-all disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : 'Login (Bypass)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animation (เหมือนเดิม) */}
      <style jsx global>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        /* แก้ไขปัญหา Backdrop modal ซ้อนกัน */
        .modal-backdrop {
          z-index: 100 !important;
        }
      `}</style>
    </div>
  );
}