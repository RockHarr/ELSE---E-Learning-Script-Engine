
import React, { useState, useEffect, useMemo } from 'react';
import { Eye, ChevronRight, HelpCircle, ImageIcon, Volume2, LayoutList, Monitor, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ScriptBlock, Tooltip as TooltipType } from '../types';
import { Language, translations } from '../i18n';

interface LivePreviewProps {
  script: { title: string; description: string; blocks: ScriptBlock[] };
  lang: Language;
}

type ViewMode = 'scroll' | 'slides';

const RenderTooltip = ({ term, definition }: TooltipType) => (
  <span className="relative group inline-block text-indigo-600 font-medium underline decoration-indigo-300 decoration-wavy cursor-help mx-0.5 print:no-underline print:text-slate-800">
    {term}
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 leading-relaxed text-center print:hidden">
      {definition}
      <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></span>
    </span>
  </span>
);

const AudioPlayer: React.FC<{ url: string }> = ({ url }) => (
  <div className="flex items-center gap-3 bg-indigo-50/50 p-2 rounded-xl border border-indigo-100 mt-4 animate-in slide-in-from-top-2 print:hidden">
    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
      <Volume2 className="w-4 h-4" />
    </div>
    <audio controls className="h-8 flex-1 outline-none opacity-80 scale-90 origin-left">
      <source src={url} type="audio/wav" />
    </audio>
  </div>
);

const PreviewBlock: React.FC<{ block: ScriptBlock; t: any }> = ({ block, t }) => {
  const contentWithTooltips = useMemo(() => {
    if (!block.tooltips || block.tooltips.length === 0) return block.content;
    let parts: (string | React.ReactNode)[] = [block.content];
    block.tooltips.forEach((tt, ttIdx) => {
      const newParts: (string | React.ReactNode)[] = [];
      parts.forEach((part, pIdx) => {
        if (typeof part !== 'string') { newParts.push(part); return; }
        const split = part.split(new RegExp(`(${tt.term})`, 'i'));
        split.forEach((s, sIdx) => {
          if (s.toLowerCase() === tt.term.toLowerCase()) {
            newParts.push(<RenderTooltip key={`tt-${ttIdx}-${pIdx}-${sIdx}`} {...tt} />);
          } else if (s !== '') { newParts.push(s); }
        });
      });
      parts = newParts;
    });
    return parts;
  }, [block.content, block.tooltips]);

  const renderMultimedia = () => {
    if (!block.generatedVideoUrl && !block.generatedImageUrl) return null;
    return (
      <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 aspect-video flex items-center justify-center relative group print:shadow-none print:border-slate-100">
        {block.generatedVideoUrl ? (
          <video controls className="w-full h-full object-contain" src={block.generatedVideoUrl} />
        ) : (
          <img src={block.generatedImageUrl} alt={block.title} className="w-full h-full object-cover" />
        )}
      </div>
    );
  };

  switch (block.type) {
    case 'theory':
      return (
        <div className="space-y-4 animate-in fade-in duration-500 print:break-inside-avoid">
          <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight leading-tight">{block.title}</h3>
          <div className="h-1 w-12 bg-indigo-500 rounded-full mb-4 print:hidden"></div>
          <div className="text-slate-600 leading-relaxed text-base prose-slate max-w-none">
            {contentWithTooltips}
          </div>
          {renderMultimedia()}
          {block.generatedAudioUrl && <AudioPlayer url={block.generatedAudioUrl} />}
        </div>
      );
    case 'media':
      return (
        <div className="space-y-6 animate-in zoom-in-95 duration-500 print:break-inside-avoid">
          {renderMultimedia() || (
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-900 aspect-video flex items-center justify-center relative group">
              <div className="flex flex-col items-center justify-center text-slate-500 gap-3">
                <ImageIcon className="w-10 h-10 opacity-20" />
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{t.visualSuggestion}</p>
              </div>
            </div>
          )}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm print:shadow-none print:p-0 print:border-none">
            <h4 className="font-bold text-slate-900 text-lg mb-2">{block.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{block.content}</p>
            {block.generatedAudioUrl && <AudioPlayer url={block.generatedAudioUrl} />}
          </div>
        </div>
      );
    case 'assessment':
      return (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-2xl space-y-6 animate-in slide-in-from-bottom-4 duration-500 print:bg-slate-50 print:text-slate-900 print:border print:border-slate-200 print:shadow-none print:rounded-2xl print:break-inside-avoid overflow-hidden w-full">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-200 print:bg-slate-200 print:text-slate-600">
              <HelpCircle className="w-3 h-3" /> {t.knowledgeCheck}
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold leading-snug">{block.content}</h3>
          <div className="grid gap-3">
            {block.options?.map((opt, idx) => (
              <div key={idx} className="group w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm flex justify-between items-center print:border-slate-200 print:bg-white cursor-default">
                <div className="flex gap-4 items-center flex-1">
                   <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-xs font-bold shrink-0 border border-white/5 group-hover:border-indigo-400/50 group-hover:bg-indigo-500/20 transition-all print:border-slate-200">
                      {String.fromCharCode(65 + idx)}
                   </div>
                   <span className="font-medium text-indigo-50 leading-relaxed">{opt.text}</span>
                </div>
                {opt.isCorrect && (
                   <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-4 animate-in zoom-in-50" />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    case 'steps':
      return (
        <div className="space-y-6 animate-in fade-in duration-500 print:break-inside-avoid">
          <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight leading-tight">{block.title}</h3>
          <div className="space-y-3">
            {block.steps?.map((step, idx) => (
              <div key={idx} className="flex gap-5 items-start p-5 bg-white rounded-2xl border border-slate-100 shadow-sm print:shadow-none print:border-slate-200 transition-transform hover:translate-x-1">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-indigo-600 text-white text-sm flex items-center justify-center font-bold print:bg-slate-800 shadow-lg shadow-indigo-100">{idx + 1}</div>
                <p className="text-sm text-slate-700 leading-relaxed pt-1 font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>
      );
    default: return null;
  }
};

const LivePreview: React.FC<LivePreviewProps> = ({ script, lang }) => {
  const t = translations[lang].preview;
  const [viewMode, setViewMode] = useState<ViewMode>('scroll');
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSlides = script.blocks.length;

  const nextSlide = () => {
    if (currentIndex < totalSlides - 1) setCurrentIndex(prev => prev + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'slides') return;
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentIndex, totalSlides]);

  return (
    <div className="h-full flex flex-col bg-slate-50 border-l border-slate-200 relative print:border-none print:bg-white">
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 print:hidden shadow-sm">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-slate-400" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.label}</span>
        </div>
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('scroll')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${viewMode === 'scroll' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            {t.scroll}
          </button>
          <button 
            onClick={() => setViewMode('slides')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${viewMode === 'slides' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Monitor className="w-3.5 h-3.5" />
            {t.slides}
          </button>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto print:overflow-visible ${viewMode === 'slides' ? 'flex items-center justify-center p-4 md:p-8 bg-slate-100/50 print:block print:bg-white print:p-0' : 'bg-white p-8 scroll-smooth print:p-0'}`}>
        <div className={`mx-auto pb-24 print:pb-0 print:max-w-none ${viewMode === 'slides' ? 'w-full max-w-2xl print:space-y-12' : 'max-w-xl space-y-12'}`}>
          <header className="border-b border-slate-100 pb-10 print:mb-12 print:border-slate-300">
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight tracking-tight print:text-5xl">{script.title || t.defaultTitle}</h1>
            {script.description && <p className="text-slate-500 mt-4 text-sm leading-relaxed border-l-4 border-indigo-100 pl-4 py-1 print:text-base print:border-slate-300">{script.description}</p>}
          </header>

          {viewMode === 'scroll' || (typeof window !== 'undefined' && window.matchMedia('print').matches) ? (
            script.blocks.map((block) => (
              <section key={block.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700 print:mb-16">
                <PreviewBlock block={block} t={t} />
              </section>
            ))
          ) : (
            <div className="w-full relative flex flex-col gap-6">
              {totalSlides > 0 ? (
                <>
                  <div key={script.blocks[currentIndex].id} className="min-h-[400px] flex flex-col justify-center items-center">
                    <PreviewBlock block={script.blocks[currentIndex]} t={t} />
                  </div>
                  
                  <div className="flex items-center justify-between mt-8 no-print px-4">
                    <button 
                      onClick={prevSlide}
                      disabled={currentIndex === 0}
                      className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-600 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <span className="text-indigo-600">{currentIndex + 1}</span> {t.of} {totalSlides}
                    </div>

                    <button 
                      onClick={nextSlide}
                      disabled={currentIndex === totalSlides - 1}
                      className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-600 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-20 opacity-30 italic text-slate-400">
                  {translations[lang].editor.empty}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
