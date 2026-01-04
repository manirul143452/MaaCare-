
import React, { useState, useEffect } from 'react';
import { 
  Baby, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Info, 
  Heart, 
  Activity, 
  Bolt, 
  Loader2,
  Apple
} from 'lucide-react';
import { getWeeklyDeepDive } from '../geminiService';

interface WeekData {
  title: string;
  summary: string;
  development: string;
  advice: string;
  size?: string;
  sizeImg?: string;
}

const PREGNANCY_DATA: Record<number, WeekData> = {
  1: {
    title: "The Journey Begins",
    summary: "Conception has not yet occurred.",
    development: "It might seem strange, but your pregnancy journey is considered to start on the first day of your last menstrual period (LMP). This is because it's nearly impossible to know the exact moment of conception. Your body is shedding its uterine lining and preparing a new, mature egg for ovulation.",
    advice: "Even though you're not officially pregnant yet, this is the most critical time to prepare your body. Start taking prenatal vitamins containing at least 400mcg of folic acid. Focus on a balanced diet and reduce stress.",
    size: "Microscopic Egg",
  },
  2: {
    title: "Preparing for Ovulation",
    summary: "An egg is maturing.",
    development: "Your body is preparing to release an egg (ovulation). The lining of your uterus is thickening to prepare for a fertilized egg. Conception typically occurs at the end of this week.",
    advice: "Continue with your healthy habits. Understanding your cycle can be helpful if you are trying to conceive. This is a week of hopeful anticipation.",
    size: "Microscopic Egg",
  },
  3: {
    title: "Fertilization",
    summary: "A tiny group of cells (blastocyst).",
    development: "Success! A single sperm has fertilized the egg, creating a zygote. This tiny ball of cells, called a blastocyst, travels down the fallopian tube to the uterus for implantation.",
    advice: "You will not feel any different yet, but a miracle is happening inside you. It is crucial to avoid alcohol and smoking as your baby begins its earliest stage of development.",
    size: "Pinhead",
  },
  4: {
    title: "Implantation",
    summary: "Size of a poppy seed.",
    development: "The blastocyst has burrowed into your uterine lining. It has divided into two parts: one becomes the embryo, and the other forms the placenta, which will nourish your baby.",
    advice: "You may get a positive pregnancy test this week! It’s normal to feel a mix of excitement and nervousness. Continue taking your prenatal vitamins with folic acid.",
    size: "Poppy Seed / 0.04 in",
  }
};

const PregnancyTracker: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState(4);
  const [deepDive, setDeepDive] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Mocking data for weeks beyond 4 for demonstration
  const getWeekData = (week: number): WeekData => {
    return PREGNANCY_DATA[week] || {
      title: `Week ${week} Growth`,
      summary: "Your baby is continuing to grow and develop rapidly.",
      development: `In week ${week}, your baby's organs and features are becoming more defined. The heart is beating stronger and brain activity is increasing.`,
      advice: "Keep staying hydrated and try to get plenty of rest. Your body is working hard to nurture your growing baby.",
      size: week > 20 ? "Size of a Pomegranate" : "Size of a Lemon"
    };
  };

  const handleDeepDive = async () => {
    setLoadingAI(true);
    try {
      const insight = await getWeeklyDeepDive(selectedWeek);
      setDeepDive(insight || "Your baby is doing amazing things this week!");
    } catch (err) {
      setDeepDive("Your baby is reaching incredible milestones right now.");
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    setDeepDive(null);
  }, [selectedWeek]);

  const currentData = getWeekData(selectedWeek);
  const progressPercent = (selectedWeek / 40) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Week Selector */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Your Journey</h2>
          <span className="text-sm font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
            Week {selectedWeek} of 40
          </span>
        </div>
        
        <div className="relative h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-1000" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {Array.from({ length: 40 }, (_, i) => i + 1).map((week) => (
            <button
              key={week}
              onClick={() => setSelectedWeek(week)}
              className={`
                min-w-[3.5rem] h-14 rounded-2xl flex flex-col items-center justify-center transition-all
                ${selectedWeek === week 
                  ? 'bg-pink-600 text-white shadow-lg scale-110' 
                  : 'bg-gray-50 text-gray-400 hover:bg-pink-50 hover:text-pink-400'}
              `}
            >
              <span className="text-[10px] font-bold uppercase">Wk</span>
              <span className="text-lg font-black">{week}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                  <Baby size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-800">{currentData.title}</h3>
                  <p className="text-gray-500 font-medium">{currentData.summary}</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
                    <Activity size={16} className="text-pink-500" /> Baby's Development
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {currentData.development}
                  </p>
                </div>

                <div className="p-6 bg-pink-50 rounded-3xl border border-pink-100">
                  <h4 className="flex items-center gap-2 text-sm font-black text-pink-700 uppercase tracking-widest mb-4">
                    <Heart size={16} /> Advice for You
                  </h4>
                  <p className="text-pink-900 leading-relaxed">
                    {currentData.advice}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Baby size={180} />
            </div>
          </section>

          {/* AI Insights */}
          <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">Fast AI Deep Dive</h3>
                    <p className="text-xs text-indigo-100 opacity-80 uppercase tracking-wider">Weekly Milestone</p>
                  </div>
                </div>
                <button 
                  onClick={handleDeepDive}
                  disabled={loadingAI}
                  className="px-4 py-2 bg-white text-indigo-600 rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2"
                >
                  {loadingAI ? <Loader2 className="animate-spin" size={16} /> : <Bolt size={16} fill="currentColor" />}
                  {deepDive ? 'Refresh Insight' : 'Get Insight'}
                </button>
              </div>

              {deepDive ? (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                  <p className="text-lg font-medium leading-relaxed italic">
                    "{deepDive}"
                  </p>
                </div>
              ) : (
                <p className="text-sm opacity-60">Click the button for a quick science-based fact about this week's development.</p>
              )}
            </div>
            <Sparkles className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10" />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center space-y-6">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Baby Size</h4>
            <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-white">
              <Apple size={64} className="text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-800">{currentData.size}</p>
              <p className="text-sm text-gray-400">Comparing to common items</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Trimester Goal</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-sm text-gray-700 font-medium">Daily Prenatal Vitamin</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-sm text-gray-700 font-medium">8 Glasses of Water</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-200 rounded-full" />
                <p className="text-sm text-gray-400 font-medium">Pelvic Floor Exercise</p>
              </div>
            </div>
            <button className="w-full py-3 bg-gray-50 text-gray-600 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all uppercase tracking-wider">
              Open Checklists
            </button>
          </div>

          <div className="bg-rose-500 p-8 rounded-[2.5rem] text-white shadow-lg relative overflow-hidden">
            <h4 className="font-bold mb-2">Feeling different?</h4>
            <p className="text-xs text-rose-100 opacity-90 leading-relaxed mb-4">
              Each body reacts uniquely to pregnancy. If you notice severe changes, always consult your doctor.
            </p>
            <button className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
              Symptom Guide <ChevronRight size={12} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PregnancyTracker;
