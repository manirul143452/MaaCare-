
import React from 'react';
import { Smile, Wind, Heart, Sparkles, BookOpen, ShieldCheck, Play, ArrowRight } from 'lucide-react';

const SelfCare: React.FC = () => {
  const sessions = [
    { title: 'Morning Affirmations', duration: '5 min', icon: Sparkles, color: 'text-amber-600 bg-amber-100' },
    { title: 'Breath Control', duration: '10 min', icon: Wind, color: 'text-blue-600 bg-blue-100' },
    { title: 'Postpartum Recovery', duration: '15 min', icon: Heart, color: 'text-pink-600 bg-pink-100' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-pink-100 text-pink-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-sm">
          <Smile size={40} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Self Care Sanctuary</h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          Nurturing the nurturer. Take a moment for your mental and physical wellbeing.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
        {sessions.map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className={`${s.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
              <s.icon size={28} />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">{s.title}</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">{s.duration} Session</p>
            <button className="w-full py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 group-hover:shadow-lg group-hover:shadow-indigo-100">
              <Play size={16} fill="currentColor" /> Start Now
            </button>
          </div>
        ))}
      </div>

      <section className="bg-indigo-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">Mindful Mama Podcast</h2>
              <p className="text-indigo-200 text-lg leading-relaxed max-w-md">
                Listen to experts and other mothers sharing their stories and techniques for managing the beautiful chaos of parenthood.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-2 active:scale-95 shadow-xl shadow-black/20">
                Browse Episodes <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="w-full aspect-video bg-white/10 rounded-[2.5rem] backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center">
               <div className="flex gap-1 items-end h-16">
                  {[4, 7, 3, 9, 5, 8, 4, 6].map((h, i) => (
                    <div key={i} className="w-2 bg-indigo-400 rounded-full animate-pulse" style={{ height: `${h * 10}%`, animationDelay: `${i * 0.1}s` }} />
                  ))}
               </div>
            </div>
          </div>
        </div>
        <Wind className="absolute -left-12 -top-12 w-64 h-64 text-white opacity-5" />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-start gap-6 shadow-sm">
          <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center shrink-0">
            <BookOpen size={24} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Self-Care Journal</h4>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Reflect on your daily journey. Logging your moods helps track emotional trends and identifies early signs of burnout.
            </p>
            <button className="text-pink-600 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-3 transition-all">
              Start Writing <ArrowRight size={14} />
            </button>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-start gap-6 shadow-sm">
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Mental Health Triage</h4>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Feeling overwhelmed? Our confidential AI-supported triage can help determine if you should reach out to a professional.
            </p>
            <button className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-3 transition-all">
              Take Assessment <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfCare;
