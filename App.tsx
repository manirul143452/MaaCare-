
import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Stethoscope, 
  Activity, 
  BookOpen, 
  Users, 
  Utensils,
  Calendar, 
  ShieldCheck, 
  MessageCircle, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Plus,
  Home,
  Baby,
  ClipboardList,
  Sparkles,
  UserPlus,
  PhoneCall,
  CalendarCheck,
  Video,
  Smile,
  ShieldAlert,
  User as UserIcon,
  CreditCard,
  Lock,
  UserCog
} from 'lucide-react';
import { ViewState, Appointment, UserProfile } from './types';
import Dashboard from './components/Dashboard';
import SymptomChecker from './components/SymptomChecker';
import AICompanion from './components/AICompanion';
import ParentsPark from './components/ParentsPark';
import PrenatalYoga from './components/PrenatalYoga';
import NutritionGuide from './components/NutritionGuide';
import VaccinationTracker from './components/VaccinationTracker';
import FamilyPlanning from './components/FamilyPlanning';
import Contraception from './components/Contraception';
import DoctorRegister from './components/DoctorRegister';
import DoctorProfile from './components/DoctorProfile';
import ExpertConsultation from './components/ExpertConsultation';
import PregnancyTracker from './components/PregnancyTracker';
import MyAppointments from './components/MyAppointments';
import VideoConsultation from './components/VideoConsultation';
import ChildCareGuide from './components/ChildCareGuide';
import SelfCare from './components/SelfCare';
import Auth from './components/Auth';
import ProfileView from './components/ProfileView';
import Subscriptions from './components/Subscriptions';
import SettingsView from './components/SettingsView';
import PrivacyPolicy from './components/PrivacyPolicy';
import BrandedLogo from './components/BrandedLogo';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('maacare_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setActiveView(ViewState.AUTH);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const startConsultation = (appointment: Appointment) => {
    setActiveAppointment(appointment);
    setActiveView(ViewState.VIDEO_CONSULTATION);
  };

  const handleLogout = () => {
    localStorage.removeItem('maacare_user');
    setUser(null);
    setActiveView(ViewState.AUTH);
  };

  const handleLogin = (userData: UserProfile) => {
    setUser(userData);
    localStorage.setItem('maacare_user', JSON.stringify(userData));
    setActiveView(ViewState.DASHBOARD);
  };

  const navigationItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: Home },
    { id: ViewState.PREGNANCY_TRACKER, label: 'Pregnancy Tracker', icon: Calendar },
    { id: ViewState.SYMPTOM_CHECKER, label: 'Symptom Checker', icon: Stethoscope },
    { id: ViewState.EXPERT_CONSULTATION, label: 'Consult an Expert', icon: PhoneCall },
    { id: ViewState.CHILD_CARE_GUIDE, label: 'Child Care Guide', icon: Baby },
    { id: ViewState.SELF_CARE, label: 'Self Care', icon: Smile },
    { id: ViewState.MY_APPOINTMENTS, label: 'My Appointments', icon: CalendarCheck },
    { id: ViewState.AI_COMPANION, label: 'AI Companion', icon: MessageCircle },
    { id: ViewState.PRENATAL_YOGA, label: 'Prenatal Yoga', icon: Activity },
    { id: ViewState.NUTRITION_GUIDE, label: 'Nutrition Guide', icon: Utensils },
    { id: ViewState.PARENTS_PARK, label: 'Parents Park', icon: Users },
    { id: ViewState.VACCINATIONS, label: 'Vaccinations', icon: ShieldCheck },
    { id: ViewState.FAMILY_PLANNING, label: 'Family Planning', icon: Sparkles },
    { id: ViewState.CONTRACEPTION, label: 'Contraception', icon: ClipboardList },
    { id: ViewState.DOCTOR_REGISTER, label: 'Doctor Register', icon: UserPlus },
  ];

  if (user?.isDoctor) {
    navigationItems.push({ id: ViewState.DOCTOR_PROFILE, label: 'Doctor Profile', icon: UserCog });
  }

  if (activeView === ViewState.AUTH) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (activeView) {
      case ViewState.DASHBOARD: return <Dashboard onNavigate={setActiveView} />;
      case ViewState.PREGNANCY_TRACKER: return <PregnancyTracker />;
      case ViewState.SYMPTOM_CHECKER: return <SymptomChecker />;
      case ViewState.AI_COMPANION: return <AICompanion />;
      case ViewState.PARENTS_PARK: return <ParentsPark />;
      case ViewState.PRENATAL_YOGA: return <PrenatalYoga />;
      case ViewState.NUTRITION_GUIDE: return <NutritionGuide />;
      case ViewState.VACCINATIONS: return <VaccinationTracker />;
      case ViewState.FAMILY_PLANNING: return <FamilyPlanning />;
      case ViewState.CONTRACEPTION: return <Contraception />;
      case ViewState.DOCTOR_REGISTER: return <DoctorRegister />;
      case ViewState.DOCTOR_PROFILE: return <DoctorProfile user={user} onUpdate={setUser} onResign={handleLogout} />;
      case ViewState.CHILD_CARE_GUIDE: return <ChildCareGuide />;
      case ViewState.SELF_CARE: return <SelfCare />;
      case ViewState.PROFILE: return <ProfileView user={user} onUpdate={setUser} />;
      case ViewState.SUBSCRIPTIONS: return <Subscriptions user={user} onUpdate={setUser} />;
      case ViewState.SETTINGS: return <SettingsView onNavigate={setActiveView} onLogout={handleLogout} />;
      case ViewState.PRIVACY_POLICY: return <PrivacyPolicy />;
      case ViewState.EXPERT_CONSULTATION: return <ExpertConsultation onConsultNow={startConsultation} />;
      case ViewState.MY_APPOINTMENTS: return <MyAppointments onJoinCall={startConsultation} onNavigate={setActiveView} />;
      case ViewState.VIDEO_CONSULTATION: 
        return activeAppointment ? (
          <VideoConsultation 
            appointment={activeAppointment} 
            onClose={() => setActiveView(ViewState.MY_APPOINTMENTS)} 
          />
        ) : <Dashboard onNavigate={setActiveView} />;
      default: return <Dashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#fffafb] overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
        w-64 bg-white shadow-xl z-30 transition-transform duration-300 ease-in-out flex flex-col
      `}>
        <div className="p-8 border-b flex flex-col items-center justify-center bg-gradient-to-b from-rose-50/30 to-transparent">
          <BrandedLogo size="md" className="cursor-pointer" onClick={() => setActiveView(ViewState.DASHBOARD)} />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all
                ${activeView === item.id 
                  ? 'bg-rose-50 text-rose-600 font-semibold shadow-sm border border-rose-100/50' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}
              `}
            >
              <item.icon size={18} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t space-y-1">
          <button 
            onClick={() => setActiveView(ViewState.SETTINGS)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === ViewState.SETTINGS ? 'bg-rose-50 text-rose-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Settings size={20} />
            <span className="text-sm">Settings</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 lg:px-10 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
              {navigationItems.find(i => i.id === activeView)?.label || 'Dashboard'}
            </h2>
            <div className="lg:hidden scale-75">
               <BrandedLogo size="sm" showText={false} />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveView(ViewState.SUBSCRIPTIONS)}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-200 hover:scale-105 transition-transform"
            >
              <Sparkles size={14} fill="currentColor" /> {user?.plan || 'Basic'}
            </button>
            <button 
              onClick={() => setActiveView(user?.isDoctor ? ViewState.DOCTOR_PROFILE : ViewState.PROFILE)}
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden hover:ring-2 hover:ring-rose-200 transition-all"
            >
               <img src={user?.avatar || "https://picsum.photos/seed/mama/40/40"} alt="User" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
