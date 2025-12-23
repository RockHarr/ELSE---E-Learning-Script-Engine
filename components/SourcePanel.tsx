
import React, { useRef, useState } from 'react';
import { FileText, Sparkles, Beaker, Upload, FileUp, X, CheckCircle2 } from 'lucide-react';
import { Tone, Audience } from '../types';
import { Language, translations } from '../i18n';

interface SourcePanelProps {
  sourceText: string;
  setSourceText: (text: string) => void;
  onProcess: () => void;
  onTryExample: () => void;
  loading: boolean;
  tone: Tone;
  setTone: (tone: Tone) => void;
  audience: Audience;
  setAudience: (audience: Audience) => void;
  lang: Language;
}

const SourcePanel: React.FC<SourcePanelProps> = ({
  sourceText,
  setSourceText,
  onProcess,
  onTryExample,
  loading,
  tone,
  setTone,
  audience,
  setAudience,
  lang
}) => {
  const t = translations[lang].source;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setSourceText(content);
    };
    reader.readAsText(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clearSource = () => {
    setSourceText('');
    setFileName(null);
  };
  
  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 overflow-y-auto">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <FileText className="w-5 h-5 text-indigo-600" />
            {t.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">{t.subtitle}</p>
        </div>
      </div>

      <div className="p-4 space-y-5 flex-1 flex flex-col">
        <div className="flex gap-2">
          <button
            onClick={onTryExample}
            className="flex-1 py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-indigo-100 shadow-sm active:scale-[0.98]"
          >
            <Beaker className="w-4 h-4" />
            {t.tryExample}
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200 shadow-sm active:scale-[0.98]"
          >
            <Upload className="w-4 h-4 text-slate-400" />
            {t.uploadFile}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onFileChange} 
            className="hidden" 
            accept=".txt,.md,.pdf,.doc,.docx"
          />
        </div>

        {fileName && (
          <div className="px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-between animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 overflow-hidden">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-[10px] font-bold text-emerald-700 truncate">{fileName}</span>
            </div>
            <button onClick={() => setFileName(null)} className="text-emerald-400 hover:text-emerald-600"><X className="w-3 h-3" /></button>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">{t.audienceLabel}</label>
          <select 
            value={audience}
            onChange={(e) => setAudience(e.target.value as Audience)}
            className="w-full p-2.5 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 shadow-sm transition-all"
          >
            <option value="Beginner">{t.audiences.Beginner}</option>
            <option value="Technical">{t.audiences.Technical}</option>
            <option value="Executive">{t.audiences.Executive}</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">{t.toneLabel}</label>
          <select 
            value={tone}
            onChange={(e) => setTone(e.target.value as Tone)}
            className="w-full p-2.5 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 shadow-sm transition-all"
          >
            <option value="Academic">{t.tones.Academic}</option>
            <option value="Corporate">{t.tones.Corporate}</option>
            <option value="Narrative">{t.tones.Narrative}</option>
            <option value="Gamified">{t.tones.Gamified}</option>
          </select>
        </div>

        <div className="space-y-2 flex-1 flex flex-col min-h-0 relative">
          <label className="text-xs font-bold uppercase text-slate-500 tracking-tight">{t.sourceLabel}</label>
          
          <div 
            className={`flex-1 relative group rounded-2xl border-2 border-dashed transition-all duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' : 'border-slate-200 bg-white'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder={t.placeholder}
              className="w-full h-full p-4 text-sm bg-transparent resize-none outline-none text-slate-800 leading-relaxed placeholder:text-slate-300"
            />
            
            {isDragging && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-600/10 backdrop-blur-[1px] pointer-events-none rounded-2xl">
                <FileUp className="w-12 h-12 text-indigo-600 animate-bounce" />
                <p className="mt-2 text-indigo-700 font-bold text-sm">{t.dropFiles}</p>
              </div>
            )}

            {sourceText && (
              <button 
                onClick={clearSource}
                className="absolute top-3 right-3 p-1.5 bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-400 text-center font-medium mt-1">{t.supportedFormats}</p>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 sticky bottom-0">
        <button
          onClick={onProcess}
          disabled={loading || !sourceText.trim()}
          className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:shadow-none active:scale-[0.98]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {t.button}
        </button>
      </div>
    </div>
  );
};

export default SourcePanel;
