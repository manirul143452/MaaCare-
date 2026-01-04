
import React, { useState } from 'react';
import { Heart, Mail, Lock, User, ArrowRight, Sparkles, ShieldCheck, CheckCircle } from 'lucide-react';
import { UserProfile } from '../types';
import BrandedLogo from './BrandedLogo';

interface Props {
  onLogin: (user: UserProfile) => void;
}

const Auth: React.FC<Props> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [stage, setStage] = useState('Trimester 2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: UserProfile = {
      name: isLogin ? (email.split('@')[0] || 'Maya') : name,
      email: email,
      stage: stage,
      avatar: `https://picsum.photos/seed/${email}/40/40`,
      plan: 'Basic',
      joinDate: new Date().toLocaleDateString()
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-[#fffafb] flex flex-col lg:flex-row overflow-hidden">
      {/* Visual Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-rose-500 via-rose-400 to-indigo-600 p-16 items-center justify-center relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-300 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 space-y-12 max-w-lg w-full">
          <div className="flex flex-col items-center lg:items-start gap-6">
            <div className="p-6 bg-white/90 backdrop-blur-md rounded-[3rem] shadow-2xl border border-white/30">
              <BrandedLogo size="xl" showText={true} />
            </div>
          </div>
          
          <div className="space-y-8">
             <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                   <ShieldCheck className="text-rose-100" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Safe & Clinical</h3>
                  <p className="text-rose-100/70 text-sm">Your health data is encrypted and handled with clinical standards.</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                   <Sparkles className="text-amber-200" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">AI-Powered Hub</h3>
                  <p className="text-rose-100/70 text-sm">Get instant answers for your symptoms and needs with Gemini Pro.</p>
                </div>
             </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-[2.5rem] border border-white/20">
             <p className="text-white font-medium italic">"MaaCare made my pregnancy so much smoother. The AI companion is a lifesaver."</p>
             <div className="flex items-center gap-3 mt-4">
                <img src="https://picsum.photos/seed/testimonial/40/40" className="w-10 h-10 rounded-full border-2 border-white/20" alt="" />
                <span className="text-sm font-bold text-white">Sophie M., Mom</span>
             </div>
          </div>
        </div>
        
        <Heart className="absolute -right-20 -bottom-20 w-96 h-96 text-white/5 rotate-12" fill="currentColor" />
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-10">
          <div className="lg:hidden mb-12">
            <BrandedLogo size="lg" />
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              {isLogin ? 'Welcome back' : 'Join Maacare'}
            </h2>
            <p className="text-gray-500 text-lg">
              {isLogin ? 'Access your maternal portal.' : 'Start your parenting journey today.'}
            </p>
          </div>

          <div className="flex p-1 bg-gray-100 rounded-2xl">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${isLogin ? 'bg-white text-rose-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${!isLogin ? 'bg-white text-rose-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Maya Johnson" 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:bg-white focus:border-rose-500 outline-none transition-all" 
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya@example.com" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:bg-white focus:border-rose-500 outline-none transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:bg-white focus:border-rose-500 outline-none transition-all" 
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Current Stage</label>
                <select 
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:bg-white focus:border-rose-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option>Trying to Conceive</option>
                  <option>Trimester 1</option>
                  <option>Trimester 2</option>
                  <option>Trimester 3</option>
                  <option>Newborn Care</option>
                  <option>Toddler Parenting</option>
                </select>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-5 bg-rose-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-rose-100 hover:bg-rose-700 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
            >
              {isLogin ? 'Login' : 'Sign Up'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
