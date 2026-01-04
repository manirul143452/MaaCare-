
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Star, 
  Calendar, 
  Video, 
  MessageCircle, 
  Filter, 
  ShieldCheck, 
  Clock, 
  Bolt, 
  Sparkles,
  Loader2,
  ChevronRight,
  X,
  CheckCircle,
  CalendarDays,
  Zap,
  Award,
  Users,
  Heart,
  Stethoscope,
  ArrowRight,
  Target,
  GraduationCap,
  Medal,
  ThumbsUp
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Appointment } from '../types';

const SPECIALTIES = [
  "All Specialists",
  "My Favorites",
  "Obstetrics & Gynecology",
  "Pediatrics",
  "Lactation Consultant",
  "Mental Health",
  "Nutritionist"
];

const EXPERTS = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Obstetrics & Gynecology",
    experience: "12 years",
    rating: 4.9,
    reviews: 124,
    price: "$50",
    status: "Online",
    bio: "Specializing in prenatal care and high-risk pregnancies with a compassionate, patient-first approach.",
    education: "Johns Hopkins University",
    image: "https://picsum.photos/seed/doc1/200/200"
  },
  {
    id: 2,
    name: "Dr. James Wilson",
    specialty: "Pediatrics",
    experience: "8 years",
    rating: 4.8,
    reviews: 89,
    price: "$45",
    status: "Busy",
    bio: "Passionate about child development and early childhood nutrition. Dedicated to keeping your little ones healthy.",
    education: "Stanford Medical School",
    image: "https://picsum.photos/seed/doc2/200/200"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    specialty: "Lactation Consultant",
    experience: "15 years",
    rating: 5.0,
    reviews: 210,
    price: "$40",
    status: "Online",
    bio: "Helping new mothers find comfort and success in their breastfeeding journey through evidence-based support.",
    education: "IBCLC Certified",
    image: "https://picsum.photos/seed/doc3/200/200"
  },
  {
    id: 4,
    name: "Dr. Michael Chen",
    specialty: "Mental Health",
    experience: "10 years",
    rating: 4.7,
    reviews: 56,
    price: "$60",
    status: "Away",
    bio: "Specializing in postpartum depression and maternal anxiety. Providing a safe space for mental wellness.",
    education: "Harvard University",
    image: "https://picsum.photos/seed/doc4/200/200"
  },
  {
    id: 5,
    name: "Dr. Priya Sharma",
    specialty: "Nutritionist",
    experience: "7 years",
    rating: 4.9,
    reviews: 142,
    price: "$35",
    status: "Online",
    bio: "Creating personalized nutrition plans for mothers-to-be and growing infants. Food is medicine.",
    education: "Yale University",
    image: "https://picsum.photos/seed/doc5/200/200"
  },
  {
    id: 6,
    name: "Dr. Robert Miller",
    specialty: "Obstetrics & Gynecology",
    experience: "20 years",
    rating: 4.9,
    reviews: 432,
    price: "$75",
    status: "Busy",
    bio: "Senior consultant with extensive experience in surgical obstetrics and complicated labor management.",
    education: "Columbia University",
    image: "https://picsum.photos/seed/doc6/200/200"
  }
];

const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];
const FAVORITES_STORAGE_KEY = 'maacare_favorite_experts';

interface Props {
  onConsultNow?: (appointment: Appointment) => void;
}

const ExpertConsultation: React.FC<Props> = ({ onConsultNow }) => {
  const [activeSpecialty, setActiveSpecialty] = useState("All Specialists");
  const [aiMatching, setAiMatching] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{ category: string, text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  
  // Booking State
  const [bookingExpert, setBookingExpert] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (saved) {
      try {
        setFavoriteIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  // Sync favorites with localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (id: number) => {
    setFavoriteIds(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleAiMatch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const concern = formData.get('concern') as string;
    if (!concern) return;

    setAiMatching(true);
    setAiRecommendation(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `User concern: "${concern}". 
        From this list: "Obstetrics & Gynecology", "Pediatrics", "Lactation Consultant", "Mental Health", "Nutritionist", recommend the BEST category match.
        Format your response EXACTLY like this: [CATEGORY_NAME] - [ONE_SENTENCE_EXPLANATION]`,
      });
      
      const raw = response.text || "";
      const match = raw.match(/\[(.*?)\] - (.*)/);
      
      if (match) {
        setAiRecommendation({
          category: match[1],
          text: match[2]
        });
      } else {
        setAiRecommendation({
          category: "All Specialists",
          text: raw
        });
      }
    } catch (err) {
      console.error(err);
      setAiRecommendation({
        category: "All Specialists",
        text: "I recommend consulting a general practitioner first for an initial assessment."
      });
    } finally {
      setAiMatching(false);
    }
  };

  const handleBookSession = () => {
    if (!bookingExpert || !selectedTime) return;
    
    setIsBookingLoading(true);
    setTimeout(() => {
      const newAppointment: Appointment = {
        id: Math.random().toString(36).substr(2, 9),
        expertId: bookingExpert.id,
        expertName: bookingExpert.name,
        expertImage: bookingExpert.image,
        specialty: bookingExpert.specialty,
        date: selectedDate,
        time: selectedTime,
        status: 'Confirmed',
        price: bookingExpert.price
      };

      const existingAppointmentsRaw = localStorage.getItem('maacare_appointments');
      const existingAppointments: Appointment[] = existingAppointmentsRaw ? JSON.parse(existingAppointmentsRaw) : [];
      localStorage.setItem('maacare_appointments', JSON.stringify([...existingAppointments, newAppointment]));

      setIsBookingLoading(false);
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setBookingExpert(null);
        setSelectedTime(null);
      }, 3000);
    }, 1500);
  };

  const handleConsultNowInternal = (expert: any) => {
    if (onConsultNow) {
      onConsultNow({
        id: 'direct-' + Date.now(),
        expertId: expert.id,
        expertName: expert.name,
        expertImage: expert.image,
        specialty: expert.specialty,
        date: new Date().toISOString().split('T')[0],
        time: 'Now',
        status: 'Confirmed',
        price: expert.price
      });
    }
  };

  const filteredExperts = EXPERTS.filter(exp => {
    const matchesSearch = exp.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeSpecialty === "My Favorites") {
      return favoriteIds.includes(exp.id) && matchesSearch;
    }
    const matchesSpecialty = activeSpecialty === "All Specialists" || exp.specialty === activeSpecialty;
    return matchesSpecialty && matchesSearch;
  });

  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      full: d.toISOString().split('T')[0],
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate()
    };
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Expert Consultation</h1>
          <p className="text-gray-500 mt-2 text-lg">Speak with world-class specialists tailored to your needs.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="bg-green-50 px-5 py-3 rounded-2xl border border-green-100 flex items-center gap-2 shadow-sm">
            <ShieldCheck className="text-green-600 w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest text-green-800">Verified Clinical Network</span>
          </div>
          <div className="bg-indigo-50 px-5 py-3 rounded-2xl border border-indigo-100 flex items-center gap-2 shadow-sm">
            <Video className="text-indigo-600 w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest text-indigo-800">Direct Video Access</span>
          </div>
        </div>
      </div>

      {/* AI Matchmaker Banner */}
      <section className="bg-indigo-900 rounded-[3.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl border border-indigo-800/50">
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-3/5 space-y-8">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 px-4 py-1.5 rounded-full border border-indigo-400/30">
              <Sparkles size={14} className="text-indigo-300" />
              <span className="text-[10px] uppercase font-black tracking-widest text-indigo-200">Clinical Triage Engine</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-[1.1]">Match with the perfect specialist</h2>
            <p className="text-indigo-100/70 text-xl leading-relaxed max-w-xl font-medium">
              Describe your health concerns or symptoms, and our AI will identify the most qualified category for your care.
            </p>
            
            <form onSubmit={handleAiMatch} className="flex gap-2 p-2 bg-white/10 rounded-[2rem] border border-white/20 focus-within:bg-white/15 transition-all relative">
              {aiMatching && (
                <div className="absolute inset-0 bg-indigo-900/60 backdrop-blur-[4px] rounded-[2rem] flex items-center px-8 overflow-hidden">
                  <div className="h-full w-full absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  <Loader2 className="animate-spin text-white mr-4" size={24} />
                  <span className="text-sm font-black uppercase tracking-widest">Triaging symptoms...</span>
                </div>
              )}
              <input 
                name="concern"
                autoComplete="off"
                placeholder="Briefly describe what's happening..." 
                className="flex-1 bg-transparent px-6 py-4 outline-none text-white text-lg placeholder:text-indigo-300/60"
              />
              <button 
                type="submit"
                disabled={aiMatching}
                className="bg-white text-indigo-900 px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-indigo-50 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 shadow-xl"
              >
                Analyze Needs
              </button>
            </form>

            {aiRecommendation && (
              <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] animate-in fade-in slide-in-from-top-6 backdrop-blur-xl flex flex-col sm:flex-row gap-8 items-center shadow-2xl">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-400 text-indigo-900 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Matched Specialty</div>
                    <span className="text-lg font-black text-indigo-50">{aiRecommendation.category}</span>
                  </div>
                  <p className="text-indigo-100/90 leading-relaxed font-medium italic">"{aiRecommendation.text}"</p>
                </div>
                <button 
                  onClick={() => {
                    setActiveSpecialty(aiRecommendation.category);
                    const el = document.getElementById('directory');
                    if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
                  }}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-2xl shrink-0 active:scale-95 border border-indigo-500/50"
                >
                  View Specialists <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
          <div className="md:w-2/5 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-48 h-48 md:w-60 md:h-60 bg-indigo-600 rounded-[3rem] flex items-center justify-center shadow-2xl rotate-3 relative border border-white/10">
                  <Target size={80} className="text-white" />
                  <div className="absolute inset-0 bg-white/5 animate-shimmer rounded-[3rem] pointer-events-none" />
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-pink-500 p-5 rounded-[2rem] shadow-2xl border-4 border-indigo-900 -rotate-12 animate-bounce">
                <Sparkles size={32} className="text-white" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent)] pointer-events-none" />
      </section>

      {/* Directory Section */}
      <div id="directory" className="space-y-12 scroll-mt-24">
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-center px-2">
          <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar w-full lg:w-auto">
            {SPECIALTIES.map(s => (
              <button
                key={s}
                onClick={() => setActiveSpecialty(s)}
                className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border flex items-center gap-3 ${
                  activeSpecialty === s 
                  ? 'bg-pink-600 border-pink-600 text-white shadow-2xl shadow-pink-100 scale-105' 
                  : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                }`}
              >
                {s === "My Favorites" && <Heart size={16} fill={activeSpecialty === s ? "white" : "none"} className={activeSpecialty === s ? "" : "text-pink-500"} />}
                {s}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or clinic..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] outline-none focus:ring-8 focus:ring-pink-500/5 focus:border-pink-500 transition-all text-sm shadow-sm"
            />
          </div>
        </div>

        {/* Expert Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredExperts.length > 0 ? (
            filteredExperts.map(expert => (
              <div key={expert.id} className="bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden flex flex-col relative">
                {/* Favorite Toggle */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(expert.id);
                  }}
                  className="absolute top-8 right-8 z-10 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 text-gray-400 hover:text-pink-500 transition-all active:scale-90"
                >
                  <Heart 
                    size={22} 
                    fill={favoriteIds.includes(expert.id) ? "#ec4899" : "none"} 
                    className={favoriteIds.includes(expert.id) ? "text-pink-500" : ""}
                  />
                </button>

                {/* Card Header with Profile Image & Status */}
                <div className="p-10 pb-6">
                  <div className="flex items-start gap-8">
                    <div className="relative shrink-0">
                      <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden border-[6px] border-gray-50 shadow-inner group-hover:scale-110 transition-transform duration-700">
                        <img 
                          src={expert.image} 
                          alt={expert.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className={`absolute -bottom-2 -right-2 w-8 h-8 border-4 border-white rounded-2xl shadow-lg flex items-center justify-center ${
                        expert.status === 'Online' ? 'bg-green-500' : 
                        expert.status === 'Busy' ? 'bg-amber-500' : 'bg-gray-300'
                      }`}>
                         <div className={`w-2 h-2 rounded-full bg-white ${expert.status === 'Online' ? 'animate-ping' : ''}`} />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <h3 className="font-black text-gray-900 text-2xl leading-none group-hover:text-indigo-600 transition-colors">
                        {expert.name}
                      </h3>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{expert.specialty}</p>
                      <div className="flex items-center gap-2">
                         <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl border border-amber-100">
                            <Star size={14} fill="currentColor" />
                            <span className="text-[11px] font-black">{expert.rating}</span>
                         </div>
                         <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{expert.reviews} Reviews</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Bio & Stats */}
                <div className="px-10 pb-4 space-y-6">
                   <p className="text-gray-500 text-[13px] leading-relaxed font-medium line-clamp-2 italic">
                     "{expert.bio}"
                   </p>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-5 rounded-[1.75rem] border border-gray-100 flex flex-col items-center justify-center text-center">
                         <Medal className="text-indigo-500 mb-2" size={20} />
                         <p className="text-sm font-black text-gray-800">{expert.experience}</p>
                         <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Clinical Exp.</p>
                      </div>
                      <div className="bg-gray-50 p-5 rounded-[1.75rem] border border-gray-100 flex flex-col items-center justify-center text-center">
                         <GraduationCap className="text-pink-500 mb-2" size={20} />
                         <p className="text-[10px] font-black text-gray-800 line-clamp-1">{expert.education}</p>
                         <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Education</p>
                      </div>
                   </div>
                </div>

                {/* Pricing & Call to Actions */}
                <div className="mt-auto p-10 pt-4 space-y-6">
                  <div className="flex items-end justify-between border-t border-gray-50 pt-6">
                    <div>
                      <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest block mb-1">Consultation Fee</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-gray-900">{expert.price}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">/ session</span>
                      </div>
                    </div>
                    {expert.status === 'Online' && (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-2xl border border-green-100 text-[9px] font-black uppercase tracking-widest shadow-inner">
                        <ThumbsUp size={12} fill="currentColor" /> Ready Now
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      disabled={expert.status !== 'Online'}
                      onClick={() => handleConsultNowInternal(expert)}
                      className={`py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${
                        expert.status === 'Online'
                          ? 'bg-green-600 text-white hover:bg-green-700 shadow-xl shadow-green-100 active:scale-95'
                          : 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-200'
                      }`}
                    >
                      <Video size={18} /> Consult Now
                    </button>
                    <button 
                      onClick={() => setBookingExpert(expert)}
                      className="py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 active:scale-95"
                    >
                      <Calendar size={18} /> Book Session
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-8 bg-white rounded-[4rem] border border-gray-100 shadow-inner">
               <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center text-gray-300 shadow-inner border border-gray-100 group">
                  <Stethoscope size={64} className="group-hover:rotate-12 transition-transform duration-500" />
               </div>
               <div className="max-w-md space-y-3">
                 <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                   {activeSpecialty === "My Favorites" ? "No Favorites Saved" : "No Matches Found"}
                 </h3>
                 <p className="text-gray-500 font-medium leading-relaxed">
                   {activeSpecialty === "My Favorites" 
                    ? "Click the heart icon on a specialist's profile to save them to your preferred list for faster booking." 
                    : "We couldn't find any specialists matching your current criteria. Try adjusting your search or filters."}
                 </p>
               </div>
               <button 
                 onClick={() => setActiveSpecialty("All Specialists")}
                 className="px-10 py-5 bg-pink-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-pink-700 transition-all shadow-2xl shadow-pink-100 flex items-center gap-3 active:scale-95"
               >
                 View All Specialists <ArrowRight size={18} />
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingExpert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 overflow-y-auto">
          <div className="fixed inset-0 bg-indigo-950/70 backdrop-blur-xl" onClick={() => !isBookingLoading && setBookingExpert(null)} />
          
          <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl relative z-[101] overflow-hidden animate-in zoom-in-95 duration-300">
            {bookingSuccess ? (
              <div className="p-20 text-center space-y-10 flex flex-col items-center bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.05),transparent)]">
                <div className="w-32 h-32 bg-green-100 text-green-600 rounded-[3.5rem] flex items-center justify-center mb-4 shadow-inner animate-bounce">
                  <CheckCircle size={80} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">Session Confirmed!</h2>
                  <p className="text-gray-500 text-xl leading-relaxed max-w-sm mx-auto">Your appointment with <b>{bookingExpert.name}</b> is locked in for <b>{selectedDate}</b>.</p>
                </div>
                <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] w-full text-sm text-indigo-700 font-black uppercase tracking-widest border border-indigo-100 shadow-sm">
                  Calendar invite sent to your email
                </div>
              </div>
            ) : (
              <>
                <div className="p-10 md:p-14 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-8">
                    <img src={bookingExpert.image} className="w-24 h-24 rounded-[2.5rem] object-cover border-[6px] border-white shadow-2xl" alt="" />
                    <div className="space-y-1">
                      <h3 className="font-black text-gray-900 text-3xl tracking-tight">{bookingExpert.name}</h3>
                      <p className="text-xs text-indigo-600 font-black uppercase tracking-[0.2em]">{bookingExpert.specialty}</p>
                    </div>
                  </div>
                  <button 
                    disabled={isBookingLoading}
                    onClick={() => setBookingExpert(null)} 
                    className="p-4 hover:bg-white rounded-2xl text-gray-400 transition-colors border border-transparent hover:border-gray-200 hover:shadow-xl group"
                  >
                    <X size={32} className="group-hover:rotate-90 transition-transform" />
                  </button>
                </div>

                <div className="p-10 md:p-14 space-y-12">
                  <div className="space-y-8">
                    <h4 className="flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                      <CalendarDays size={20} className="text-pink-500" /> 1. Select Consultation Date
                    </h4>
                    <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
                      {next7Days.map((d) => (
                        <button
                          key={d.full}
                          onClick={() => setSelectedDate(d.full)}
                          className={`min-w-[7rem] p-6 rounded-[2.5rem] border transition-all flex flex-col items-center gap-3 ${
                            selectedDate === d.full 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-110 z-10' 
                            : 'bg-white border-gray-100 text-gray-500 hover:border-indigo-200 hover:bg-indigo-50/20'
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest">{d.day}</span>
                          <span className="text-3xl font-black">{d.date}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h4 className="flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                      <Clock size={20} className="text-pink-500" /> 2. Available Time Slots
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${
                            selectedTime === slot 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-200' 
                            : 'bg-gray-50 border-transparent text-gray-600 hover:bg-white hover:border-indigo-100 hover:shadow-xl'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-10 md:p-14 bg-gray-50/80 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Estimated total for 45 min session</p>
                    <div className="flex items-baseline gap-2">
                       <p className="text-5xl font-black text-gray-900 leading-none">{bookingExpert.price}</p>
                       <p className="text-xs font-black text-gray-400 uppercase">USD</p>
                    </div>
                  </div>
                  <button
                    onClick={handleBookSession}
                    disabled={!selectedTime || isBookingLoading}
                    className="w-full md:w-auto bg-indigo-600 text-white px-16 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 active:scale-95 border border-indigo-500"
                  >
                    {isBookingLoading ? <Loader2 className="animate-spin" size={24} /> : 'Confirm Booking'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Quality & Trust Standards */}
      <section className="bg-white p-12 rounded-[4rem] border border-gray-100 flex flex-col lg:flex-row items-center gap-16 shadow-sm">
        <div className="flex -space-x-8">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="relative group/avatar">
              <img src={`https://picsum.photos/seed/trust${i}/100/100`} className="w-20 h-20 rounded-[1.75rem] border-[6px] border-white shadow-2xl hover:-translate-y-4 transition-transform duration-500 hover:rotate-6 z-[1]" alt="Patient" />
              <div className="absolute inset-0 bg-pink-500 rounded-[1.75rem] opacity-0 group-hover/avatar:opacity-20 transition-opacity" />
            </div>
          ))}
          <div className="w-20 h-20 rounded-[1.75rem] bg-indigo-600 text-white flex flex-col items-center justify-center text-[10px] font-black border-[6px] border-white shadow-2xl uppercase relative z-10">
            <span>+12k</span>
            <span className="opacity-70 scale-75">Trust</span>
          </div>
        </div>
        <div className="flex-1 text-center lg:text-left space-y-4">
          <div className="flex items-center justify-center lg:justify-start gap-3">
             <Award size={32} className="text-amber-500" />
             <h4 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Global Clinical Standards</h4>
          </div>
          <p className="text-gray-500 font-medium leading-relaxed text-lg">
            Every specialist on MaaCare undergoes a rigorous 4-stage clinical verification process, including background checks, credential validation, and continuous peer review for the highest quality maternal care.
          </p>
        </div>
        <button className="px-10 py-5 bg-gray-50 text-gray-900 rounded-3xl font-black text-xs uppercase tracking-widest border border-gray-200 hover:bg-white hover:border-indigo-200 hover:shadow-xl transition-all shrink-0 active:scale-95">
          View Audit Policy
        </button>
      </section>

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

export default ExpertConsultation;
