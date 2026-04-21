'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Loader2, RefreshCw, ShieldCheck, User, ArrowLeftToLine, ArrowRightToLine, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { id: 0, label: 'หน้าตรง', hint: 'LOOK STRAIGHT', icon: <User className="w-7 h-7" /> },
  { id: 1, label: 'หันซ้าย', hint: 'TURN LEFT', icon: <ArrowLeftToLine className="w-7 h-7" /> },
  { id: 2, label: 'หันขวา', hint: 'TURN RIGHT', icon: <ArrowRightToLine className="w-7 h-7" /> }
];

export default function CameraPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(true);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [isFreezing, setIsFreezing] = useState(false);
  
  const [capturedImages, setCapturedImages] = useState<(string | null)[]>([null, null, null]);
  const [currentStep, setCurrentStep] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const executeCapture = useCallback(async () => {
    if (!webcamRef.current) return;
    const screenshot = webcamRef.current.getScreenshot();
    if (screenshot) {
      setCapturedImages(prev => {
        const newImgs = [...prev];
        newImgs[currentStep] = screenshot;
        return newImgs;
      });
      setIsFreezing(true);
      setCountdown(null);
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsFreezing(false);
      if (currentStep < 2) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsCameraOpen(false);
        setIsAutoRunning(false);
      }
    }
  }, [currentStep]);

  useEffect(() => {
    if (isAutoRunning && isCameraOpen && !isFreezing && currentStep < 3 && capturedImages[currentStep] === null) {
      let timer = 5;
      setCountdown(timer);
      const interval = setInterval(() => {
        timer -= 1;
        setCountdown(timer);
        if (timer === 0) {
          clearInterval(interval);
          executeCapture();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStep, isAutoRunning, isCameraOpen, isFreezing, executeCapture]);

  const handleStartAuto = () => {
    setCapturedImages([null, null, null]);
    setCurrentStep(0);
    setIsCameraOpen(true);
    setIsAutoRunning(true);
  };

 const handleCompleteRegistration = async () => {
    const rawData = sessionStorage.getItem('temp_user_data');
    if (!rawData || capturedImages.some(img => img === null)) {
      alert("โปรดกรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const userData = JSON.parse(rawData);
    setLoading(true);

    try {
      // --- STEP 1: Insert User ---
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([{
          full_name: userData.firstName + " " + userData.lastName,
          password: userData.password
        }])
        .select('id')
        .single();

      if (userError) throw userError;
      const userId = newUser.id;

      // --- STEP 2: Request AI Vector ---
      const ai_url = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://127.0.0.1:8000';
      const aiResponse = await fetch(`${ai_url}/extract-vector`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: capturedImages })
      });

      if (!aiResponse.ok) {
        // !!! ถ้า AI พัง ให้รีบลบ User ที่เพิ่งสร้างทิ้งทันที !!!
        await supabase.from('users').delete().eq('id', userId);
        throw new Error("AI Processing failed - Cleanup Done");
      }

      const aiData = await aiResponse.json();
      const vector = aiData.vector;

      // --- STEP 3: Insert Face Vector ---
      const { error: faceError } = await supabase
        .from('user_faces')
        .insert([{
          user_id: userId,
          face_embedding: vector
        }]);

      if (faceError) {
        // !!! ถ้าบันทึกหน้าพัง ก็ต้องลบ User ทิ้งเหมือนกัน !!!
        await supabase.from('users').delete().eq('id', userId);
        throw faceError;
      }

      alert("ลงทะเบียนสำเร็จ");
      sessionStorage.clear();
      router.push('/signin');

    } catch (err: any) {
      alert("Error: " + err.message);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-sans overflow-hidden text-white">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#FFA494]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-[#0F0F0F]/90 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 p-10 space-y-8 shadow-2xl relative">
        
        {/* Header Section */}
        <div className="flex flex-col items-center gap-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[11px] font-bold uppercase tracking-[0.2em] group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK TO INFO
          </button>
          <div className="text-center">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-1">FACE LOCK<span className="text-[#FFA494]">.</span></h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">SECURE CLOUD VERIFICATION</p>
          </div>
        </div>

        {/* Circular Camera */}
        <div className="relative flex flex-col items-center">
          <div className="relative w-64 h-64 md:w-72 md:h-72">
            <div className={`absolute -inset-1 border border-white/10 rounded-full ${isAutoRunning ? 'animate-pulse' : ''}`} />
            
            <div className="relative w-full h-full rounded-full overflow-hidden bg-black shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-white/5">
              {isCameraOpen ? (
                <>
                  {isFreezing ? (
                    <img src={capturedImages[currentStep]!} className="w-full h-full object-cover scale-110" alt="Captured" />
                  ) : (
                    <Webcam ref={webcamRef} audio={false} mirrored={true} className="w-full h-full object-cover scale-110" />
                  )}
                  
                  {countdown !== null && !isFreezing && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(0,0,0,1)] animate-[ping_1s_infinite] select-none">
                        {countdown}
                      </span>
                    </div>
                  )}

                  {!isFreezing && isAutoRunning && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#FFA494] to-transparent absolute top-0 animate-[scan_2s_ease-in-out_infinite]" />
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#111] to-[#000]">
                  <CheckCircle2 className="w-20 h-20 text-green-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-bounce" />
                </div>
              )}
            </div>
          </div>

          {/* Prompt Label */}
          <div className="mt-8 h-8 flex items-center">
            {isCameraOpen && (
              <div className="text-[14px] font-black uppercase tracking-[0.5em] text-[#FFA494] animate-pulse">
                {STEPS[currentStep].hint}
              </div>
            )}
          </div>

          {/* Enlarged Step Indicators */}
          <div className="flex gap-8 mt-6">
            {STEPS.map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-4">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border transition-all duration-700 ${capturedImages[step.id] ? 'bg-green-500/20 border-green-500/50 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : currentStep === step.id ? 'bg-[#FFA494]/10 border-[#FFA494] text-[#FFA494] shadow-[0_0_30px_rgba(255,164,148,0.3)] scale-110' : 'bg-white/5 border-white/5 text-white/10'}`}>
                  {capturedImages[step.id] ? <CheckCircle2 className="w-7 h-7" /> : step.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${currentStep === step.id ? 'text-white shadow-sm' : 'text-white/20'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 pt-4">
          <button 
            onClick={handleStartAuto} 
            disabled={isAutoRunning || loading}
            className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all font-bold text-[11px] tracking-[0.3em] uppercase disabled:opacity-30"
          >
            <RefreshCw className={`w-4 h-4 ${isAutoRunning ? 'animate-spin' : ''}`} />
            {isAutoRunning ? 'SCANNING...' : 'RE-TAKE SCAN'}
          </button>

          <button 
            onClick={handleCompleteRegistration} 
            disabled={capturedImages.some(img => img === null) || loading}
            className="group w-full py-5 bg-white text-black font-black rounded-[2rem] text-xl shadow-[0_20px_50px_rgba(255,164,148,0.15)] hover:scale-[1.02] active:scale-95 transition-all duration-500 disabled:opacity-5 flex justify-center items-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin h-6 w-6" /> : <ShieldCheck className="w-7 h-7" />}
            {loading ? 'SYNCING...' : 'FINALIZE PROFILE'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}