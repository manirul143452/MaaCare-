import React, { useState, useEffect } from 'react';
import { ViewState, Appointment, UserProfile } from '../types';
import { 
  ArrowRight, 
  Baby, 
  Calendar, 
  Activity, 
  Utensils, 
  MessageCircle,
  Thermometer,
  ShieldCheck,
  Heart,
  Bolt,
  Video,
  Clock,
  CalendarCheck,
  Sparkles,
  Zap,
  ChevronRight,
  TrendingUp,
  Smile,
  Target,
  Bell,
  Navigation,
  // Added missing icon imports to fix compilation errors on lines 272, 337, and 405
  Users,
  CheckCircle2,
  Star
} from 'lucide-react';

interface Props {
  onNavigate: (view: ViewState) => void;
}

const Dashboard: React.FC<Props> = ({ onNavigate }) => {
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Load User
    const savedUser = localStorage.getItem('maacare_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    // Load Appointments
    const savedRaw = localStorage.getItem('maacare_appointments');
    if (savedRaw) {
      const appointments: Appointment[] = JSON.parse(savedRaw);
      const now = new Date();
      const upcoming = appointments
        .filter(app => app.status === 'Confirmed' && new Date(app.date + ' ' + (app.time === 'Now' ? '00:00' : app.time)) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setUpcomingAppointments(upcoming);
      if (upcoming.length > 0) {
        setNextAppointment(upcoming[0]);
      }
    }
  }, []);

  const quickStats = [
    { 
      label: 'Journey Progress', 
      value: 'Week 24', 
      sub: '2nd Trimester', 
      icon: Activity, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      view: ViewState.PREGNANCY_TRACKER 
    },
    { 
      label: 'Expert Care', 
      value: nextAppointment ? new Date(nextAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Book Now', 
      sub: nextAppointment ? nextAppointment.expertName : 'Ready to consult?', 
      icon: CalendarCheck, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      view: ViewState.MY_APPOINTMENTS 
    },
    { 
      label: 'Wellness Score', 
      value: 'Great', 
      sub: 'Daily goals met', 
      icon: Smile, 
      color: 'text-pink-600', 
      bg: 'bg-pink-50',
      view: ViewState.SELF_CARE 
    },
  ];

  const features = [
    { id: ViewState.SYMPTOM_CHECKER, title: 'AI Symptom Checker', desc: 'Fast clinical triage.', icon: Thermometer, color: 'bg-orange-500', isNew: false },
    { id: ViewState.AI_COMPANION, title: 'AI Companion', desc: 'Vision & voice enabled.', icon: MessageCircle, color: 'bg-teal-500', isNew: true },
    { id: ViewState.NUTRITION_GUIDE, title: 'Nutrition Guide', desc: 'Custom meal plans.', icon: Utensils, color: 'bg-green-500', isNew: false },
    { id: ViewState.EXPERT_CONSULTATION, title: 'Expert Match', desc: 'Find your specialist.', icon: Target, color: 'bg-indigo-600', isNew: false },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      
      {/* Dynamic Welcome Hero */}
      <section className="relative overflow-hidden bg-gray-900 rounded-[3.5rem] p-10 md:p-14 text-white shadow-2xl">
        {/* Background Visuals */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[100%] bg-pink-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[80%] bg-indigo-500 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
              <Sparkles size={14} className="text-amber-300" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Welcome to MaaCare Premium</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-400">{user?.name || 'Maya'}</span>! 🌸
              </h1>
              <p className="text-indigo-100/70 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
                You're in <span className="text-white font-bold">{user?.stage || 'Trimester 2'}</span>. Your baby is the size of a <span className="text-amber-300 underline underline-offset-4 decoration-amber-300/30">pomegranate</span> today. 
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onNavigate(ViewState.PRENATAL_YOGA)}
                className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-3 shadow-xl active:scale-95"
              >
                Start Daily Yoga <ArrowRight size={18} className="text-pink-500" />
              </button>
              <button 
                onClick={() => onNavigate(ViewState.AI_COMPANION)}
                className="bg-white/10 backdrop-blur-xl text-white border border-white/20 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-3 active:scale-95"
              >
                <MessageCircle size={18} /> Ask AI Anything
              </button>
            </div>
          </div>

          {/* Featured Insight Card */}
          <div className="lg:w-1/3 w-full">
            <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl space-y-6 relative group overflow-hidden">
               <div className="flex items-center justify-between mb-2">
                 <div className="w-12 h-12 bg-amber-400 text-indigo-950 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                   <Baby size={24} />
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] font-black uppercase text-indigo-300 tracking-widest">Growth Milestone</p>
                   <p className="text-xs font-bold text-white">Week 24 Insight</p>
                 </div>
               </div>
               <p className="text-sm font-medium text-indigo-50 leading-relaxed italic">
                 "Your baby's hearing is now fully functional! They can recognize your voice and respond to music."
               </p>
               <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500 w-[60%] rounded-full animate-shimmer" />
               </div>
               <button 
                onClick={() => onNavigate(ViewState.PREGNANCY_TRACKER)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
               >
                 View Journey Details
               </button>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <Heart className="absolute -right-16 -bottom-16 w-80 h-80 text-white opacity-[0.03] rotate-12 pointer-events-none" fill="currentColor" />
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {quickStats.map((stat, i) => (
          <button 
            key={i} 
            onClick={() => onNavigate(stat.view)}
            className="group bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 text-left transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95"
          >
            <div className={`${stat.bg} ${stat.color} p-5 rounded-[1.75rem] transition-transform group-hover:scale-110 shadow-inner`}>
              <stat.icon size={32} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
              <p className="text-xs text-gray-500 font-medium">{stat.sub}</p>
            </div>
          </button>
        ))}
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Features & Appointments (Left Side) */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Active Consultation Notification */}
          {nextAppointment && (
            <div className="bg-indigo-600 rounded-[3rem] p-8 text-white shadow-2xl shadow-indigo-200 border border-indigo-500 flex flex-col md:flex-row items-center justify-between gap-8 group animate-in slide-in-from-left-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img src={nextAppointment.expertImage} className="w-20 h-20 rounded-[1.5rem] object-cover border-4 border-white/20 shadow-xl group-hover:scale-105 transition-transform" alt="" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-indigo-600 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Upcoming Session</span>
                    <div className="px-2 py-0.5 bg-white/20 rounded-md text-[8px] font-black uppercase tracking-widest backdrop-blur-sm">Live Soon</div>
                  </div>
                  <h4 className="text-2xl font-black tracking-tight">{nextAppointment.expertName}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-indigo-100 font-medium">
                    <div className="flex items-center gap-1.5"><Clock size={16} className="text-indigo-300" /> {nextAppointment.time}</div>
                    <div className="flex items-center gap-1.5"><Calendar size={16} className="text-indigo-300" /> {new Date(nextAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onNavigate(ViewState.MY_APPOINTMENTS)}
                className="w-full md:w-auto bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-50 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <Video size={18} /> Join Virtual Room
              </button>
            </div>
          )}

          {/* Essential Features Grid */}
          <section>
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Essential Services</h2>
              <button 
                onClick={() => onNavigate(ViewState.PREGNANCY_TRACKER)}
                className="text-pink-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-all"
              >
                View Hub <ChevronRight size={16}/>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => onNavigate(feature.id)}
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-left hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
                    <feature.icon size={80} className="text-gray-900" />
                  </div>
                  
                  {feature.isNew && (
                    <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-600 rounded-full border border-teal-100 shadow-sm">
                      <Zap size={10} fill="currentColor" />
                      <span className="text-[9px] font-black uppercase tracking-tighter">New Feature</span>
                    </div>
                  )}

                  <div className={`${feature.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mb-6 shadow-xl shadow-gray-100 group-hover:rotate-6 transition-all`}>
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium max-w-[80%]">{feature.desc}</p>
                  
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                    Access Tool <ArrowRight size={14} />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Community Section */}
          <section className="bg-white rounded-[3.5rem] p-10 border border-gray-100 flex flex-col md:flex-row items-center gap-12 shadow-sm">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 bg-pink-50 px-4 py-1.5 rounded-full border border-pink-100">
                <Users size={14} className="text-pink-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-600">Global Community</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">MaaCare Parents Park</h2>
              <p className="text-gray-500 text-lg font-medium leading-relaxed">
                Connect with over <span className="text-gray-900 font-black">12,000+</span> parents. Share milestones, ask for advice, or just share your daily journey.
              </p>
              
              <div className="flex -space-x-4 mb-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="relative group">
                    <img 
                      src={`https://picsum.photos/seed/face${i}/60/60`} 
                      className="w-14 h-14 rounded-2xl border-4 border-white shadow-xl hover:-translate-y-2 transition-transform cursor-pointer"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
                <div className="w-14 h-14 rounded-2xl bg-indigo-900 text-white flex flex-col items-center justify-center text-[10px] font-black border-4 border-white shadow-xl relative z-10">
                  <span>+12k</span>
                  <span className="opacity-50 scale-75">Users</span>
                </div>
              </div>
              
              <button 
                 onClick={() => onNavigate(ViewState.PARENTS_PARK)}
                 className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
              >
                Enter Park
              </button>
            </div>
            
            <div className="w-full md:w-80 space-y-4">
              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-4 shadow-inner">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group cursor-pointer hover:border-pink-200 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping" />
                    <span className="text-[9px] font-black text-pink-600 uppercase tracking-widest">Trending Now</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800 leading-snug">"Hospital bag essentials: What I actually used..."</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">124 Comments • Just now</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                  <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest block mb-2">Recent Support</span>
                  <p className="text-sm font-bold text-gray-800 leading-snug">"Sleep training tips for 4-month-olds?"</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar (Right Side) */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* Health Insights Card */}
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden">
             <div className="flex items-center justify-between">
               <h3 className="text-xl font-black text-gray-900 tracking-tight">Today's Focus</h3>
               <Bell size={20} className="text-gray-300 hover:text-pink-500 transition-colors cursor-pointer" />
             </div>
             
             <div className="space-y-6">
                <div className="flex items-start gap-5 group cursor-pointer">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-green-600 group-hover:text-white transition-all">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="flex-1 border-b border-gray-50 pb-4 group-last:border-0">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Health Tracker</p>
                    <p className="text-sm font-bold text-gray-800">Prenatal Vitamins</p>
                    <p className="text-xs text-green-600 mt-1 font-bold uppercase tracking-tighter">Logged: 08:30 AM</p>
                  </div>
                </div>

                <div className="flex items-start gap-5 group cursor-pointer">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Navigation size={24} />
                  </div>
                  <div className="flex-1 border-b border-gray-50 pb-4 group-last:border-0">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Activity Goal</p>
                    <p className="text-sm font-bold text-gray-800">10 min Gentle Walk</p>
                    <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 w-[70%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-5 group cursor-pointer">
                  <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-pink-600 group-hover:text-white transition-all">
                    <Heart size={24} />
                  </div>
                  <div className="flex-1 group-last:border-0">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mental Wellness</p>
                    <p className="text-sm font-bold text-gray-800">Breathing Exercise</p>
                    <button className="mt-3 px-4 py-2 bg-pink-50 text-pink-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-pink-100 hover:bg-pink-600 hover:text-white transition-all">
                      Start 5m Session
                    </button>
                  </div>
                </div>
             </div>
             
             <div className="absolute top-[-20px] right-[-20px] opacity-5 pointer-events-none rotate-45">
               <TrendingUp size={160} className="text-gray-900" />
             </div>
          </div>

          {/* Quick AI Assist Card */}
          <div className="bg-indigo-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group cursor-pointer" onClick={() => onNavigate(ViewState.AI_COMPANION)}>
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-110 transition-transform">
                 <Bolt size={32} className="text-amber-300" fill="currentColor" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black tracking-tight">Rapid AI Triage</h4>
                <p className="text-indigo-100/70 text-sm leading-relaxed font-medium">
                  Got a sudden symptom or concern? Ask our multimodal AI and get clinical guidance in seconds.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
                Open Assistant <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
              <Sparkles size={120} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Ad/Promo Section */}
          <div className="bg-amber-50 rounded-[3rem] p-8 border border-amber-100 space-y-6">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-400 text-white rounded-xl flex items-center justify-center shadow-lg">
                  <Star size={20} fill="currentColor" />
                </div>
                <h4 className="text-lg font-black text-gray-900">MaaCare Rewards</h4>
             </div>
             <p className="text-gray-600 text-xs font-medium leading-relaxed">
               You're only <span className="text-amber-600 font-bold">250 points</span> away from your next complimentary expert consultation!
             </p>
             <div className="w-full bg-gray-200/50 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 w-[75%] rounded-full shadow-inner" />
             </div>
             <button className="w-full py-4 bg-white border border-amber-200 text-amber-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all active:scale-95 shadow-sm">
                Redeem Rewards
             </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
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

export default Dashboard;