
import React, { useState, useRef } from 'react';
import { UserPlus, ShieldCheck, Mail, Phone, MapPin, Award, CheckCircle2, ChevronRight, Building, FileText, Stethoscope, Activity, Camera, X, Loader2 } from 'lucide-react';

const DoctorRegister: React.FC = () => {
  const [step, setStep] = useState(1);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic size validation
      if (file.size > 2 * 1024 * 1024) {
        alert("Photo is too large. Please select a file under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API registration call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Registration submitted successfully! Our team will review your credentials within 48 hours.');
      setStep(1);
      setProfilePhoto(null);
    }, 2000);
  };

  const steps = [
    { label: 'Personal Info', icon: UserPlus },
    { label: 'Credentials', icon: Award },
    { label: 'Clinic Setup', icon: Building },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header className="text-center space-y-4">
        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <Stethoscope size={40} />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">Join the MaaCare Network</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Partner with us to provide expert care to thousands of mothers and parents. Register your clinic today.
        </p>
      </header>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between px-10 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
        {steps.map((s, i) => (
          <div key={i} className="relative z-10 flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
              step > i + 1 ? 'bg-green-500 text-white' : 
              step === i + 1 ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-110' : 
              'bg-white text-gray-300 border-2 border-gray-100'
            }`}>
              {step > i + 1 ? <CheckCircle2 size={24} /> : <s.icon size={24} />}
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest ${
              step === i + 1 ? 'text-indigo-600' : 'text-gray-400'
            }`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-10">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Personal Information</h2>
              
              {/* Doctor Profile Photo Upload */}
              <div className="flex flex-col items-center gap-4 mb-8">
                <div 
                  className="w-32 h-32 rounded-[2rem] bg-gray-50 border-4 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group cursor-pointer transition-all hover:border-indigo-300"
                  onClick={() => photoInputRef.current?.click()}
                >
                  {profilePhoto ? (
                    <img src={profilePhoto} className="w-full h-full object-cover" alt="Doctor Profile" />
                  ) : (
                    <div className="text-center space-y-1">
                      <Camera size={24} className="text-gray-300 mx-auto" />
                      <p className="text-[9px] font-black text-gray-400 uppercase">Upload Photo</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera size={20} className="text-indigo-600" />
                  </div>
                  {profilePhoto && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setProfilePhoto(null); }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={photoInputRef} 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                  accept="image/*" 
                />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Professional Profile Picture</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Dr. Sarah Johnson" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="email" placeholder="sarah.j@clinic.com" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="tel" placeholder="+1 (555) 000-0000" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Specialization</label>
                  <select className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer">
                    <option>Obstetrics & Gynecology</option>
                    <option>Pediatrics</option>
                    <option>Lactation Consultant</option>
                    <option>Maternal Mental Health</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Professional Credentials</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Medical License Number</label>
                  <div className="relative">
                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="MD-9988776655" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 hover:border-indigo-300 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Upload License</p>
                      <p className="text-xs text-gray-400">PDF, JPG, or PNG (Max 5MB)</p>
                    </div>
                  </div>
                  <div className="p-8 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 hover:border-indigo-300 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center">
                      <Award size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Board Certification</p>
                      <p className="text-xs text-gray-400">Optional but recommended</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Clinic Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Clinic / Hospital Name</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="St. Jude Maternal Center" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="123 Health Ave, Medical District" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-10 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <button 
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={step === 1 || isSubmitting}
            className="text-gray-400 font-bold hover:text-gray-600 disabled:opacity-0 transition-all"
          >
            Go Back
          </button>
          <button 
            onClick={() => {
              if (step < 3) setStep(prev => prev + 1);
              else handleSubmit();
            }}
            disabled={isSubmitting}
            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {isSubmitting ? (
              <><Loader2 className="animate-spin" size={20} /> Processing...</>
            ) : (
              <>{step === 3 ? 'Submit Application' : 'Next Step'} <ChevronRight size={20} /></>
            )}
          </button>
        </div>
      </div>

      <div className="bg-indigo-900 rounded-3xl p-8 text-white flex items-center gap-8 shadow-xl relative overflow-hidden">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-1">Trust & Verification</h3>
          <p className="text-indigo-200 text-sm opacity-80">
            MaaCare verifies all medical professionals to ensure the highest standard of care for our community. Verification typically takes 2-3 business days.
          </p>
        </div>
        <Activity className="absolute -right-4 -bottom-4 text-white opacity-5 w-40 h-40" />
      </div>
    </div>
  );
};

export default DoctorRegister;
