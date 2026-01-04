
import React, { useState } from 'react';
import { Shield, Info, CheckCircle2, ChevronRight, HelpCircle, Search, Filter } from 'lucide-react';

interface Method {
  name: string;
  type: 'Hormonal' | 'Barrier' | 'Permanent' | 'Long-acting';
  effectiveness: string;
  duration: string;
  description: string;
  color: string;
}

const methods: Method[] = [
  { name: 'IUD (Mirena/Copper)', type: 'Long-acting', effectiveness: '99%+', duration: '3-10 Years', description: 'Highly effective, "set and forget" method inserted into the uterus.', color: 'bg-teal-500' },
  { name: 'The Pill', type: 'Hormonal', effectiveness: '91-99%', duration: 'Daily', description: 'Oral contraceptive taken daily to prevent ovulation.', color: 'bg-pink-500' },
  { name: 'Implant', type: 'Long-acting', effectiveness: '99%+', duration: '3 Years', description: 'Small rod inserted under the skin of the arm.', color: 'bg-indigo-500' },
  { name: 'Condoms', type: 'Barrier', effectiveness: '82-98%', duration: 'Per Act', description: 'Protects against pregnancy and STIs.', color: 'bg-orange-500' },
  { name: 'Injection', type: 'Hormonal', effectiveness: '94-99%', duration: '3 Months', description: 'Hormonal shot administered by a healthcare professional.', color: 'bg-purple-500' },
  { name: 'Vasectomy', type: 'Permanent', effectiveness: '99%+', duration: 'Permanent', description: 'Permanent surgical solution for men.', color: 'bg-slate-700' },
];

const Contraception: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Hormonal' | 'Barrier' | 'Long-acting'>('All');

  const filteredMethods = activeTab === 'All' ? methods : methods.filter(m => m.type === activeTab);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Contraceptive Guide</h1>
          <p className="text-gray-500 leading-relaxed">
            Finding the right method is personal. Explore options based on effectiveness, lifestyle, and your body's needs.
          </p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          {['All', 'Hormonal', 'Barrier', 'Long-acting'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMethods.map((method, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`${method.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <Shield size={24} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                {method.type}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{method.name}</h3>
            <p className="text-xs font-bold text-indigo-600 mb-3">{method.effectiveness} Effective</p>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              {method.description}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration: {method.duration}</div>
              <button className="text-indigo-600 font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn More <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-indigo-50 rounded-[2.5rem] p-10 flex flex-col lg:flex-row items-center gap-10 border border-indigo-100">
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-3xl font-bold text-indigo-900">Which method is right for me?</h2>
          <p className="text-indigo-800 opacity-80 leading-relaxed">
            Take our interactive quiz to find a contraceptive method tailored to your lifestyle, medical history, and future family planning goals.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2">
              Start Method Quiz <ChevronRight size={20} />
            </button>
            <button className="bg-white text-indigo-600 border border-indigo-200 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all">
              Talk to an Expert
            </button>
          </div>
        </div>
        <div className="lg:w-1/2 grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm space-y-2">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <h4 className="font-bold text-gray-800 text-sm">Effectiveness</h4>
            <p className="text-xs text-gray-500">Based on clinical studies and real-world usage.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm space-y-2">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Info size={20} />
            </div>
            <h4 className="font-bold text-gray-800 text-sm">Side Effects</h4>
            <p className="text-xs text-gray-500">Full disclosure of potential hormonal changes.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contraception;
