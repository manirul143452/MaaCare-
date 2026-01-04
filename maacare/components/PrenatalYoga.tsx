
import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  Activity, 
  ArrowRight, 
  Heart, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Flame, 
  ShieldCheck,
  Zap,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface PoseDetail {
  id: string;
  title: string;
  instructions: string[];
  benefits: string;
  evidence: string;
  duration: string;
  calories: string;
  precautions: string;
  level: 'Beginner' | 'Intermediate' | 'All Levels';
  trimester: 1 | 2 | 3 | 'all';
  image: string;
}

const YOGA_DATA: PoseDetail[] = [
  // 1st Trimester
  {
    id: 'cat-cow',
    title: 'Cat-Cow Pose',
    trimester: 1,
    level: 'Beginner',
    duration: '5-10 min',
    calories: '20-30 kcal',
    image: 'https://picsum.photos/seed/yoga-cat/600/400',
    instructions: [
      "Start on all fours with wrists under shoulders and knees under hips.",
      "Inhale: Drop your belly, lift your chest, and look up (Cow).",
      "Exhale: Round your spine, press the mat away, and tuck your chin (Cat).",
      "Flow between these two, following your breath."
    ],
    benefits: "Relieves back pain, improves spinal flexibility, and gently massages abdominal organs.",
    evidence: "ACOG recommends gentle stretching like Cat-Cow to alleviate common pregnancy discomforts like backaches.",
    precautions: "Move slowly. Avoid over-arching. If you have wrist pain, use fists instead of flat palms."
  },
  {
    id: 'childs-pose',
    title: "Child's Pose",
    trimester: 1,
    level: 'Beginner',
    duration: '3-5 min',
    calories: 'Minimal',
    image: 'https://picsum.photos/seed/yoga-child/600/400',
    instructions: [
      "Kneel, touch big toes together, sit on your heels.",
      "Spread knees wide enough for your belly.",
      "Exhale and lay your torso down between your thighs.",
      "Rest forehead on floor, arms forward or alongside."
    ],
    benefits: "Gently stretches hips and back, calms the mind, and relieves fatigue.",
    evidence: "Restorative poses activate the parasympathetic nervous system, reducing cortisol levels.",
    precautions: "Use a pillow under your hips if needed. Avoid if you have acute knee injuries."
  },
  {
    id: 'warrior-2',
    title: 'Warrior II Pose',
    trimester: 1,
    level: 'Intermediate',
    duration: '5 min',
    calories: '30-40 kcal',
    image: 'https://picsum.photos/seed/yoga-warrior/600/400',
    instructions: [
      "Stand with feet wide apart.",
      "Turn right foot out 90 degrees, left foot in slightly.",
      "Bend right knee over ankle, shin vertical.",
      "Extend arms parallel to floor, gaze over right hand."
    ],
    benefits: "Strengthens legs, opens hips and chest, builds stamina.",
    evidence: "Standing poses build lower body strength essential for supporting pregnancy weight.",
    precautions: "Don't bend front knee past ankle. Practice near a wall if balance is unstable."
  },

  // 2nd Trimester
  {
    id: 'goddess',
    title: 'Goddess Pose',
    trimester: 2,
    level: 'Intermediate',
    duration: '5 min',
    calories: '40-50 kcal',
    image: 'https://picsum.photos/seed/yoga-goddess/600/400',
    instructions: [
      "Stand with feet wide, toes pointing out.",
      "Exhale and bend knees, lowering hips into a squat.",
      "Keep knees tracking in same direction as toes.",
      "Hands at heart center or bent arms at 90 degrees."
    ],
    benefits: "Strengthens pelvic floor, inner thighs, and quadriceps.",
    evidence: "Pelvic floor strength is crucial for labor preparation and postpartum recovery.",
    precautions: "Go only as deep as comfortable. Avoid if you have pubic symphysis pain."
  },
  {
    id: 'triangle',
    title: 'Triangle Pose',
    trimester: 2,
    level: 'Intermediate',
    duration: '5 min',
    calories: '25-35 kcal',
    image: 'https://picsum.photos/seed/yoga-triangle/600/400',
    instructions: [
      "Feet wide, right foot forward. Reach forward over right leg.",
      "Hinge at hip, bringing right hand to shin or block.",
      "Extend left arm to ceiling, gazing up if comfortable."
    ],
    benefits: "Stretches hamstrings and spine. Relieves backache.",
    evidence: "Side-body stretches create space for the growing baby and relieve rib cage pressure.",
    precautions: "Use a yoga block for support. Keep stance wide for balance."
  },

  // 3rd Trimester
  {
    id: 'supported-squat',
    title: 'Supported Squat',
    trimester: 3,
    level: 'All Levels',
    duration: '5 min',
    calories: '20-30 kcal',
    image: 'https://picsum.photos/seed/yoga-squat/600/400',
    instructions: [
      "Feet wider than hips, toes out.",
      "Hold a sturdy chair or countertop for support.",
      "Slowly lower hips into a deep squat.",
      "Keep heels on floor or use a rolled towel under them."
    ],
    benefits: "Prepares pelvic floor for birth, increases circulation to pelvis.",
    evidence: "Squatting is a traditional birthing position that helps open the pelvic outlet.",
    precautions: "Avoid if baby is in breech position after 34 weeks. Always use support."
  },
  {
    id: 'side-savasana',
    title: 'Side-Lying Savasana',
    trimester: 3,
    level: 'Beginner',
    duration: '10-20 min',
    calories: 'Minimal',
    image: 'https://picsum.photos/seed/yoga-rest/600/400',
    instructions: [
      "Lie on your left side (maximizes blood flow to baby).",
      "Place a pillow between knees and under your head.",
      "Hug a bolster for belly support.",
      "Focus on deep, relaxing breaths."
    ],
    benefits: "Restorative. Relieves pressure on the vena cava.",
    evidence: "ACOG recommends side-lying as the safest resting position in late pregnancy.",
    precautions: "Ensure full support with pillows for maximum comfort."
  },
  {
    id: 'golden-breath',
    title: 'Golden Thread Breath',
    trimester: 3,
    level: 'Beginner',
    duration: '5-10 min',
    calories: 'Minimal',
    image: 'https://picsum.photos/seed/yoga-breath/600/400',
    instructions: [
      "Inhale slowly through your nose.",
      "Purse lips as if blowing through a straw.",
      "Exhale very slowly through pursed lips.",
      "Visualize breath as a long, golden thread."
    ],
    benefits: "Reduces labor anxiety and pain perception.",
    evidence: "Controlled breathing helps manage the 'fight or flight' response during contractions.",
    precautions: "Never hold your breath. If dizzy, return to normal breathing."
  }
];

const PrenatalYoga: React.FC = () => {
  const [selectedTrimester, setSelectedTrimester] = useState<'all' | 1 | 2 | 3>('all');
  const [selectedPose, setSelectedPose] = useState<PoseDetail | null>(null);

  const filteredPoses = selectedTrimester === 'all' 
    ? YOGA_DATA 
    : YOGA_DATA.filter(r => r.trimester === selectedTrimester || r.trimester === 'all');

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-pink-50 px-4 py-1.5 rounded-full border border-pink-100">
            <Sparkles size={14} className="text-pink-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-pink-600">Clinical Prenatal Care</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Prenatal <span className="text-pink-600">Yoga Sanctuary</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-xl">
            Safe, evidence-based guided exercises designed for every milestone of your journey.
          </p>
        </div>

        <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-xl border border-gray-100 shrink-0">
          {['all', 1, 2, 3].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTrimester(t as any)}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                selectedTrimester === t 
                  ? 'bg-pink-600 text-white shadow-lg' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {t === 'all' ? 'All Stages' : `Trimester ${t}`}
            </button>
          ))}
        </div>
      </header>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredPoses.map((pose) => (
          <div 
            key={pose.id} 
            onClick={() => setSelectedPose(pose)}
            className="group bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer relative flex flex-col"
          >
            <div className="relative h-64 overflow-hidden">
              <img src={pose.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={pose.title} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-pink-600 shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-300">
                  <Play size={28} fill="currentColor" />
                </div>
              </div>
              <div className="absolute top-6 left-6">
                <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black text-gray-800 shadow-xl uppercase tracking-widest border border-white/20">
                  Trimester {pose.trimester === 'all' ? '1-3' : pose.trimester}
                </span>
              </div>
            </div>

            <div className="p-8 space-y-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-pink-600 transition-colors">{pose.title}</h3>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-pink-600 bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-100 uppercase tracking-widest">
                   <Clock size={14} /> {pose.duration}
                </div>
              </div>
              
              <p className="text-gray-500 text-sm font-medium leading-relaxed italic line-clamp-2">
                "{pose.benefits}"
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-50 mt-auto">
                 <div className="flex items-center gap-2">
                   <Activity size={16} className="text-indigo-500" />
                   <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{pose.level}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Flame size={16} className="text-orange-500" />
                   <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{pose.calories}</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Section */}
      <section className="bg-indigo-950 rounded-[4rem] p-10 md:p-14 text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
        <div className="w-24 h-24 bg-white/10 backdrop-blur-xl text-indigo-400 rounded-[2.5rem] flex items-center justify-center shadow-inner border border-white/10 shrink-0">
          <ShieldCheck size={56} />
        </div>
        <div className="flex-1 text-center md:text-left space-y-4">
          <h2 className="text-3xl font-black tracking-tight flex items-center justify-center md:justify-start gap-3">
            Yoga Safety Standards <Sparkles size={24} className="text-amber-400" />
          </h2>
          <p className="text-indigo-100 text-lg leading-relaxed font-medium opacity-80 max-w-2xl">
            Always listen to your body. Avoid poses that cause strain. Stay hydrated and consult your OB-GYN before starting, especially if you have a high-risk pregnancy. All routines are verified by our clinical council.
          </p>
        </div>
        <button className="bg-white text-indigo-950 px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95 shrink-0">
          Clinical Guidelines
        </button>
        <Heart className="absolute -right-20 -bottom-20 w-80 h-80 text-white/5 rotate-12" fill="currentColor" />
      </section>

      {/* Pose Detail Modal */}
      {selectedPose && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
           <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-xl" onClick={() => setSelectedPose(null)} />
           <div className="bg-white w-full max-w-5xl rounded-[4rem] shadow-2xl relative z-10 overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 duration-300">
              
              {/* Image Side */}
              <div className="lg:w-2/5 relative h-64 lg:h-auto">
                 <img src={selectedPose.image} className="w-full h-full object-cover" alt="" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                 <div className="absolute bottom-8 left-8 text-white space-y-2">
                    <span className="px-3 py-1 bg-pink-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Trimester {selectedPose.trimester}</span>
                    <h3 className="text-4xl font-black">{selectedPose.title}</h3>
                 </div>
              </div>

              {/* Info Side */}
              <div className="flex-1 p-8 md:p-14 overflow-y-auto max-h-[80vh] lg:max-h-[unset] no-scrollbar">
                 <button 
                  onClick={() => setSelectedPose(null)}
                  className="absolute top-8 right-8 p-3 hover:bg-gray-50 rounded-2xl transition-colors"
                 >
                   <X size={24} className="text-gray-400" />
                 </button>

                 <div className="space-y-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
                          <Clock className="text-pink-500 mb-2" size={20} />
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration</p>
                          <p className="text-sm font-black text-gray-800">{selectedPose.duration}</p>
                       </div>
                       <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
                          <Flame className="text-orange-500 mb-2" size={20} />
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Calories</p>
                          <p className="text-sm font-black text-gray-800">{selectedPose.calories}</p>
                       </div>
                       <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center col-span-2 md:col-span-1">
                          <Activity className="text-indigo-500 mb-2" size={20} />
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Effort</p>
                          <p className="text-sm font-black text-gray-800">{selectedPose.level}</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                         <Zap size={16} className="text-amber-500" /> Step-by-Step Instructions
                       </h4>
                       <div className="space-y-3">
                          {selectedPose.instructions.map((step, idx) => (
                            <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-all">
                               <span className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-xs font-black text-indigo-600 shadow-sm shrink-0">
                                 {idx + 1}
                               </span>
                               <p className="text-sm text-gray-600 font-medium leading-relaxed">{step}</p>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Heart size={16} className="text-pink-500" /> Benefits
                          </h4>
                          <p className="text-sm text-gray-600 font-medium leading-relaxed bg-pink-50/50 p-5 rounded-3xl border border-pink-100/50">
                             {selectedPose.benefits}
                          </p>
                       </div>
                       <div className="space-y-4">
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Info size={16} className="text-indigo-500" /> Evidence
                          </h4>
                          <p className="text-sm text-gray-600 font-medium leading-relaxed bg-indigo-50/50 p-5 rounded-3xl border border-indigo-100/50">
                             {selectedPose.evidence}
                          </p>
                       </div>
                    </div>

                    <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex items-start gap-6">
                       <div className="w-12 h-12 bg-white text-amber-500 rounded-2xl flex items-center justify-center shadow-sm shrink-0 border border-amber-100">
                          <AlertTriangle size={24} />
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest">Safety Precautions</h4>
                          <p className="text-xs text-amber-800 leading-relaxed font-medium">{selectedPose.precautions}</p>
                       </div>
                    </div>

                    <button 
                      className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-95"
                    >
                      <Play size={18} fill="currentColor" /> Begin Video Guidance
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

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

export default PrenatalYoga;
