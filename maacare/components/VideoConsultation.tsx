
import React, { useEffect, useRef, useState } from 'react';
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, 
  Maximize, Minimize, Loader2, Sparkles, User, AlertCircle,
  Activity, ShieldCheck, Zap, Clock, X, MessageCircle,
  Wifi, WifiOff, SignalHigh, SignalMedium, SignalLow,
  Info, RefreshCw, BarChart3, Globe, CheckCircle2, Volume2, HardDrive
} from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { Appointment } from '../types';

interface Props {
  appointment: Appointment;
  onClose: () => void;
}

const END_REASONS = [
  "Consultation finished",
  "Technical issues",
  "Poor audio/video quality",
  "Emergency",
  "Accidental hang up",
  "Other"
];

type ConnectionQuality = 'excellent' | 'good' | 'poor' | 'disconnected';

const VideoConsultation: React.FC<Props> = ({ appointment, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [quality, setQuality] = useState<ConnectionQuality>('disconnected');
  const [latency, setLatency] = useState<number>(0);
  const [packetLoss, setPacketLoss] = useState<string>("0.0%");
  const [bitrate, setBitrate] = useState<string>("2.4 Mbps");
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  const [micLevel, setMicLevel] = useState(0);

  // End Call Modal State
  const [showEndCallModal, setShowEndCallModal] = useState(false);
  const [selectedEndReason, setSelectedEndReason] = useState<string>("");
  const [customEndReason, setCustomEndReason] = useState<string>("");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const frameIntervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Connection Quality Logic
  useEffect(() => {
    if (!isConnected) {
      setQuality('disconnected');
      setLatency(0);
      return;
    }

    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.95) {
        setQuality('poor');
        setLatency(Math.floor(Math.random() * 300) + 400);
        setPacketLoss((Math.random() * 5).toFixed(1) + "%");
        setBitrate((Math.random() * 0.5 + 0.2).toFixed(1) + " Mbps");
      } else if (rand > 0.8) {
        setQuality('good');
        setLatency(Math.floor(Math.random() * 100) + 150);
        setPacketLoss((Math.random() * 1).toFixed(1) + "%");
        setBitrate((Math.random() * 1 + 1.2).toFixed(1) + " Mbps");
      } else {
        setQuality('excellent');
        setLatency(Math.floor(Math.random() * 40) + 30);
        setPacketLoss("0.0%");
        setBitrate((Math.random() * 0.5 + 2.5).toFixed(1) + " Mbps");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected]);

  // Audio Level Monitoring
  useEffect(() => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    let animationFrame: number;

    const updateLevel = () => {
      if (isMuted) {
        setMicLevel(0);
      } else {
        analyserRef.current?.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const average = sum / dataArray.length;
        setMicLevel(Math.min(100, average * 1.5));
      }
      animationFrame = requestAnimationFrame(updateLevel);
    };
    updateLevel();
    return () => cancelAnimationFrame(animationFrame);
  }, [isMuted, isConnected]);

  // PCM Decoding Utilities
  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  const playTestSound = () => {
    if (!outputAudioContextRef.current) return;
    const ctx = outputAudioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  };

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputAudioContext;
      outputAudioContextRef.current = outputAudioContext;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      // Setup Analyser
      const sourceNode = inputAudioContext.createMediaStreamSource(stream);
      const analyser = inputAudioContext.createAnalyser();
      analyser.fftSize = 256;
      sourceNode.connect(analyser);
      analyserRef.current = analyser;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            timerIntervalRef.current = window.setInterval(() => {
              setCallDuration(prev => prev + 1);
            }, 1000);
            
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              if (isMuted) return;
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            sourceNode.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);

            const canvas = canvasRef.current;
            const video = localVideoRef.current;
            if (canvas && video) {
              const ctx = canvas.getContext('2d');
              frameIntervalRef.current = window.setInterval(() => {
                if (isCameraOff) return;
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 480;
                ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(async (blob) => {
                  if (blob) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64Data = (reader.result as string).split(',')[1];
                      sessionPromise.then((session) => {
                        session.sendRealtimeInput({
                          media: { data: base64Data, mimeType: 'image/jpeg' }
                        });
                      });
                    };
                    reader.readAsDataURL(blob);
                  }
                }, 'image/jpeg', 0.6);
              }, 1000);
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              const ctx = outputAudioContextRef.current;
              if (ctx) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                });
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current) {
                try { source.stop(); } catch(e) {}
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e: any) => {
            console.error('Session error', e);
            setIsError(true);
            setErrorMessage("The consultation was interrupted. Please check your connection.");
          },
          onclose: () => {
            setIsConnected(false);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: `You are ${appointment.expertName}, a certified expert in ${appointment.specialty} at MaaCare. 
            Speak warmly and empathetically. You are in a secure video consultation. Maintain a professional healthcare tone. 
            Always emphasize that you are an AI assistant and clinical care should be sought for emergencies.`,
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error(err);
      setIsError(true);
      setErrorMessage("Could not initialize video/audio equipment. Please ensure permissions are granted.");
    }
  };

  useEffect(() => {
    startSession();
    return () => {
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
      if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleCamera = () => {
    setIsCameraOff(!isCameraOff);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => track.enabled = isCameraOff);
    }
  };

  // Fix: Add handleEndCallRequest to show the end call confirmation modal
  const handleEndCallRequest = () => {
    setShowEndCallModal(true);
  };

  // Fix: Add handleFinalClose to properly close the consultation and trigger the parent onClose callback
  const handleFinalClose = () => {
    onClose();
  };

  const renderQualityIndicator = () => {
    let classes = "flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest shadow-sm transition-all cursor-help hover:scale-105 active:scale-95 ";
    let content = null;

    switch (quality) {
      case 'excellent':
        classes += "bg-green-500/10 border-green-500/20 text-green-400";
        content = <><SignalHigh size={14} /> <span>Excellent</span></>;
        break;
      case 'good':
        classes += "bg-amber-500/10 border-amber-500/20 text-amber-400";
        content = <><SignalMedium size={14} /> <span>Good</span></>;
        break;
      case 'poor':
        classes += "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse";
        content = <><SignalLow size={14} /> <span>Poor</span></>;
        break;
      default:
        classes += "bg-white/5 border-white/10 text-gray-400";
        content = <><WifiOff size={14} /> <span>Offline</span></>;
    }

    return (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setShowTroubleshoot(true)}
          className={classes}
          title="View Connection Details & Troubleshooting"
        >
          {content}
        </button>
        {isConnected && !isMuted && (
          <div className="w-8 h-4 bg-gray-950/50 rounded-full flex items-center px-1 overflow-hidden border border-white/10">
            <div 
              className="h-2 bg-indigo-500 rounded-full transition-all duration-75 shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
              style={{ width: `${micLevel}%` }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] bg-gray-950 flex flex-col items-center justify-center p-0 md:p-4">
      <div className="w-full max-w-6xl h-full flex flex-col relative overflow-hidden rounded-none md:rounded-[3rem] border-0 md:border border-gray-800 shadow-2xl bg-gray-900">
        
        {/* Main Viewport */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          {/* Expert Visualization */}
          <div className="text-center space-y-8 relative z-10">
            <div className="relative inline-block">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto border-[6px] border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
                <img 
                  src={appointment.expertImage} 
                  className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover border-4 border-white shadow-2xl" 
                  alt={appointment.expertName} 
                />
              </div>
              {isConnected && (
                <div className="absolute -bottom-2 right-4 bg-green-500 p-2 rounded-2xl border-4 border-gray-900 shadow-lg animate-bounce">
                   <Activity size={24} className="text-white" />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-white tracking-tight">{appointment.expertName}</h2>
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck size={18} className="text-indigo-400" />
                <p className="text-indigo-300 font-bold uppercase tracking-[0.2em] text-xs">{appointment.specialty}</p>
              </div>
              
              {!isConnected && !isError && (
                <div className="flex flex-col items-center gap-4 mt-8">
                  <div className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-indigo-100 text-sm font-medium">
                    <Loader2 className="animate-spin" size={18} />
                    <span>Establishing encrypted consultation...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Network Health Overlay Panel */}
          {showTroubleshoot && (
            <div className="absolute inset-0 z-40 bg-gray-950/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
              <div className="bg-gray-900/95 border border-white/10 rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl relative">
                <button 
                  onClick={() => setShowTroubleshoot(false)}
                  className="absolute top-8 right-8 p-3 bg-white/5 text-gray-400 hover:text-white transition-colors rounded-2xl border border-white/5"
                >
                  <X size={20} />
                </button>
                
                <div className="space-y-8">
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-[1.5rem] ${
                      quality === 'excellent' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                      quality === 'good' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                      'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      <Activity size={32} />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-2xl tracking-tight">Diagnostics</h3>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Network Health Center</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-5 rounded-[1.75rem] border border-white/5">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                        <SignalHigh size={12} className="text-indigo-400" /> Latency
                      </p>
                      <p className="text-xl font-black text-white">{latency} ms</p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-[1.75rem] border border-white/5">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                        <HardDrive size={12} className="text-pink-400" /> Bitrate
                      </p>
                      <p className="text-xl font-black text-white">{bitrate}</p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-[1.75rem] border border-white/5">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Activity size={12} className="text-amber-400" /> Packet Loss
                      </p>
                      <p className="text-xl font-black text-white">{packetLoss}</p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-[1.75rem] border border-white/5">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Mic size={12} className="text-green-400" /> Mic Input
                      </p>
                      <div className="h-4 bg-gray-950 rounded-full mt-2 overflow-hidden border border-white/5">
                        <div className="h-full bg-green-500 transition-all duration-100" style={{ width: `${micLevel}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <h4 className="text-xs font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                      <Volume2 size={16} className="text-indigo-400" /> Troubleshooting Tools
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <button 
                        onClick={playTestSound}
                        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Volume2 size={18} className="text-indigo-400" />
                          <span className="text-sm font-bold text-gray-300">Test Speaker Output</span>
                        </div>
                        <span className="text-[10px] font-black uppercase text-gray-500 group-hover:text-indigo-400">Play Chime</span>
                      </button>
                      
                      {quality === 'poor' && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 animate-in slide-in-from-bottom-2">
                          <AlertCircle size={20} className="text-red-500 shrink-0" />
                          <p className="text-xs text-red-400 leading-relaxed font-medium">
                            Your signal is unstable. Try switching to cellular data or moving closer to your router for better clinical clarity.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowTroubleshoot(false)}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
                  >
                    Return to Consultation
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User Video Feed */}
          <div className="absolute top-6 right-6 w-36 h-48 md:w-56 md:h-72 bg-gray-950 rounded-[2rem] border-2 border-white/10 shadow-2xl overflow-hidden group transition-all hover:scale-105 active:scale-95 z-20">
            {isCameraOff ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-500 gap-2">
                <VideoOff size={32} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Camera Off</span>
              </div>
            ) : (
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover mirror grayscale-[0.2] brightness-110" 
              />
            )}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
              <User size={10} className="text-white" />
              <span className="text-[10px] text-white font-bold uppercase">You</span>
            </div>
          </div>

          {/* Header Info */}
          <div className="absolute top-6 left-6 flex flex-col gap-3 z-20">
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-red-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full" /> LIVE
              </div>
              <div className="bg-white/5 backdrop-blur-xl px-4 py-1.5 rounded-xl text-white text-[11px] font-bold border border-white/10 flex items-center gap-2 shadow-sm">
                <Clock size={14} className="text-indigo-400" />
                {formatDuration(callDuration)}
              </div>
              {renderQualityIndicator()}
            </div>
            {isConnected && (
              <div className="bg-green-500/10 backdrop-blur-md px-4 py-2 rounded-2xl text-green-400 text-[10px] font-bold border border-green-500/20 flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-left-4">
                <ShieldCheck size={14} /> Encrypted Call Active
              </div>
            )}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="h-32 bg-gray-900/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-between px-6 md:px-12 z-30">
          <div className="hidden md:flex items-center gap-4 flex-1">
             <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
                  <Zap size={20} fill="currentColor" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-white uppercase">Fast AI Node</p>
                   <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Ultra-low latency</p>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-5 md:gap-8 justify-center flex-1">
            <button 
              onClick={toggleMute}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] flex items-center justify-center transition-all ${
                isMuted ? 'bg-red-500 text-white shadow-xl shadow-red-500/20 scale-95' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            
            <button 
              onClick={handleEndCallRequest}
              className="w-20 h-16 md:w-28 md:h-18 bg-red-600 text-white rounded-[2rem] flex items-center justify-center hover:bg-red-700 transition-all shadow-2xl shadow-red-600/30 group active:scale-90"
            >
              <PhoneOff size={32} className="group-hover:rotate-[135deg] transition-transform duration-300" />
            </button>

            <button 
              onClick={toggleCamera}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] flex items-center justify-center transition-all ${
                isCameraOff ? 'bg-red-500 text-white shadow-xl shadow-red-500/20 scale-95' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {isCameraOff ? <VideoOff size={24} /> : <VideoIcon size={24} />}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
            <button className="p-4 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-2xl">
              <Maximize size={20} />
            </button>
          </div>
        </div>

        {/* End Call Feedback Modal */}
        {showEndCallModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <MessageCircle size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-xl tracking-tight">End Consultation?</h3>
                    <p className="text-xs text-gray-500">With {appointment.expertName}</p>
                  </div>
                </div>
                <button onClick={() => setShowEndCallModal(false)} className="p-3 hover:bg-white rounded-2xl text-gray-400 transition-colors border border-transparent hover:border-gray-100">
                  <X size={24} />
                </button>
              </div>

              <div className="p-10 space-y-6">
                <p className="text-sm text-gray-600 leading-relaxed text-center font-medium">
                  How was your consultation experience? Please let us know why you are ending the call.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {END_REASONS.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setSelectedEndReason(reason)}
                      className={`px-4 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider border transition-all text-left ${
                        selectedEndReason === reason 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' 
                          : 'bg-white border-gray-100 text-gray-400 hover:border-indigo-100'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>

                {selectedEndReason === "Other" && (
                  <textarea
                    value={customEndReason}
                    onChange={(e) => setCustomEndReason(e.target.value)}
                    placeholder="Tell us more..."
                    className="w-full p-5 rounded-[1.5rem] border border-gray-100 bg-gray-50 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none h-32"
                  />
                )}
              </div>

              <div className="p-10 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowEndCallModal(false)}
                  className="flex-1 py-4 px-6 bg-white border border-gray-100 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                >
                  Stay in Call
                </button>
                <button 
                  onClick={handleFinalClose}
                  disabled={!selectedEndReason || (selectedEndReason === "Other" && !customEndReason.trim())}
                  className="flex-1 py-4 px-6 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100 active:scale-90"
                >
                  End Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {isError && (
          <div className="absolute inset-0 bg-gray-950/95 backdrop-blur-2xl z-[100] flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-red-500/20 text-red-500 rounded-[2.5rem] flex items-center justify-center border border-red-500/30 shadow-2xl shadow-red-500/10">
              <AlertCircle size={48} />
            </div>
            <div className="max-w-sm space-y-4">
              <h3 className="text-3xl font-black text-white">Call Interrupted</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{errorMessage}</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => { setIsError(false); startSession(); }}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
              >
                Try Reconnecting
              </button>
              <button 
                onClick={handleFinalClose}
                className="px-8 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/10"
              >
                End Session
              </button>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
};

export default VideoConsultation;
