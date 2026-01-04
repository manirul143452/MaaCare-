
import React from 'react';
import { Check, Sparkles, Zap, Users, Heart, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  user: UserProfile | null;
  onUpdate: (user: UserProfile) => void;
}

const Subscriptions: React.FC<Props> = ({ user, onUpdate }) => {
  const plans = [
    {
      name: 'Basic',
      price: '$0',
      period: 'forever',
      description: 'The essentials for every mother.',
      features: ['Limited AI Chat', 'Symptom Triage', 'Basic Nutrition Tips', 'Vaccination Tracker'],
      button: 'Current Plan',
      color: 'bg-white text-gray-500 border-gray-100',
      icon: Heart,
      highlight: false
    },
    {
      name: 'Premium',
      price: '$12',
      period: 'per month',
      description: 'Advanced AI and direct expert access.',
      features: ['Unlimited Vision AI', '2 Monthly Expert Calls', 'Custom Meal Plans', 'Sleep Quality Analysis', 'Ad-Free Experience'],
      button: 'Go Premium',
      color: 'bg-indigo-600 text-white shadow-2xl shadow-indigo-100 border-indigo-600',
      icon: Sparkles,
      highlight: true
    },
    {
      name: 'Family',
      price: '$25',
      period: 'per month',
      description: 'Complete care for the whole family.',
      features: ['Up to 5 Family Profiles', 'Unlimited Expert Calls', 'Emergency Priority Support', 'Dedicated Family Nurse', 'Genomic Health Insights'],
      button: 'Upgrade Family',
      color: 'bg-white text-gray-500 border-gray-100',
      icon: Users,
      highlight: false
    }
  ];

  const handleUpgrade = (planName: any) => {
    if (user) {
      onUpdate({ ...user, plan: planName });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-20">
      <header className="text-center space-y-6 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 text-amber-600 text-xs font-black uppercase tracking-widest shadow-sm">
          <Star size={14} fill="currentColor" /> Premium Healthcare Access
        </div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">Elevate your parenting journey with <span className="text-pink-600">MaaCare Plus</span></h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          Choose a plan that fits your family's needs. All plans include a 7-day free trial of our premium features. No hidden fees.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={`rounded-[3rem] p-10 border transition-all relative flex flex-col ${plan.color} ${
              plan.highlight ? 'scale-105 z-10' : 'hover:border-indigo-200'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-400 text-indigo-900 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                 <Zap size={14} fill="currentColor" /> Most Popular
              </div>
            )}
            
            <div className="mb-10 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${plan.highlight ? 'bg-white/20' : 'bg-pink-50 text-pink-500'}`}>
                <plan.icon size={28} />
              </div>
              <h3 className={`text-2xl font-black ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
            </div>

            <div className="mb-10">
               <div className="flex items-baseline gap-2">
                 <span className={`text-5xl font-black ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                 <span className={`text-sm font-bold uppercase tracking-widest ${plan.highlight ? 'text-indigo-100' : 'text-gray-400'}`}>/ {plan.period}</span>
               </div>
               <p className={`text-sm mt-4 font-medium leading-relaxed ${plan.highlight ? 'text-indigo-100' : 'text-gray-500'}`}>{plan.description}</p>
            </div>

            <ul className="space-y-5 mb-10 flex-1">
               {plan.features.map((feat, idx) => (
                 <li key={idx} className="flex items-start gap-3">
                   <div className={`mt-1 p-0.5 rounded-full ${plan.highlight ? 'bg-white/20 text-white' : 'bg-pink-50 text-pink-500'}`}>
                      <Check size={14} />
                   </div>
                   <span className={`text-sm font-bold ${plan.highlight ? 'text-indigo-50' : 'text-gray-600'}`}>{feat}</span>
                 </li>
               ))}
            </ul>

            <button 
              onClick={() => handleUpgrade(plan.name)}
              disabled={user?.plan === plan.name}
              className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98] ${
                plan.highlight 
                ? 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl' 
                : user?.plan === plan.name ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}
            >
              {user?.plan === plan.name ? 'Active Plan' : plan.button}
            </button>
          </div>
        ))}
      </div>

      <section className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center gap-12 max-w-5xl mx-auto px-4">
        <div className="w-24 h-24 bg-green-50 text-green-600 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-inner">
           <ShieldCheck size={48} />
        </div>
        <div className="flex-1 text-center lg:text-left space-y-3">
           <h4 className="text-2xl font-black text-gray-900 tracking-tight">Enterprise & Government Tiers</h4>
           <p className="text-gray-500 leading-relaxed font-medium">
             Are you a health organization or government looking to deploy MaaCare for your community? We offer custom API access, data dashbaords, and white-label solutions.
           </p>
        </div>
        <button className="px-8 py-4 bg-gray-50 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest border border-gray-200 hover:bg-gray-100 transition-all flex items-center gap-2 group shrink-0">
          Contact Sales <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </section>
    </div>
  );
};

export default Subscriptions;
