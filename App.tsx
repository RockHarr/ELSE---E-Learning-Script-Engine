
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Download, Layout, Layers, FileJson, Info, Languages, DollarSign, Zap, Sparkles, Volume2, Video, ShieldCheck, X, Loader2, Copy, Check, FileCode, Printer, ChevronDown } from 'lucide-react';
import SourcePanel from './components/SourcePanel';
import SmartEditor from './components/SmartEditor';
import LivePreview from './components/LivePreview';
import Onboarding from './components/Onboarding';
import { generateScript, regenerateBlock, auditScript } from './services/gemini';
import { ELearningScript, ScriptBlock, Tone, Audience, UsageStats } from './types';
import { Language, translations } from './i18n';

const COST_PER_1M_TOKENS_INPUT = 0.075;
const COST_PER_1M_TOKENS_OUTPUT = 0.30;
const COST_PER_IMAGE = 0.03;
const COST_PER_1M_TTS_CHARS = 2.0;
const COST_PER_VIDEO = 0.50; 
const ONE_MILLION = 1000000;

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [sourceText, setSourceText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [auditing, setAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState<Tone>('Corporate');
  const [audience, setAudience] = useState<Audience>('Beginner');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [usage, setUsage] = useState<UsageStats>({
    inputTokens: 0,
    outputTokens: 0,
    imagesGenerated: 0,
    audioCharsGenerated: 0,
    videosGenerated: 0
  });
  
  const [script, setScript] = useState<ELearningScript>({
    title: '', description: '', audience: 'Beginner', tone: 'Corporate', blocks: []
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('else_onboarding_seen');
    if (hasSeenOnboarding) setShowOnboarding(false);
  }, []);

  const handleGenerate = async () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    setScript({ title: '', description: '', audience, tone, blocks: [] });
    setAuditResult(null);
    
    abortControllerRef.current = new AbortController();

    try {
      const { script: result, usage: currentUsage } = await generateScript(sourceText, audience, tone, lang);
      if (abortControllerRef.current?.signal.aborted) return;

      setScript(result);
      setUsage(prev => ({
        ...prev,
        inputTokens: prev.inputTokens + currentUsage.inputTokens,
        outputTokens: prev.outputTokens + currentUsage.outputTokens
      }));
    } catch (error: any) {
      if (error.name !== 'AbortError') console.error(error);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setLoading(false);
  };

  const handleAudit = async () => {
    if (script.blocks.length === 0) return;
    setAuditing(true);
    try {
      const result = await auditScript(script, lang);
      setAuditResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setAuditing(false);
    }
  };

  const handleCopyAudit = () => {
    if (auditResult) {
      navigator.clipboard.writeText(auditResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerateBlock = async (block: ScriptBlock) => {
    try {
      const result = await regenerateBlock(block, lang);
      setScript(prev => ({
        ...prev,
        blocks: prev.blocks.map(b => b.id === block.id ? { ...result, id: block.id } : b)
      }));
    } catch (error) {
      console.error("Regeneration failed", error);
    }
  };

  const reorderBlock = (id: string, direction: 'up' | 'down') => {
    const index = script.blocks.findIndex(b => b.id === id);
    if (index === -1) return;
    const newBlocks = [...script.blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setScript({ ...script, blocks: newBlocks });
  };

  const calculateTotalCost = () => {
    const textInputCost = (usage.inputTokens / ONE_MILLION) * COST_PER_1M_TOKENS_INPUT;
    const textOutputCost = (usage.outputTokens / ONE_MILLION) * COST_PER_1M_TOKENS_OUTPUT;
    const imageCost = usage.imagesGenerated * COST_PER_IMAGE;
    const videoCost = usage.videosGenerated * COST_PER_VIDEO;
    const audioCost = (usage.audioCharsGenerated / ONE_MILLION) * COST_PER_1M_TTS_CHARS;
    return (textInputCost + textOutputCost + imageCost + audioCost + videoCost).toFixed(4);
  };

  const exportAsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(script, null, 2));
    downloadFile(dataStr, `${script.title || 'else-script'}.json`);
    setShowExportMenu(false);
  };

  const exportAsHtml = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="${lang}">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${script.title}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" rel="stylesheet">
          <style>
              body { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
              .block-card { transition: transform 0.2s; }
              .block-card:hover { transform: translateY(-2px); }
              .assessment-card { background: linear-gradient(135deg, #312e81 0%, #0f172a 100%); }
              @media print { .no-print { display: none; } body { background-color: white; } }
          </style>
      </head>
      <body class="p-4 md:p-12">
          <div class="max-w-4xl mx-auto">
              <header class="mb-12 border-b border-slate-200 pb-8">
                  <div class="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.533 2.132a2 2 0 001.022 2.387l2.132.533a2 2 0 002.387-1.022l.533-2.132a2 2 0 00-1.022-2.387zM12 2a10 10 0 100 20 10 10 0 000-20z"/></svg>
                      ELSE E-Learning Package
                  </div>
                  <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">${script.title}</h1>
                  <p class="text-slate-500 text-lg leading-relaxed max-w-2xl">${script.description}</p>
              </header>

              <div class="space-y-16">
                  ${script.blocks.map((b, i) => `
                      <section class="block-card bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden ${b.type === 'assessment' ? 'assessment-card text-white' : ''}">
                          <div class="p-2 ${b.type === 'assessment' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'} border-b flex items-center justify-between px-6 py-3">
                             <span class="text-[10px] font-black ${b.type === 'assessment' ? 'text-indigo-200' : 'text-slate-400'} uppercase tracking-widest">Part ${i + 1} &bull; ${b.type}</span>
                          </div>
                          <div class="p-8 md:p-12">
                              <h2 class="text-2xl font-extrabold ${b.type === 'assessment' ? 'text-white' : 'text-slate-800'} mb-6">${b.title || (b.type === 'assessment' ? 'Knowledge Check' : '')}</h2>
                              <div class="prose ${b.type === 'assessment' ? 'prose-invert' : 'prose-slate'} max-w-none text-lg leading-relaxed">
                                  ${b.content}
                              </div>
                              
                              ${b.steps ? `
                                <div class="mt-8 space-y-4">
                                    ${b.steps.map((s, si) => `
                                        <div class="flex gap-4 items-start">
                                            <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">${si + 1}</div>
                                            <p class="pt-1 font-medium ${b.type === 'assessment' ? 'text-indigo-100' : 'text-slate-700'}">${s}</p>
                                        </div>
                                    `).join('')}
                                </div>
                              ` : ''}

                              ${(b.generatedImageUrl || b.generatedVideoUrl) ? `
                                  <div class="mt-10 rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-black aspect-video">
                                      ${b.generatedVideoUrl 
                                          ? `<video controls src="${b.generatedVideoUrl}" class="w-full h-full object-contain"></video>`
                                          : `<img src="${b.generatedImageUrl}" class="w-full h-full object-cover" alt="${b.title}">`
                                      }
                                  </div>
                              ` : ''}

                              ${b.options ? `
                                <div class="mt-10 space-y-4">
                                    ${b.options.map((o, oi) => `
                                        <div class="p-4 rounded-xl border ${b.type === 'assessment' ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50'} text-sm flex justify-between items-center">
                                            <div class="flex gap-3 items-center">
                                               <div class="w-6 h-6 rounded-lg ${b.type === 'assessment' ? 'bg-white/10' : 'bg-slate-200'} flex items-center justify-center text-[10px] font-bold">
                                                  ${String.fromCharCode(65 + oi)}
                                               </div>
                                               <span>${o.text}</span>
                                            </div>
                                            <div class="w-2 h-2 rounded-full ${o.isCorrect ? 'bg-indigo-400' : 'bg-white/10'}"></div>
                                        </div>
                                    `).join('')}
                                </div>
                              ` : ''}

                              ${b.generatedAudioUrl ? `
                                <div class="mt-8 p-4 bg-indigo-600/10 rounded-2xl border border-indigo-600/20 flex items-center gap-4">
                                    <div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                                    </div>
                                    <audio controls src="${b.generatedAudioUrl}" class="flex-1 h-8"></audio>
                                </div>
                              ` : ''}
                          </div>
                      </section>
                  `).join('')}
              </div>
              
              <footer class="mt-20 py-12 border-t border-slate-200 text-center text-slate-400 text-sm no-print">
                  Generated with <strong>ELSE Script Engine</strong> &bull; Instructional Blueprint v1.0
              </footer>
          </div>
      </body>
      </html>
    `;
    const dataStr = "data:text/html;charset=utf-8," + encodeURIComponent(htmlContent);
    downloadFile(dataStr, `${script.title || 'else-script'}.html`);
    setShowExportMenu(false);
  };

  const exportAsPdf = () => {
    window.print();
    setShowExportMenu(false);
  };

  const downloadFile = (data: string, name: string) => {
    const node = document.createElement('a');
    node.setAttribute("href", data);
    node.setAttribute("download", name);
    document.body.appendChild(node);
    node.click();
    node.remove();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 print:bg-white">
      {showOnboarding && <Onboarding onClose={() => {
        localStorage.setItem('else_onboarding_seen', 'true');
        setShowOnboarding(false);
      }} lang={lang} setLang={setLang} />}
      
      {auditResult && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm flex justify-end print:hidden">
          <div className="w-[500px] h-full bg-white shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="text-indigo-600" /> Auditoría Pedagógica
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopyAudit}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                  title="Copiar informe"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                </button>
                <button onClick={() => setAuditResult(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5"/></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="prose prose-slate prose-sm max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed border-l-2 border-indigo-50 pl-4 py-2">
                {auditResult}
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 print:hidden shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg"><Layers className="text-white w-5 h-5" /></div>
          <div>
            <h1 className="font-bold text-slate-800 text-sm tracking-tight uppercase">ELSE</h1>
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Script Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setLang(l => l === 'en' ? 'es' : 'en')} className="text-xs font-bold text-slate-600 uppercase flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200">
            <Languages className="w-4 h-4"/>
            {lang}
          </button>
          
          <button 
            onClick={handleAudit} 
            disabled={script.blocks.length === 0 || auditing}
            className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 text-xs font-bold rounded-lg transition-all border border-indigo-100"
          >
            {auditing ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <ShieldCheck className="w-3.5 h-3.5" />}
            {lang === 'es' ? 'AUDITAR CALIDAD' : 'AUDIT QUALITY'}
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)} 
              disabled={script.blocks.length === 0} 
              className="flex items-center gap-2 px-4 py-1.5 bg-slate-800 text-white hover:bg-slate-900 disabled:bg-slate-300 text-xs font-bold rounded-lg transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> {translations[lang].export}
              <ChevronDown className={`w-3 h-3 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showExportMenu && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden py-1 z-50 animate-in zoom-in-95 origin-top-right">
                <button onClick={exportAsJson} className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                  <FileCode className="w-4 h-4 text-indigo-500" /> {translations[lang].exportJson}
                </button>
                <button onClick={exportAsHtml} className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                  <Layout className="w-4 h-4 text-emerald-500" /> {translations[lang].exportHtml}
                </button>
                <button onClick={exportAsPdf} className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors border-t border-slate-100">
                  <Printer className="w-4 h-4 text-slate-400" /> {translations[lang].exportPdf}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden print:overflow-visible print:block">
        <section className="w-[320px] shrink-0 print:hidden">
          <SourcePanel 
            sourceText={sourceText} 
            setSourceText={setSourceText} 
            onProcess={handleGenerate} 
            onTryExample={() => setSourceText(lang === 'es' ? "Manual de seguridad para el manejo de residuos químicos en laboratorios industriales..." : "Security manual for chemical waste handling in industrial laboratories...")} 
            loading={loading} 
            tone={tone} 
            setTone={setTone} 
            audience={audience} 
            setAudience={setAudience} 
            lang={lang} 
          />
        </section>
        <section className="flex-1 min-w-[400px] print:hidden">
          <SmartEditor 
            script={script} 
            auditResult={auditResult}
            loading={loading}
            onStopGeneration={handleStopGeneration}
            updateBlock={(id, up) => setScript(s => ({ ...s, blocks: s.blocks.map(b => b.id === id ? {...b, ...up} : b)}))} 
            updateMeta={(updates) => setScript(s => ({ ...s, ...updates }))}
            removeBlock={(id) => setScript(s => ({ ...s, blocks: s.blocks.filter(b => b.id !== id)}))}
            reorderBlock={reorderBlock}
            onRegenerateBlock={handleRegenerateBlock} 
            onImageGenerated={() => setUsage(u => ({...u, imagesGenerated: u.imagesGenerated + 1}))}
            onAudioGenerated={(c) => setUsage(u => ({...u, audioCharsGenerated: u.audioCharsGenerated + c}))}
            onVideoGenerated={() => setUsage(u => ({...u, videosGenerated: u.videosGenerated + 1}))}
            lang={lang} 
          />
        </section>
        <section className="w-[450px] shrink-0 print:w-full print:bg-white"><LivePreview script={script} lang={lang} /></section>
      </main>

      <footer className="h-10 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[10px] text-slate-400 font-medium shrink-0 print:hidden">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 rounded border border-slate-100"><Zap className="w-3 h-3 text-yellow-500" /><span>Tokens: {usage.inputTokens + usage.outputTokens}</span></div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-purple-50 rounded border border-purple-100 text-purple-600"><Sparkles className="w-3 h-3" /><span>Imágenes: {usage.imagesGenerated}</span></div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-pink-50 rounded border border-pink-100 text-pink-600"><Video className="w-3 h-3" /><span>Videos: {usage.videosGenerated}</span></div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 rounded border border-blue-100 text-blue-600"><Volume2 className="w-3 h-3" /><span>Audio: {usage.audioCharsGenerated} chars</span></div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 font-bold">
          <DollarSign className="w-3 h-3" /> {lang === 'es' ? 'VALOR API ESTIMADO' : 'ESTIMATED API VALUE'}: ${calculateTotalCost()} USD
        </div>
      </footer>
    </div>
  );
};

export default App;
