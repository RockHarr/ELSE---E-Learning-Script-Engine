
import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Image as ImageIcon, Layers, Sparkles, Volume2, Loader2, Video, ChevronUp, ChevronDown, Wand2, RefreshCw, Trash2, Cpu, FileText, Info, Square, CircleHelp, ShieldAlert } from 'lucide-react';
import { ScriptBlock, BlockType } from '../types';
import { Language, translations } from '../i18n';
import { generateImage, generateAudio, generateVideo, smartRewrite, applyAuditToBlock } from '../services/gemini';

interface SmartEditorProps {
  script: { title: string; description: string; blocks: ScriptBlock[] };
  auditResult?: string | null;
  loading: boolean;
  onStopGeneration?: () => void;
  updateBlock: (id: string, updates: Partial<ScriptBlock>) => void;
  updateMeta: (updates: { title?: string; description?: string }) => void;
  removeBlock: (id: string) => void;
  reorderBlock: (id: string, direction: 'up' | 'down') => void;
  onRegenerateBlock: (block: ScriptBlock) => void;
  onImageGenerated: () => void;
  onAudioGenerated: (charCount: number) => void;
  onVideoGenerated: () => void;
  lang: Language;
}

const CostBadge: React.FC<{ type: 'free' | 'standard' | 'premium', lang: Language }> = ({ type, lang }) => {
  const t = translations[lang].costs;
  const styles = {
    free: "bg-emerald-100 text-emerald-700 border-emerald-200",
    standard: "bg-amber-100 text-amber-700 border-amber-200",
    premium: "bg-purple-100 text-purple-700 border-purple-200"
  };
  
  return (
    <span 
      className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${styles[type]} ml-1 cursor-help`}
      title={type === 'free' ? t.freeDesc : type === 'standard' ? t.standardDesc : t.premiumDesc}
    >
      {type === 'free' ? 'BASIC' : type === 'standard' ? 'CREDIT' : 'PREMIUM'}
    </span>
  );
};

const BlockIcon: React.FC<{ type: BlockType }> = ({ type }) => {
  switch (type) {
    case 'theory': return <BookOpen className="w-4 h-4 text-blue-500" />;
    case 'assessment': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    case 'media': return <ImageIcon className="w-4 h-4 text-purple-500" />;
    case 'steps': return <Layers className="w-4 h-4 text-orange-500" />;
    default: return null;
  }
};

const SmartEditor: React.FC<SmartEditorProps> = ({ script, auditResult, loading, onStopGeneration, updateBlock, updateMeta, removeBlock, reorderBlock, onRegenerateBlock, onImageGenerated, onAudioGenerated, onVideoGenerated, lang }) => {
  const t = translations[lang].editor;
  const tc = translations[lang].costs;
  const [generatingImgId, setGeneratingImgId] = useState<string | null>(null);
  const [generatingAudioId, setGeneratingAudioId] = useState<string | null>(null);
  const [generatingVideoId, setGeneratingVideoId] = useState<string | null>(null);
  const [rewritingId, setRewritingId] = useState<string | null>(null);
  const [auditingBlockId, setAuditingBlockId] = useState<string | null>(null);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [showMeta, setShowMeta] = useState(false);

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIndex(prev => (prev + 1) % t.loadingStates.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading, t.loadingStates]);

  const handleApplyAudit = async (block: ScriptBlock) => {
    if (!auditResult) return;
    setAuditingBlockId(block.id);
    try {
      const improvedBlock = await applyAuditToBlock(block, auditResult, lang);
      updateBlock(block.id, improvedBlock);
    } catch (e) {
      console.error(e);
    } finally {
      setAuditingBlockId(null);
    }
  };

  const handleSmartRewrite = async (block: ScriptBlock) => {
    setRewritingId(block.id);
    try {
      const newText = await smartRewrite(block.content, lang);
      updateBlock(block.id, { content: newText });
    } catch (e) {
      console.error(e);
    } finally {
      setRewritingId(null);
    }
  };

  const handleGenerateVideo = async (block: ScriptBlock) => {
    if (!block.visualPrompt) return;
    if (!(window as any).aistudio?.hasSelectedApiKey()) {
      await (window as any).aistudio?.openSelectKey();
    }
    setGeneratingVideoId(block.id);
    try {
      const videoUrl = await generateVideo(block.visualPrompt);
      if (videoUrl) {
        updateBlock(block.id, { generatedVideoUrl: videoUrl });
        onVideoGenerated();
      }
    } finally {
      setGeneratingVideoId(null);
    }
  };

  const handleGenerateImage = async (block: ScriptBlock) => {
    if (!block.visualPrompt) return;
    setGeneratingImgId(block.id);
    try {
      const imageUrl = await generateImage(block.visualPrompt);
      if (imageUrl) {
        updateBlock(block.id, { generatedImageUrl: imageUrl });
        onImageGenerated();
      }
    } finally {
      setGeneratingImgId(null);
    }
  };

  const handleGenerateAudio = async (block: ScriptBlock) => {
    setGeneratingAudioId(block.id);
    try {
      const audioUrl = await generateAudio(block.content, lang);
      if (audioUrl) {
        updateBlock(block.id, { generatedAudioUrl: audioUrl });
        onAudioGenerated(block.content.length);
      }
    } finally {
      setGeneratingAudioId(null);
    }
  };
  
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
          <Cpu className="w-8 h-8 text-indigo-600 relative z-10 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2 animate-pulse">{t.generating}</h3>
        <p className="text-sm text-slate-500 font-medium tracking-wide transition-opacity duration-500 h-5 text-center px-4">
          {t.loadingStates[loadingMsgIndex]}
        </p>
        
        <div className="mt-8 flex gap-1 mb-10">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
          ))}
        </div>

        <button
          onClick={onStopGeneration}
          className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 bg-white text-slate-500 hover:text-red-600 hover:border-red-100 hover:bg-red-50 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <Square className="w-3 h-3 fill-current" />
          {t.stopGeneration}
        </button>
      </div>
    );
  }

  if (script.blocks.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
          <Sparkles className="w-10 h-10 text-slate-200" />
        </div>
        <p className="text-slate-400 font-medium italic max-w-xs">{t.empty}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6 scroll-smooth">
      <div className="max-w-2xl mx-auto space-y-6 pb-20">
        <header className="space-y-4">
          <input
            className="text-3xl font-extrabold bg-white border border-slate-200 outline-none w-full text-slate-900 px-4 py-3 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
            value={script.title}
            onChange={(e) => updateMeta({ title: e.target.value })}
            placeholder={t.placeholder}
            aria-label="Module Title"
          />
          
          <div className="flex items-center justify-between px-2">
            <button 
              onClick={() => setShowMeta(!showMeta)}
              className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              {lang === 'es' ? 'Editar descripción del módulo' : 'Edit module description'}
            </button>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1 group relative">
                  <CircleHelp className="w-3.5 h-3.5 text-slate-300" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{tc.info}</span>
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-slate-800 text-white text-[9px] p-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    <p className="font-bold border-b border-white/10 pb-1 mb-1">{tc.info}</p>
                    <ul className="space-y-1">
                      <li><span className="text-emerald-400">BASIC:</span> {tc.freeDesc}</li>
                      <li><span className="text-amber-400">CREDIT:</span> {tc.standardDesc}</li>
                      <li><span className="text-purple-400">PREMIUM:</span> {tc.premiumDesc}</li>
                    </ul>
                  </div>
               </div>
            </div>
          </div>

          {showMeta && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <textarea
                className="w-full text-sm text-slate-600 bg-white border border-slate-200 outline-none rounded-xl px-4 py-3 min-h-[80px] resize-none shadow-sm focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-300"
                value={script.description}
                onChange={(e) => updateMeta({ description: e.target.value })}
                placeholder={lang === 'es' ? "Describe el objetivo de este módulo..." : "Describe the objective of this module..."}
              />
            </div>
          )}
        </header>

        {script.blocks.map((block, index) => (
          <div key={block.id} className="group relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100">
                  <BlockIcon type={block.type} />
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">{t.types[block.type]}</span>
                {auditResult && (
                  <button 
                    onClick={() => handleApplyAudit(block)}
                    disabled={auditingBlockId === block.id}
                    className="flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[8px] font-black rounded uppercase border border-indigo-200 hover:bg-indigo-200 transition-colors"
                  >
                    {auditingBlockId === block.id ? <Loader2 className="w-2 h-2 animate-spin" /> : <ShieldAlert className="w-2 h-2" />}
                    {t.applyAudit}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => reorderBlock(block.id, 'up')} disabled={index === 0} className="p-1.5 text-slate-400 hover:text-indigo-600 disabled:opacity-20 transition-colors" title="Move Up"><ChevronUp className="w-4 h-4"/></button>
                <button onClick={() => reorderBlock(block.id, 'down')} disabled={index === script.blocks.length - 1} className="p-1.5 text-slate-400 hover:text-indigo-600 disabled:opacity-20 transition-colors" title="Move Down"><ChevronDown className="w-4 h-4"/></button>
                
                <div className="flex items-center bg-white rounded-lg border border-slate-100 px-1 ml-2">
                  <button 
                    onClick={() => handleSmartRewrite(block)}
                    disabled={rewritingId === block.id}
                    className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex items-center"
                    title={t.smartRewrite}
                  >
                    {rewritingId === block.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                    <CostBadge type="free" lang={lang} />
                  </button>

                  {(block.type === 'theory' || block.type === 'media') && (
                    <button 
                      onClick={() => handleGenerateAudio(block)}
                      disabled={generatingAudioId === block.id}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center"
                      title="Generate Narration"
                    >
                      {generatingAudioId === block.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <CostBadge type="standard" lang={lang} />
                    </button>
                  )}

                  {(block.type === 'media' || block.type === 'theory') && (
                    <>
                      <button 
                        onClick={() => handleGenerateImage(block)}
                        disabled={generatingImgId === block.id}
                        className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center"
                        title="Generate Image"
                      >
                        {generatingImgId === block.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <CostBadge type="standard" lang={lang} />
                      </button>
                      <button 
                        onClick={() => handleGenerateVideo(block)}
                        disabled={generatingVideoId === block.id}
                        className="p-1.5 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors flex items-center"
                        title="Generate Video (Veo)"
                      >
                        {generatingVideoId === block.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Video className="w-3.5 h-3.5" />}
                        <CostBadge type="premium" lang={lang} />
                      </button>
                    </>
                  )}
                </div>
                
                <button 
                  onClick={() => onRegenerateBlock(block)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors ml-2"
                  title="Regenerate Content"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => removeBlock(block.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Block"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <input
                className="w-full font-bold text-slate-900 bg-white border border-slate-100 hover:border-slate-200 outline-none rounded-xl px-3 py-2.5 transition-all focus:ring-2 focus:ring-indigo-100"
                value={block.title}
                onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                placeholder="Block Title"
              />
              <textarea
                className="w-full text-sm text-slate-700 bg-white border border-slate-100 hover:border-slate-200 outline-none rounded-xl px-3 py-3 min-h-[100px] resize-none leading-relaxed focus:ring-2 focus:ring-indigo-100"
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="Pedagogical content..."
              />
              {(block.type === 'media' || block.type === 'theory') && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3 h-3" /> Visual Prompt
                  </label>
                  <input
                    className="w-full text-xs text-slate-600 bg-transparent border-none outline-none px-1"
                    value={block.visualPrompt || ''}
                    onChange={(e) => updateBlock(block.id, { visualPrompt: e.target.value })}
                    placeholder="Describe the visual asset..."
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartEditor;
