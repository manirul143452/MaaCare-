
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  Bell, 
  CheckCircle2, 
  Circle, 
  Baby, 
  Sparkles, 
  ChevronRight, 
  Info,
  Activity,
  User,
  Heart,
  // Added missing Clock icon import
  Clock
} from 'lucide-react';

interface Vaccine {
  name: string;
  protects: string;
  age: string;
  details: string;
  status: 'Completed' | 'Upcoming' | 'Planned';
}

const CHILD_SCHEDULE: Record<string, Vaccine[]> = {
  "At Birth": [
    { name: 'BCG', protects: 'Tuberculosis', age: 'At Birth', details: 'Protects from severe childhood forms of TB. Given as early as possible till 1 year.', status: 'Completed' },
    { name: 'Hepatitis B (Birth Dose)', protects: 'Hepatitis B', age: 'At Birth', details: 'Given within 24 hours of birth.', status: 'Completed' },
    { name: 'Oral Polio Vaccine (OPV-0)', protects: 'Poliomyelitis (Polio)', age: 'At Birth', details: 'Given within the first 15 days.', status: 'Completed' },
  ],
  "6, 10 & 14 Weeks": [
    { name: 'OPV 1, 2 & 3', protects: 'Polio', age: '6, 10, 14 Weeks', details: 'Three oral doses. Can be given till 5 years.', status: 'Upcoming' },
    { name: 'Pentavalent 1, 2 & 3', protects: 'Diphtheria, Tetanus, Pertussis, HepB, Hib', age: '6, 10, 14 Weeks', details: 'Three doses given till one year of age.', status: 'Upcoming' },
    { name: 'Rotavirus (RV)', protects: 'Rotavirus Diarrhea', age: '6, 10, 14 Weeks', details: 'Three doses given as oral drops.', status: 'Upcoming' },
    { name: 'Pneumococcal Conjugate (PCV)', protects: 'Pneumococcal Disease', age: '6 & 14 Weeks', details: 'Two primary doses plus a booster at 9-12 months.', status: 'Planned' },
    { name: 'Inactivated Polio (IPV)', protects: 'Polio', age: '6 & 14 Weeks', details: 'Two fractional doses given intradermally.', status: 'Planned' },
  ],
  "9-12 Months": [
    { name: 'MR 1st Dose', protects: 'Measles, Rubella', age: '9-12 Months', details: 'Given between 9 and 12 completed months.', status: 'Planned' },
    { name: 'Japanese Encephalitis (JE-1)', protects: 'JE', age: '9-12 Months', details: 'Only in endemic districts.', status: 'Planned' },
    { name: 'Vitamin A (1st Dose)', protects: 'Vitamin A Deficiency', age: '9 Months', details: 'Prevents blindness; given with MR vaccine.', status: 'Planned' },
  ],
  "16-24 Months": [
    { name: 'DPT Booster 1', protects: 'Diphtheria, Pertussis, Tetanus', age: '16-24 Months', details: 'First booster dose.', status: 'Planned' },
    { name: 'MR 2nd Dose', protects: 'Measles, Rubella', age: '16-24 Months', details: 'Second dose for immunity.', status: 'Planned' },
    { name: 'OPV Booster', protects: 'Polio', age: '16-24 Months', details: 'Booster dose.', status: 'Planned' },
    { name: 'Vitamin A (2nd Dose)', protects: 'Vision & Immunity', age: '16-18 Months', details: 'One dose every 6 months till age 5.', status: 'Planned' },
  ],
  "5-16 Years": [
    { name: 'DPT Booster 2', protects: 'Diphtheria, Pertussis, Tetanus', age: '5-6 Years', details: 'Second booster dose.', status: 'Planned' },
    { name: 'TT (10 Years)', protects: 'Tetanus', age: '10 Years', details: 'Tetanus-Toxoid dose.', status: 'Planned' },
    { name: 'TT (16 Years)', protects: 'Tetanus', age: '16 Years', details: 'Final pediatric tetanus dose.', status: 'Planned' },
  ]
};

const MOTHER_SCHEDULE: Vaccine[] = [
  { name: 'TT-1 (Tetanus Toxoid)', protects: 'Tetanus', age: 'Early Pregnancy', details: 'First dose to protect both mother and newborn.', status: 'Completed' },
  { name: 'TT-2 (Tetanus Toxoid)', protects: 'Tetanus', age: '4 Weeks after TT-1', details: 'Completes primary course.', status: 'Upcoming' },
  { name: 'TT-Booster', protects: 'Tetanus', age: 'If pregnant <3 yrs ago', details: 'Only if 2 doses were received in previous pregnancy.', status: 'Planned' },
];

const VaccinationTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Child' | 'Mother'>('Child');

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 px-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
            <Sparkles size={14} className="text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Clinical Immunization Hub</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Stay <span className="text-indigo-600">Shielded</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-xl">
            Track essential vaccinations for both mother and child following local clinical standards.
          </p>
        </div>

        <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-xl border border-gray-100 shrink-0">
          <button
            onClick={() => setActiveTab('Child')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === 'Child' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            <Baby size={16} /> For Child
          </button>
          <button
            onClick={() => setActiveTab('Mother')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === 'Mother' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            <Heart size={16} /> For Mother
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'Child' ? (
          <div className="space-y-12">
            {Object.entries(CHILD_SCHEDULE).map(([ageGroup, vaccines]) => (
              <section key={ageGroup} className="space-y-6">
                <div className="flex items-center gap-4 px-2">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                    <Calendar size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-800 tracking-tight">{ageGroup}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vaccines.map((v, i) => (
                    <div key={i} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
                          v.status === 'Completed' ? 'bg-green-100 text-green-600' : 
                          v.status === 'Upcoming' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <ShieldCheck size={24} />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl border ${
                          v.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 
                          v.status === 'Upcoming' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                        }`}>
                          {v.status}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-black text-gray-900 mb-2">{v.name}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">Protects: {v.protects}</span>
                      </div>
                      
                      <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6 flex-1 italic">
                        "{v.details}"
                      </p>
                      
                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                         <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{v.age}</span>
                         <button className="p-2 text-gray-300 hover:text-indigo-600 transition-colors">
                            <Info size={16} />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
             <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
               <div className="p-6 bg-gray-50/50 flex items-center justify-between">
                  <h2 className="text-xl font-black text-gray-800 tracking-tight">Maternal Immunization</h2>
                  <Activity size={24} className="text-pink-500" />
               </div>
               {MOTHER_SCHEDULE.map((v, i) => (
                 <div key={i} className="p-8 flex flex-col md:flex-row items-center gap-8 hover:bg-gray-50/30 transition-colors group">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                     v.status === 'Completed' ? 'bg-green-100 text-green-600' : 
                     v.status === 'Upcoming' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'
                   }`}>
                     <ShieldCheck size={28} />
                   </div>
                   <div className="flex-1 space-y-1 text-center md:text-left">
                     <h3 className="text-xl font-black text-gray-900">{v.name}</h3>
                     <p className="text-sm text-gray-500 font-medium leading-relaxed">{v.details}</p>
                     <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                           <Clock size={12} /> {v.age}
                        </span>
                        <span className="text-[10px] font-black uppercase text-pink-500 flex items-center gap-2">
                           <Activity size={12} /> {v.protects}
                        </span>
                     </div>
                   </div>
                   <div className="shrink-0 flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${
                        v.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-white text-gray-300 border-gray-100'
                      }`}>
                         {v.status}
                      </span>
                      <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100">
                        <ChevronRight size={18} />
                      </button>
                   </div>
                 </div>
               ))}
             </div>

             <section className="bg-indigo-950 rounded-[4rem] p-10 md:p-14 text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-xl text-indigo-400 rounded-[2.5rem] flex items-center justify-center shadow-inner border border-white/10 shrink-0">
                  <ShieldCheck size={56} />
                </div>
                <div className="flex-1 text-center md:text-left space-y-4">
                  <h2 className="text-3xl font-black tracking-tight">Why Vaccinate?</h2>
                  <p className="text-indigo-100 text-lg leading-relaxed font-medium opacity-80 max-w-2xl">
                    Vaccines protect your baby from 14 serious diseases before their second birthday. They are safe, effective, and the best way to ensure a healthy start in life.
                  </p>
                </div>
                <button className="bg-white text-indigo-950 px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95 shrink-0">
                  Clinical Benefits
                </button>
                <Heart className="absolute -right-20 -bottom-20 w-80 h-80 text-white/5 rotate-12" fill="currentColor" />
              </section>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default VaccinationTracker;
