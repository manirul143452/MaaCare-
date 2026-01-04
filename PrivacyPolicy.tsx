
import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, Globe, Info, Heart } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: "MaaCare collect personal information (name, email) and health-related data (pregnancy stage, symptoms) to provide tailored medical triage. We also use vision data only when you explicitly upload images for analysis."
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "All health data is encrypted at rest using AES-256 and in transit via TLS 1.3. We use secure, cloud-hosted infrastructure with strict access controls following HIPAA-aligned protocols."
    },
    {
      icon: ShieldCheck,
      title: "Your Rights",
      content: "You have the right to export your data at any time, request its deletion, and withdraw consent for AI analysis. We never sell your health data to third-party advertisers or insurance companies."
    },
    {
      icon: Globe,
      title: "Global Compliance",
      content: "MaaCare is designed to comply with GDPR, CCPA, and local maternal health data regulations. Our AI models are processed on secure servers with minimal data retention."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header className="text-center space-y-4 max-w-2xl mx-auto bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10">
           <FileText size={32} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight relative z-10">Privacy Policy</h1>
        <p className="text-gray-500 text-lg font-medium relative z-10">Last updated March 2025. Your trust is our most valuable asset.</p>
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <Heart size={120} className="text-pink-500" fill="currentColor" />
        </div>
      </header>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <section key={idx} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-start group hover:border-indigo-100 transition-all">
             <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                <section.icon size={24} />
             </div>
             <div className="space-y-3">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{section.title}</h3>
                <p className="text-gray-600 leading-relaxed text-[15px] font-medium opacity-80">
                  {section.content}
                </p>
             </div>
          </section>
        ))}
      </div>

      <div className="bg-indigo-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center shrink-0 border border-white/20">
               <Info size={40} className="text-white" />
            </div>
            <div className="space-y-3">
               <h4 className="text-2xl font-black">Still have questions?</h4>
               <p className="text-indigo-100 leading-relaxed opacity-80">
                 Our dedicated Privacy & Ethics team is available to explain how we handle your data. We believe in total transparency.
               </p>
               <button className="pt-2 text-white font-black text-xs uppercase tracking-[0.2em] underline hover:text-amber-300 transition-colors">
                 Contact Data Protection Officer
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
