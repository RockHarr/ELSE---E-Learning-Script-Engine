
import React, { useState } from 'react';
import { Sparkles, FileText, Cpu, Edit3, Download, X, Globe } from 'lucide-react';
import { Language, translations } from '../i18n';

interface OnboardingProps {
  onClose: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

const Step: React.FC<{ icon: React.ReactNode; title: string; description: string; step: string }> = ({ icon, title, description, step }) => (
  <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 relative">
      {icon}
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
        {step}
      </span>
    </div>
    <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
  </div>
);

const Onboarding: React.FC<OnboardingProps> = ({ onClose, lang, setLang }) => {
  const [currentStep, setCurrentStep] = useState<0 | 1>(0);
  const t = translations[lang].onboarding;
  
  const handleSelectLang = (newLang: Language) => {
    setLang(newLang);
    setCurrentStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6 animate-in fade-in duration-300">
      <div className="max-w-4xl w-full bg-slate-50 rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-12">
          {currentStep === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">
                {translations.en.onboarding.selectLanguage} / {translations.es.onboarding.selectLanguage}
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                <button
                  onClick={() => handleSelectLang('en')}
                  className="flex-1 p-6 bg-white border-2 border-slate-100 hover:border-indigo-500 rounded-2xl transition-all group active:scale-95"
                >
                  <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">🇺🇸</span>
                  <span className="font-bold text-slate-700">English</span>
                </button>
                <button
                  onClick={() => handleSelectLang('es')}
                  className="flex-1 p-6 bg-white border-2 border-slate-100 hover:border-indigo-500 rounded-2xl transition-all group active:scale-95"
                >
                  <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform">🇪🇸</span>
                  <span className="font-bold text-slate-700">Español</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <header className="text-center mb-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                  <Sparkles className="w-3 h-3" />
                  {t.welcome}
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  {t.title}
                </h2>
                <p className="text-slate-600 max-w-lg mx-auto">
                  {t.description}
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Step step="1" icon={<FileText className="w-6 h-6" />} title={t.step1.title} description={t.step1.desc} />
                <Step step="2" icon={<Cpu className="w-6 h-6" />} title={t.step2.title} description={t.step2.desc} />
                <Step step="3" icon={<Edit3 className="w-6 h-6" />} title={t.step3.title} description={t.step3.desc} />
                <Step step="4" icon={<Download className="w-6 h-6" />} title={t.step4.title} description={t.step4.desc} />
              </div>

              <div className="mt-12 flex justify-center">
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1 active:scale-95"
                >
                  {t.button}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="bg-slate-800 p-4 text-center">
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em]">
            {t.footer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
