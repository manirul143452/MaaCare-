
import React, { useState, useEffect } from 'react';
import { Appointment, ViewState } from '../types';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  MessageCircle,
  CalendarCheck,
  X,
  AlertTriangle,
  ArrowRight,
  Stethoscope,
  ClipboardList
} from 'lucide-react';

const CANCEL_REASONS = [
  "Scheduling conflict",
  "No longer needed",
  "Emergency",
  "Financial reasons",
  "Technical issues",
  "Other"
];

interface Props {
  onJoinCall?: (appointment: Appointment) => void;
  onNavigate?: (view: ViewState) => void;
}

const MyAppointments: React.FC<Props> = ({ onJoinCall, onNavigate }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'All' | 'Upcoming' | 'Past'>('All');
  
  // Cancellation Modal State
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  useEffect(() => {
    const fetchAppointments = () => {
      const savedRaw = localStorage.getItem('maacare_appointments');
      if (savedRaw) {
        // Sort by date descending for better history view
        const sorted = JSON.parse(savedRaw).sort((a: Appointment, b: Appointment) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setAppointments(sorted);
      }
    };
    fetchAppointments();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  
  const filteredAppointments = appointments.filter(app => {
    if (filter === 'All') return true;
    if (filter === 'Upcoming') return app.date >= today && app.status === 'Confirmed';
    return app.date < today || app.status === 'Cancelled' || app.status === 'Completed';
  });

  const handleConfirmCancellation = () => {
    if (!cancelTarget) return;

    const finalReason = selectedReason === "Other" ? customReason : selectedReason;
    const updated = appointments.map(app => 
      app.id === cancelTarget 
        ? { ...app, status: 'Cancelled' as const, cancellationReason: finalReason || "No reason provided" } 
        : app
    );
    
    setAppointments(updated);
    localStorage.setItem('maacare_appointments', JSON.stringify(updated));
    
    // Reset states
    setCancelTarget(null);
    setSelectedReason("");
    setCustomReason("");
  };

  const getTargetAppointment = () => appointments.find(a => a.id === cancelTarget);

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-100">
            <CheckCircle2 size={12} /> Confirmed
          </span>
        );
      case 'Completed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-100">
            <CalendarCheck size={12} /> Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-widest border border-red-100">
            <XCircle size={12} /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
          <p className="text-gray-500">Track and manage your upcoming and past consultations.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar">
          {(['All', 'Upcoming', 'Past'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                filter === tab 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab === 'All' ? 'All Sessions' : tab === 'Upcoming' ? 'Upcoming' : 'History'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((app) => (
            <div key={app.id} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-md transition-all group overflow-hidden relative">
              
              <div className="flex items-center gap-6 flex-1 w-full">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-4 border-gray-50 shadow-inner">
                    <img src={app.expertImage} className="w-full h-full object-cover" alt="" />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-black text-gray-900 text-xl tracking-tight">{app.expertName}</h3>
                    {getStatusBadge(app.status)}
                  </div>
                  <p className="text-xs text-indigo-500 font-black uppercase tracking-widest">{app.specialty}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                      <Calendar size={14} className="text-gray-400" /> 
                      {new Date(app.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                      <Clock size={14} className="text-gray-400" /> {app.time}
                    </div>
                  </div>

                  {app.status === 'Cancelled' && app.cancellationReason && (
                    <div className="mt-4 p-4 bg-red-50 rounded-2xl border border-red-100/50 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                       <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                       <div>
                         <p className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-1">Reason for Cancellation</p>
                         <p className="text-xs text-red-600 font-medium leading-relaxed">
                           {app.cancellationReason}
                         </p>
                       </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                {app.status === 'Confirmed' && app.date >= today && (
                  <>
                    <button 
                      onClick={() => onJoinCall?.(app)}
                      className="flex-1 md:flex-none px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 active:scale-95"
                    >
                      <Video size={18} /> Join Call
                    </button>
                    <button 
                      onClick={() => setCancelTarget(app.id)}
                      className="p-3.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-2xl transition-all border border-red-100 active:scale-95"
                      title="Cancel Appointment"
                    >
                      <XCircle size={20} />
                    </button>
                  </>
                )}
                {(app.status === 'Completed' || app.status === 'Cancelled' || app.date < today) && (
                  <button 
                    onClick={() => onNavigate?.(ViewState.EXPERT_CONSULTATION)}
                    className="flex-1 md:flex-none px-6 py-3.5 bg-white border border-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle size={18} className="text-pink-500" /> Book Again
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-[3rem] py-24 border border-gray-100 flex flex-col items-center justify-center gap-6 text-center px-10 shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-300 shadow-inner">
              <ClipboardList size={48} />
            </div>
            <div className="max-w-xs">
              <p className="text-gray-900 font-black text-2xl tracking-tight mb-2">No results found</p>
              <p className="text-gray-500 text-sm leading-relaxed">Try adjusting your filters or browse our specialists to book your first consultation.</p>
            </div>
            <button 
              onClick={() => onNavigate?.(ViewState.EXPERT_CONSULTATION)}
              className="px-10 py-4 bg-pink-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-pink-700 transition-all shadow-2xl shadow-pink-100 flex items-center gap-3 active:scale-95"
            >
              Browse Specialists <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-md" onClick={() => setCancelTarget(null)} />
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <AlertTriangle size={28} />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-xl tracking-tight">Cancel Appointment</h3>
                  <p className="text-xs text-gray-500">Consultation with {getTargetAppointment()?.expertName}</p>
                </div>
              </div>
              <button onClick={() => setCancelTarget(null)} className="p-3 hover:bg-white rounded-2xl text-gray-400 transition-colors border border-transparent hover:border-gray-100">
                <X size={24} />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <p className="text-sm text-gray-600 leading-relaxed text-center font-medium">
                We're sorry you need to cancel. Please select a reason to help us improve our services.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CANCEL_REASONS.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className={`px-4 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider border transition-all text-left ${
                      selectedReason === reason 
                        ? 'bg-red-50 border-red-200 text-red-600 shadow-sm' 
                        : 'bg-white border-gray-100 text-gray-400 hover:border-red-100'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              {selectedReason === "Other" && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Please specify your reason..."
                  className="w-full p-5 rounded-[1.5rem] border border-gray-100 bg-gray-50 text-sm outline-none focus:ring-4 focus:ring-red-500/10 transition-all resize-none h-32"
                />
              )}
            </div>

            <div className="p-10 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setCancelTarget(null)}
                className="flex-1 py-4 px-6 bg-white border border-gray-100 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
              >
                Go Back
              </button>
              <button 
                onClick={handleConfirmCancellation}
                disabled={!selectedReason || (selectedReason === "Other" && !customReason.trim())}
                className="flex-1 py-4 px-6 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100 disabled:opacity-50 active:scale-95"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Policy Section */}
      <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
            <Stethoscope size={24} className="text-indigo-500" /> Patient Care Policy
          </h2>
          <div className="space-y-4">
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <h4 className="font-black text-gray-900 text-xs uppercase tracking-widest mb-2">Encrypted Video Rooms</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Your privacy is our priority. All video calls are end-to-end encrypted and HIPAA compliant. Join your room 5 minutes early to test your equipment.</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
            <AlertCircle size={24} className="text-pink-500" /> Cancellation Policy
          </h2>
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
             <h4 className="font-black text-gray-900 text-xs uppercase tracking-widest mb-2">24-Hour Notice</h4>
             <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Cancellations made more than 24 hours before the session are fully refundable. Late cancellations may incur a processing fee.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyAppointments;
