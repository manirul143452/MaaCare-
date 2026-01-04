
import React from 'react';
import { Baby, Moon, Utensils, Ruler, ShieldCheck, Heart, Sparkles, ChevronRight } from 'lucide-react';

const ChildCareGuide: React.FC = () => {
  const categories = [
    { title: 'Feeding Guide', icon: Utensils, color: 'bg-orange-100 text-orange-600', tips: ['Breastfeeding basics', 'Bottle sterilization', 'Starting solids'] },
    { title: 'Sleep Support', icon: Moon, color: 'bg-indigo-100 text-indigo-600', tips: ['Safe sleep positions', 'Sleep regression', 'Routine setting'] },
    { title: 'Milestones', icon: Ruler, color: 'bg-teal-100 text-teal-600', tips: ['Tummy time', 'Social smiling', 'Object permanence'] },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Child Care Guide</h1>
          <p className="text-gray-500 mt-2 text-lg leading-relaxed">Expert-backed advice for your baby's first year and beyond.</p>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 flex items-center gap-3 shadow-sm">
          <Baby className="text-pink-500" />
          <div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Current Focus</p>
            <p className="text-sm font-bold text-gray-800">Newborn Essentials</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
            <div className={`${cat.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
              <cat.icon size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{cat.title}</h3>
            <ul className="space-y-3">
              {cat.tips.map((tip, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-500 text-sm font-medium hover:text-indigo-600 transition-colors">
                  <ChevronRight size={14} className="text-gray-300" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <section className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full border border-white/30 backdrop-blur-sm">
              <Sparkles size={14} className="text-yellow-200" />
              <span className="text-[10px] font-black uppercase tracking-widest">Daily Wisdom</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black leading-tight">The "Golden Hour"</h2>
            <p className="text-white/80 text-lg leading-relaxed max-w-xl">
              Did you know that skin-to-skin contact in the first hour after birth helps regulate your baby's temperature, breathing, and heart rate? It also builds an incredible lifelong bond.
            </p>
            <button className="bg-white text-pink-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-pink-50 transition-all shadow-xl shadow-pink-600/20 active:scale-95">
              Read More Evidence
            </button>
          </div>
          <div className="w-48 h-48 bg-white/10 rounded-[2.5rem] backdrop-blur-md flex items-center justify-center rotate-3 border border-white/20 shadow-inner">
             <Heart size={80} className="text-white animate-pulse" fill="currentColor" />
          </div>
        </div>
        <Sparkles className="absolute -right-12 -bottom-12 w-64 h-64 text-white opacity-10" />
      </section>

      <div className="bg-indigo-950 rounded-[2.5rem] p-8 flex items-center gap-8 border border-white/5">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
          <ShieldCheck className="text-indigo-400" size={24} />
        </div>
        <div>
          <h4 className="text-white font-bold text-lg">Safety Standards</h4>
          <p className="text-indigo-300 text-sm opacity-80 leading-relaxed">
            All child care advice in MaaCare is vetted by board-certified pediatricians and aligned with global healthcare guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChildCareGuide;
