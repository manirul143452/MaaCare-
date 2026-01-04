
import React, { useState } from 'react';
import { Calendar, Sparkles, Heart, Info, ChevronRight, Activity, Thermometer } from 'lucide-react';

const FamilyPlanning: React.FC = () => {
  const [lastPeriod, setLastPeriod] = useState('2024-03-01');
  const [cycleLength, setCycleLength] = useState(28);

  const stats = [
    { label: 'Fertile Window', value: 'Starts in 4 days', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Next Period', value: 'March 29', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Ovulation Day', value: 'March 15', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Plan Your Journey</h1>
          <p className="text-indigo-50 text-lg mb-6 leading-relaxed">
            Understanding your cycle is the first step toward a healthy pregnancy. Track your fertile window and get AI-powered health insights.
          </p>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2">
            Log Daily Symptoms <ChevronRight size={18} />
          </button>
        </div>
        <Sparkles className="absolute -right-8 -bottom-8 w-64 h-64 text-white opacity-10 rotate-12" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Tracker Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar className="text-indigo-500" /> Cycle Tracker
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Last Period Start</label>
                  <input 
                    type="date" 
                    value={lastPeriod}
                    onChange={(e) => setLastPeriod(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Cycle Length ({cycleLength} days)</label>
                  <input 
                    type="range" 
                    min="20" 
                    max="40" 
                    value={cycleLength}
                    onChange={(e) => setCycleLength(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-6 flex flex-col justify-center text-center">
                <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Fertility Status</p>
                <div className="text-4xl font-black text-indigo-600 mb-2">Medium</div>
                <p className="text-xs text-indigo-500">Log your basal body temperature for higher accuracy.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon size={20} />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-base font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Thermometer size={18} className="text-rose-500" /> Planning Tips
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 shrink-0" />
                <p className="text-sm text-gray-600 leading-relaxed">Start taking <b>Folic Acid</b> supplements at least 3 months before conceiving.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 shrink-0" />
                <p className="text-sm text-gray-600 leading-relaxed">Track your <b>Cervical Mucus</b> to identify your peak fertile days.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0" />
                <p className="text-sm text-gray-600 leading-relaxed">Maintain a <b>balanced BMI</b> to optimize hormone levels for ovulation.</p>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm shrink-0">
              <Info size={20} />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 text-sm mb-1">AI Recommendation</h4>
              <p className="text-xs text-amber-700 leading-relaxed">Based on your log, your cycle is regular. We recommend scheduling a preconception checkup next month.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FamilyPlanning;
