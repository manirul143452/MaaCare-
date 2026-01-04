
import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { 
  Camera, Mail, Award, Save, Loader2, Sparkles, Heart, X, 
  Stethoscope, ShieldAlert, Trash2, CheckCircle2, FileText, 
  Building, GraduationCap 
} from 'lucide-react';

interface Props {
  user: UserProfile | null;
  onUpdate: (user: UserProfile) => void;
  onResign: () => void;
}

const DoctorProfile: React.FC<Props> = ({ user, onUpdate, onResign }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showResignModal, setShowResignModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<UserProfile>(user || {
    name: '',
    email: '',
    stage: 'Expert',
    avatar: '',
    plan: 'Premium',
    joinDate: '',
    isDoctor: true,
    specialty: 'Obstetrics & Gynecology',
    bio: '',
    license: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image too large. Under 2MB please.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      onUpdate(formData);
      localStorage.setItem('maacare_user', JSON.stringify(formData));
      setIsEditing(false);
      setSaving(false);
    }, 1200);
  };

  const handleConfirmResignation = () => {
    setShowResignModal(false);
    onResign(); // Logs out and clears data
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row items-center gap-10 bg-indigo-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="w-48 h-48 rounded-[3rem] overflow-hidden border-4 border-white/20 shadow-2xl transition-all group-hover:scale-105 duration-500 bg-white/10 flex items-center justify-center">
            {formData.avatar ? (
              <img src={formData.avatar} className="w-full h-full object-cover" alt="Doctor" />
            ) : (
              <Stethoscope className="text-indigo-200" size={60} />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="text-white" size={40} />
            </div>
          </div>
          <button className="absolute bottom-2 right-2 p-4 bg-white text-indigo-900 rounded-2xl shadow-xl hover:bg-indigo-50 transition-all border-4 border-indigo-900">
            <Camera size={24} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
        </div>

        <div className="flex-1 text-center md:text-left space-y-4 relative z-10">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <h1 className="text-4xl font-black tracking-tight">{formData.name}</h1>
            <span className="px-4 py-1.5 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2">
              <CheckCircle2 size={12} fill="currentColor" /> Verified Practitioner
            </span>
          </div>
          <p className="text-indigo-200 text-xl font-medium">{formData.specialty}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-100/60 uppercase tracking-widest">
               <Award size={16} className="text-amber-400" /> License: {formData.license || 'MD-887766'}
            </div>
          </div>
        </div>

        <Sparkles size={160} className="absolute top-[-40px] right-[-40px] text-white opacity-5 rotate-12" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <FileText size={24} className="text-indigo-600" /> Professional Details
              </h2>
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
                  isEditing ? 'bg-indigo-600 text-white shadow-xl' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : (isEditing ? <><Save size={18} /> Save Profile</> : 'Edit Profile')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Display Name</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-600 disabled:opacity-60 transition-all font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Practitioner Email</label>
                <input 
                  type="email" 
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-600 disabled:opacity-60 transition-all font-medium" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Specialization</label>
              <select 
                disabled={!isEditing}
                value={formData.specialty}
                onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-600 disabled:opacity-60 transition-all font-medium appearance-none cursor-pointer"
              >
                <option>Obstetrics & Gynecology</option>
                <option>Pediatrics</option>
                <option>Lactation Consultant</option>
                <option>Maternal Mental Health</option>
                <option>Pediatric Nutrition</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Professional Bio</label>
              <textarea 
                disabled={!isEditing}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Share your clinical background and approach to patient care..."
                className="w-full h-40 px-6 py-4 bg-gray-50 border border-gray-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-600 disabled:opacity-60 transition-all font-medium resize-none" 
              />
            </div>
          </div>

          <div className="bg-red-50 p-10 rounded-[3rem] border border-red-100 space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                  <ShieldAlert size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-black text-red-900">Practice Resignation</h3>
                  <p className="text-sm text-red-700 font-medium">Permanently deactivate your professional profile from MaaCare.</p>
               </div>
            </div>
            <button 
              onClick={() => setShowResignModal(true)}
              className="px-8 py-4 bg-white text-red-600 border border-red-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
            >
              <Trash2 size={18} /> Resign from Practice
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
             <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Practice Stats</h4>
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <GraduationCap size={20} />
                   </div>
                   <div>
                      <p className="text-2xl font-black text-gray-900">124</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consultations</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center">
                      <Heart size={20} />
                   </div>
                   <div>
                      <p className="text-2xl font-black text-gray-900">4.9</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg. Patient Rating</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                      <Building size={20} />
                   </div>
                   <div>
                      <p className="text-2xl font-black text-gray-900">8</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Referrals</p>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="bg-indigo-900 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden group cursor-pointer">
             <div className="relative z-10 space-y-4">
                <h4 className="text-lg font-black tracking-tight">Expert Verification</h4>
                <p className="text-sm text-indigo-100 opacity-80 leading-relaxed">Your license MD-887766 is valid until Oct 2026. Keep your credentials updated to stay in the priority list.</p>
                <button className="text-[10px] font-black uppercase tracking-widest text-indigo-300 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                   Manage Documents <X size={14} className="rotate-45" />
                </button>
             </div>
             <Award size={120} className="absolute -right-8 -bottom-8 text-white opacity-10 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      {/* Resignation Confirmation Modal */}
      {showResignModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-xl" onClick={() => setShowResignModal(false)} />
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 bg-red-50/50 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shadow-inner">
                <ShieldAlert size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Confirm Resignation</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                This action is irreversible. You will no longer be visible to patients, and all your current appointment data will be archived.
              </p>
            </div>
            <div className="p-8 flex flex-col gap-3">
              <button 
                onClick={handleConfirmResignation}
                className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100 active:scale-95"
              >
                Yes, Resign & Close Account
              </button>
              <button 
                onClick={() => setShowResignModal(false)}
                className="w-full py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
              >
                No, Keep My Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
