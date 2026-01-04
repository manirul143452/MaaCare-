
import React, { useState, useRef, useEffect } from 'react';
import { checkSymptoms } from '../geminiService';
import { Send, Thermometer, Info, AlertTriangle, Loader2, Mic, MicOff, Sparkles, Phone, ShieldAlert, LifeBuoy } from 'lucide-react';

const SymptomChecker: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInput(prev => {
            const separator = prev && !prev.endsWith(' ') ? ' ' : '';
            return prev + separator + finalTranscript;
          });
        }
      };

      recognitionRef.current.onspeechend = () => {
        recognitionRef.current.stop();
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (isListening) recognitionRef.current.stop();

    setLoading(true);
    try {
      const response = await checkSymptoms(input);
      setResult(response || "Analysis unavailable. Please consult a doctor.");
    } catch (error) {
      setResult("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Thermometer size={40} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Symptom Checker</h1>
        <p className="text-gray-500 mt-3 max-w-md mx-auto text-lg leading-relaxed">
          Describe symptoms or concerns to get immediate AI-powered triage guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-orange-500" />
                <label className="text-gray-900 font-black text-sm uppercase tracking-widest">Input Symptoms</label>
              </div>
              <button
                type="button"
                onClick={toggleListening}
                className={`px-5 py-2.5 rounded-2xl transition-all flex items-center gap-3 text-xs font-black uppercase tracking-widest border ${
                  isListening 
                  ? 'bg-red-50 border-red-200 text-red-600 shadow-lg' 
                  : 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100 shadow-sm'
                }`}
              >
                {isListening ? (
                  <>
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                    <span>Listening...</span>
                  </>
                ) : (
                  <>
                    <Mic size={16} />
                    <span>Speak</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="relative group">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="E.g., My 6-month-old has a dry cough and a temperature of 101°F for 2 hours..."
                className={`w-full h-56 p-6 rounded-[2rem] border-2 transition-all resize-none outline-none text-gray-800 leading-relaxed placeholder:text-gray-300 ${
                  isListening 
                  ? 'border-orange-400 ring-8 ring-orange-50 bg-orange-50/10' 
                  : 'border-gray-50 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50'
                }`}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
              <div className="flex items-center gap-3 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                <ShieldAlert size={16} className="text-blue-400" />
                <span>Confidential AI Analysis</span>
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-full sm:w-auto bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.15em] hover:bg-orange-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-xl shadow-orange-100 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Analyze Now</>}
              </button>
            </div>
          </form>

          {result && (
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-6">
              <div className="flex items-center gap-3 text-orange-600 mb-6 font-black uppercase tracking-widest text-xs">
                <AlertTriangle size={20} />
                <h3>Triage Summary</h3>
              </div>
              <div className="prose prose-orange max-w-none text-gray-700 whitespace-pre-wrap leading-loose text-lg font-medium italic">
                {result}
              </div>
              <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                 <p>AI Assessment Only - No Diagnosis</p>
                 <p>{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          {/* Enhanced Emergency Section */}
          <div className="bg-red-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-red-200 border border-red-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-500">
               <ShieldAlert size={120} />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm animate-pulse">
                  <AlertTriangle size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="font-black text-xl tracking-tight">EMERGENCY CHECK</h4>
                  <p className="text-[10px] font-black text-red-100 uppercase tracking-widest">Safety First Guidelines</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-black text-red-100 uppercase tracking-widest border-b border-white/20 pb-2">Red Flag Symptoms:</p>
                <ul className="text-sm space-y-3 font-bold text-red-50 leading-snug">
                  <li className="flex gap-3">
                    <span className="text-white opacity-60">•</span>
                    Difficulty breathing or blue-tinted lips/skin
                  </li>
                  <li className="flex gap-3">
                    <span className="text-white opacity-60">•</span>
                    Non-responsive, extreme lethargy, or seizures
                  </li>
                  <li className="flex gap-3">
                    <span className="text-white opacity-60">•</span>
                    High fever (above 104°F) that won't drop
                  </li>
                  <li className="flex gap-3">
                    <span className="text-white opacity-60">•</span>
                    Severe, localized abdominal pain or rigid belly
                  </li>
                  <li className="flex gap-3">
                    <span className="text-white opacity-60">•</span>
                    Persistent vomiting and signs of dehydration
                  </li>
                  <li className="flex gap-3">
                    <span className="text-white opacity-60">•</span>
                    Head injury followed by vomiting or confusion
                  </li>
                </ul>
              </div>

              <div className="pt-4 space-y-3">
                <a 
                  href="tel:911"
                  className="w-full bg-white text-red-600 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-red-50 transition-all active:scale-95"
                >
                  <Phone size={18} fill="currentColor" /> Call Emergency (911)
                </a>
                <p className="text-[10px] text-center text-red-100 font-medium italic px-4">
                  If you are in doubt, do not wait. Contact emergency services or visit the nearest ER immediately.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <h4 className="font-black text-gray-900 flex items-center gap-2 text-sm uppercase tracking-widest">
              <LifeBuoy size={18} className="text-indigo-500" /> Best Results
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Age & Weight</p>
                <p className="text-xs text-gray-600 font-medium">Crucial for dosage and risk assessment.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Timeline</p>
                <p className="text-xs text-gray-600 font-medium">When did it start? How frequent is it?</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
