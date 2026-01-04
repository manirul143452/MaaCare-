
import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Apple, 
  Coffee, 
  Droplets, 
  CheckCircle, 
  Flame, 
  PieChart, 
  Sparkles, 
  Loader2, 
  RefreshCw, 
  Zap,
  ChevronRight,
  Baby,
  Milk,
  Soup,
  Beef,
  Scale,
  Smile,
  GraduationCap,
  Info,
  Clock,
  Ban,
  // Fix: Added missing icon imports to resolve "Cannot find name" errors
  Activity,
  ShieldCheck,
  Sun,
  Users,
  Bolt
} from 'lucide-react';
import { generateNutritionTips } from '../geminiService';

type LifeStage = 'Pregnancy' | '0-6 Months' | '6-12 Months' | '1-3 Years' | '3-5 Years' | '6-8 Years';

const STAGES: LifeStage[] = [
  'Pregnancy',
  '0-6 Months',
  '6-12 Months',
  '1-3 Years',
  '3-5 Years',
  '6-8 Years'
];

const NutritionGuide: React.FC = () => {
  const [activeStage, setActiveStage] = useState<LifeStage>('Pregnancy');
  const [aiTips, setAiTips] = useState<any[]>([]);
  const [loadingTips, setLoadingTips] = useState(true);

  const fetchTips = async () => {
    setLoadingTips(true);
    try {
      const tips = await generateNutritionTips(activeStage);
      setAiTips(tips);
    } catch (error) {
      console.error("Failed to fetch AI tips", error);
    } finally {
      setLoadingTips(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, [activeStage]);

  const renderStageContent = () => {
    switch (activeStage) {
      case 'Pregnancy':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Folic Acid', desc: 'Essential for preventing neural tube defects. Find it in leafy greens, fortified cereals, and lentils.', icon: Sparkles, color: 'text-green-600 bg-green-50' },
                { title: 'Iron', desc: 'Supports baby\'s growth and prevents anemia. Sources: red meat, poultry, beans, and spinach.', icon: Activity, color: 'text-rose-600 bg-rose-50' },
                { title: 'Calcium', desc: 'Crucial for baby\'s bones and teeth. Get enough for both via dairy, broccoli, and kale.', icon: Beef, color: 'text-blue-600 bg-blue-50' },
                { title: 'DHA', desc: 'Omega-3 vital for brain/eye development. Found in low-mercury fish like salmon and sardines.', icon: Droplets, color: 'text-indigo-600 bg-indigo-50' }
              ].map((n, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className={`${n.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                    <n.icon size={24} />
                  </div>
                  <h4 className="font-black text-gray-900 mb-2">{n.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">{n.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100">
              <h4 className="font-black text-amber-900 flex items-center gap-2 mb-4 uppercase tracking-widest text-xs">
                <CheckCircle size={18} /> Daily Habits & Safety
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-amber-800 font-medium">
                <li className="flex items-center gap-2">❌ Avoid raw or undercooked foods</li>
                <li className="flex items-center gap-2">✅ Limit caffeine intake</li>
                <li className="flex items-center gap-2">❌ Absolutely no alcohol</li>
                <li className="flex items-center gap-2">✅ Stay hydrated (8-10 glasses)</li>
              </ul>
            </div>
          </div>
        );
      case '0-6 Months':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-inner">
                  <Milk size={32} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-gray-900">Exclusive Milk Nutrition</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    The WHO recommends exclusive breastfeeding for the first 6 months. Breast milk provides the perfect mix of nutrients and antibodies.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Breastfeeding</p>
                      <p className="text-xs text-gray-600 font-medium">Feed on demand (2-3 hours). Watch for hunger cues.</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Formula</p>
                      <p className="text-xs text-gray-600 font-medium">Use iron-fortified formula. Never prop bottles.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case '6-12 Months':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-4">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                  <Utensils size={24} />
                </div>
                <h3 className="text-xl font-black text-gray-900">Starting Solids</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  Introduce one new food every 3-5 days. Start with iron-fortified cereals, mashed avocado, banana, or sweet potato.
                </p>
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-3">
                  <Info size={18} className="text-orange-600 shrink-0" />
                  <p className="text-xs text-orange-800 font-bold uppercase tracking-tighter">Readiness: Good head control & curiosity</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-4">
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center">
                  <Soup size={24} />
                </div>
                <h3 className="text-xl font-black text-gray-900">Varied Textures</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  Around 8-10 months, transition to soft finger foods like cooked pasta or small banner pieces.
                </p>
                <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 flex items-center gap-3">
                  <CheckCircle size={18} className="text-teal-600 shrink-0" />
                  <p className="text-xs text-teal-800 font-bold uppercase tracking-tighter">Encourage self-feeding exploration</p>
                </div>
              </div>
            </div>
          </div>
        );
      case '1-3 Years':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-indigo-900 p-10 rounded-[3.5rem] text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0 shadow-inner">
                  <Scale size={48} />
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <h3 className="text-3xl font-black tracking-tight">Toddler Portions</h3>
                  <p className="text-indigo-100 text-lg opacity-80 font-medium leading-relaxed">
                    A toddler's stomach is small. Offer 3 small meals and 2 healthy snacks. A portion is about 1/4 of an adult serving.
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                <PieChart size={160} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-start gap-4">
                <Smile className="text-pink-500 shrink-0" size={24} />
                <div>
                  <h4 className="font-black text-gray-900 mb-1">Picky Eating Phase</h4>
                  <p className="text-sm text-gray-500 font-medium">Normal development! Keep offering a variety without pressure.</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-start gap-4">
                <Droplets className="text-blue-500 shrink-0" size={24} />
                <div>
                  <h4 className="font-black text-gray-900 mb-1">Beverage Habits</h4>
                  <p className="text-sm text-gray-500 font-medium">Whole milk until age 2. Limit sugary juices and prioritize water.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case '3-5 Years':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Calcium', desc: 'Milk, yogurt, and cheese for strong bone development.', icon: ShieldCheck, color: 'text-blue-600 bg-blue-50' },
                { title: 'Iron', desc: 'Lean meats and beans for continued growth energy.', icon: Flame, color: 'text-orange-600 bg-orange-50' },
                { title: 'Vitamin D', desc: 'Essential for calcium absorption and immunity.', icon: Sun, color: 'text-amber-600 bg-amber-50' }
              ].map((n, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 text-center space-y-3">
                  <div className={`${n.color} w-12 h-12 rounded-2xl flex items-center justify-center mx-auto`}>
                    <n.icon size={24} />
                  </div>
                  <h4 className="font-black text-gray-900 uppercase tracking-widest text-[10px]">{n.title}</h4>
                  <p className="text-xs text-gray-500 font-medium">{n.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[1.5rem] flex items-center justify-center shrink-0">
                <Apple size={40} />
              </div>
              <div>
                <h4 className="text-xl font-black text-gray-900 mb-2">Smart Snacking</h4>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Offer choices like apple slices, yogurt sticks, or whole-grain crackers. Avoid using sugary treats as rewards.
                </p>
              </div>
            </div>
          </div>
        );
      case '6-8 Years':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <GraduationCap size={32} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Powering Through School</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <h4 className="font-black text-gray-800 text-sm mb-2 flex items-center gap-2">
                    <Coffee size={18} className="text-amber-500" /> Breakfast Focus
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">Essential for focus. Oatmeal, eggs, or whole-wheat toast provide sustained energy.</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <h4 className="font-black text-gray-800 text-sm mb-2 flex items-center gap-2">
                    <Utensils size={18} className="text-pink-500" /> Lunch Prep
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">Pack a mix of protein, whole grains, and fresh fruit to avoid the mid-day slump.</p>
                </div>
              </div>
            </div>
            <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 flex items-center gap-6">
              <div className="w-12 h-12 bg-white text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                <Users size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black text-indigo-900">Family Mealtimes</h4>
                <p className="text-sm text-indigo-700 opacity-80 font-medium">Model healthy eating and encourage them to listen to fullness cues.</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
            <Sparkles size={14} className="text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Smart Nutrition Hub</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Nurturing <span className="text-indigo-600">Every Stage</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-xl">
            Evidence-based dietary guidance for a healthy journey from pregnancy through childhood.
          </p>
        </div>

        <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-xl border border-gray-100 shrink-0 overflow-x-auto no-scrollbar max-w-full">
          {STAGES.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStage(s)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeStage === s 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Main Stage Content */}
          {renderStageContent()}

          {/* AI Nutrition Insights */}
          <section className="bg-gradient-to-br from-indigo-50 to-white p-10 rounded-[3.5rem] shadow-sm border border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
              <Zap size={120} className="text-indigo-600" />
            </div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-indigo-100">
                  <Bolt size={28} fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">AI Nutrition Assistant</h2>
                  <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em]">Smart Insights for {activeStage}</p>
                </div>
              </div>
              <button 
                onClick={fetchTips}
                disabled={loadingTips}
                className="p-3 bg-white text-indigo-600 hover:bg-indigo-100 rounded-2xl transition-all border border-indigo-100 shadow-sm disabled:opacity-50"
              >
                <RefreshCw size={24} className={loadingTips ? "animate-spin" : ""} />
              </button>
            </div>

            {loadingTips ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
                <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Generating personalized menu...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                {aiTips.map((tip, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-[2rem] border border-indigo-50 hover:border-indigo-200 transition-all group flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest px-2.5 py-1 bg-indigo-50 rounded-lg">
                        {tip.category}
                      </span>
                      <Sparkles size={14} className="text-amber-400" />
                    </div>
                    <h3 className="font-black text-gray-900 text-sm mb-3 group-hover:text-indigo-600 transition-colors leading-snug">{tip.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium italic">
                      "{tip.content}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* Foods to Avoid Card */}
          <div className="bg-gray-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="relative z-10 space-y-8">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center border border-red-500/20 shadow-inner">
                   <Ban size={24} />
                 </div>
                 <h3 className="text-xl font-black tracking-tight">Safety Alert</h3>
               </div>
               
               <div className="space-y-4">
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Essential Prohibitions</p>
                 <ul className="space-y-3">
                    {[
                      'Raw or undercooked seafood',
                      'Unpasteurized dairy/cheese',
                      'High-mercury fish (Mackerel)',
                      'Excessive processed sugar'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        {item}
                      </li>
                    ))}
                 </ul>
               </div>

               <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  View Full Safety Guide
               </button>
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
               <ShieldCheck size={160} />
             </div>
          </div>

          {/* Hydration Tracker */}
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-black text-gray-900">Hydration</h4>
              <Droplets size={24} className="text-blue-500 animate-bounce" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-1">
                <span className="text-3xl font-black text-gray-900">5 / 10</span>
                <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Glasses</span>
              </div>
              <div className="h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100 shadow-inner">
                <div className="h-full bg-blue-500 w-[50%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)] transition-all duration-1000" />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-medium italic">
                Drinking water consistently helps maintain amniotic fluid levels and reduces swelling.
              </p>
            </div>
            <button className="w-full py-4 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-600 hover:text-white transition-all active:scale-95">
              Log 1 Glass
            </button>
          </div>

          {/* Calorie Calculator */}
          <div className="bg-amber-50 rounded-[3rem] p-8 border border-amber-100 space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-400 text-white rounded-xl flex items-center justify-center shadow-lg">
                  <PieChart size={20} fill="currentColor" />
                </div>
                <h4 className="text-lg font-black text-gray-900 tracking-tight">Macros Target</h4>
             </div>
             <div className="space-y-5">
                {[
                  { label: 'Proteins', current: 65, total: 100, color: 'bg-blue-500' },
                  { label: 'Carbs', current: 180, total: 250, color: 'bg-orange-500' }
                ].map((m, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <span>{m.label}</span>
                      <span>{m.current}g / {m.total}g</span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
                      <div className={`h-full ${m.color} transition-all duration-1000`} style={{ width: `${(m.current/m.total)*100}%` }} />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default NutritionGuide;
