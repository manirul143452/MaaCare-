
import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { Camera, Mail, MapPin, Calendar, CreditCard, Shield, ChevronRight, Save, Loader2, Sparkles, Heart, X } from 'lucide-react';

interface Props {
  user: UserProfile | null;
  onUpdate: (user: UserProfile) => void;
}

const ProfileView: React.FC<Props> = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<UserProfile>(user || {
    name: '',
    email: '',
    stage: 'Trimester 2',
    avatar: '',
    plan: 'Basic',
    joinDate: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic size validation
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large. Please select a file under 2MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setSaving(true);
    // Simulate API persistence
    setTimeout(() => {
      onUpdate(formData);
      localStorage.setItem('maacare_user', JSON.stringify(formData));
      setIsEditing(false);
      setSaving(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row items-center gap-8 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-pink-50 shadow-2xl transition-transform group-hover:scale-105 duration-500 bg-gray-100 flex items-center justify-center">
            {formData.avatar ? (
              <img src={formData.avatar} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <Heart className="text-pink-200" size={60} />
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="text-white" size={32} />
            </div>
          </div>
          <button className="absolute bottom-2 right-2 p-3 bg-pink-600 text-white rounded-2xl shadow-xl hover:bg-pink-700 transition-all border-4 border-white">
            <Camera size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
            accept="image/*" 
          />
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">{formData.name || 'User'}</h1>
            <span className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-amber-100 flex items-center gap-2">
              <Sparkles size={12} fill="currentColor" /> {formData.plan} Member
            </span>
          </div>
          <p className="text-gray-500 text-lg font-medium">{formData.stage}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase tracking-widest">
               <Calendar size={14} className="text-pink-500" /> Joined {formData.joinDate || 'Recently'}
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
           <Heart size={160} className="text-pink-500" fill="currentColor" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Shield size={24} className="text-indigo-600" /> Personal Information
              </h2>
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${
                  isEditing ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : (isEditing ? <><Save size={18} /> Save</> : 'Edit Profile')}
              </button>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-600 disabled:opacity-60 transition-all font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-600 disabled:opacity-60 transition-all font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Parenting Stage</label>
                <select 
                  disabled={!isEditing}
                  value={formData.stage}
                  onChange={(e) => setFormData({...formData, stage: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-600 disabled:opacity-60 transition-all font-medium appearance-none cursor-pointer"
                >
                  <option>Trying to Conceive</option>
                  <option>Trimester 1</option>
                  <option>Trimester 2</option>
                  <option>Trimester 3</option>
                  <option>Newborn Care</option>
                  <option>Toddler Parenting</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-indigo-200 transition-all">
             <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                   <CreditCard size={24} />
                </div>
                <div>
                   <h4 className="text-xl font-black text-gray-900">Billing History</h4>
                   <p className="text-sm text-gray-400 font-medium">Manage your invoices and payment methods.</p>
                </div>
             </div>
             <ChevronRight className="text-gray-300 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
              <h4 className="text-xl font-black mb-4 relative z-10">MaaCare Plus</h4>
              <p className="text-indigo-100 text-sm leading-relaxed opacity-80 relative z-10 mb-8">
                Your current plan gives you unlimited AI chat but limits specialist consultations.
              </p>
              <button className="w-full py-4 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all relative z-10">
                 Upgrade Features
              </button>
              <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
                 <Sparkles size={160} />
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Profile Completion</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-end mb-1">
                    <span className="text-3xl font-black text-gray-900 leading-none">85%</span>
                    <span className="text-xs text-green-500 font-bold uppercase">Almost There</span>
                 </div>
                 <div className="h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                    <div className="h-full bg-pink-500 w-[85%] rounded-full" />
                 </div>
                 <p className="text-xs text-gray-400 leading-relaxed pt-2 italic">
                    Add your clinic details to reach 100% and unlock personalized doctor matching.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
