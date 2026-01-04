
import React, { useState } from 'react';
import { ViewState } from '../types';
import { 
  Bell, 
  Lock, 
  Eye, 
  Smartphone, 
  Globe, 
  ShieldAlert, 
  ChevronRight, 
  LogOut, 
  Moon, 
  Sun,
  User,
  CreditCard,
  HelpCircle,
  FileText
} from 'lucide-react';

interface Props {
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

const SettingsView: React.FC<Props> = ({ onNavigate, onLogout }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifs, setNotifs] = useState(true);

  const sections = [
    {
      title: 'Account Settings',
      items: [
        { icon: User, label: 'Profile Information', desc: 'Name, email, and parenting stage', view: ViewState.PROFILE },
        { icon: CreditCard, label: 'Subscription Plan', desc: 'Current plan and billing details', view: ViewState.SUBSCRIPTIONS },
        { icon: Lock, label: 'Security', desc: 'Password and two-factor authentication' }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', desc: 'Manage app and expert alerts', toggle: true, value: notifs, setter: setNotifs },
        { icon: Globe, label: 'Language', desc: 'English (US)' },
        { icon: Moon, label: 'Dark Mode', desc: 'Optimize for night usage', toggle: true, value: darkMode, setter: setDarkMode }
      ]
    },
    {
      title: 'Legal & Support',
      items: [
        { icon: FileText, label: 'Privacy Policy', desc: 'How we handle your data', view: ViewState.PRIVACY_POLICY },
        { icon: HelpCircle, label: 'Help & Support', desc: 'Contact our clinical assistants' },
        { icon: ShieldAlert, label: 'Terms of Service', desc: 'Terms and conditions' }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Settings</h1>
          <p className="text-gray-500 mt-2 text-lg font-medium">Manage your account and app preferences.</p>
        </div>
      </header>

      <div className="space-y-12">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-4">{section.title}</h3>
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
               {section.items.map((item, i) => (
                 <div 
                  key={i} 
                  onClick={() => item.view && onNavigate(item.view)}
                  className={`p-6 flex items-center justify-between group transition-all border-b border-gray-50 last:border-b-0 ${item.toggle ? '' : 'cursor-pointer hover:bg-gray-50'}`}
                 >
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-indigo-600 transition-all border border-transparent group-hover:border-gray-100 shadow-sm">
                          <item.icon size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-black text-gray-800">{item.label}</p>
                          <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
                       </div>
                    </div>
                    
                    {item.toggle ? (
                      <button 
                        onClick={() => item.setter?.(!item.value)}
                        className={`w-12 h-6 rounded-full transition-all relative ${item.value ? 'bg-indigo-600' : 'bg-gray-200'}`}
                      >
                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.value ? 'left-7' : 'left-1'}`} />
                      </button>
                    ) : (
                      <ChevronRight className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                    )}
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8 flex flex-col gap-4">
        <button 
          onClick={onLogout}
          className="w-full py-5 bg-red-50 text-red-600 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-red-100 transition-all flex items-center justify-center gap-3 border border-red-100 active:scale-[0.98]"
        >
          <LogOut size={18} /> Logout of Device
        </button>
        <p className="text-center text-[10px] text-gray-400 font-black uppercase tracking-widest">MaaCare App v2.4.1 Build 2025</p>
      </div>
    </div>
  );
};

export default SettingsView;
