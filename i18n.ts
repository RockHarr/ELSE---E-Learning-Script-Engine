
export type Language = 'en' | 'es';

export const translations = {
  en: {
    appTitle: "ELSE",
    appSubtitle: "Script Engine",
    export: "EXPORT",
    exportJson: "JSON Blueprint",
    exportHtml: "Interactive Player (HTML)",
    exportPdf: "Printable Document (PDF)",
    howItWorks: "How it works",
    footerText: "E-Learning Structured Blueprint Engine v1.0",
    atomicComponents: "Atomic Components",
    target: "Target",
    tone: "Tone",
    
    costs: {
      free: "Free Tier",
      standard: "Low Cost",
      premium: "Premium / Paid",
      info: "Resource Info",
      freeDesc: "This action typically uses your free API quota.",
      standardDesc: "Small charge per image or character.",
      premiumDesc: "High-quality resource. Requires paid billing account."
    },

    onboarding: {
      selectLanguage: "Choose your language",
      welcome: "Welcome to ELSE",
      title: "Transform Chaos into Learning",
      description: "ELSE is an AI-powered engine designed to help Instructional Designers build structured, component-based scripts in seconds.",
      button: "Start Building Now",
      footer: "Built with Atomic Design Principles & Gemini 3.0",
      step1: { title: "Ingestion", desc: "Paste raw notes, manuals, or research text into the source panel." },
      step2: { title: "Processing", desc: "Gemini AI analyzes and segments content into pedagogical atoms." },
      step3: { title: "Curation", desc: "Refine titles, definitions, and quizzes in the smart editor." },
      step4: { title: "Export", desc: "Download a validated JSON blueprint ready for your LMS or dev team." }
    },

    source: {
      title: "Content Ingestion",
      subtitle: "Paste or upload your raw source content.",
      audienceLabel: "Target Audience",
      toneLabel: "Narrative Tone",
      sourceLabel: "Source Text",
      placeholder: "Paste your source text here...",
      button: "Generate Script",
      tryExample: "Try an Example",
      uploadFile: "Upload Document",
      dropFiles: "Drop your file here",
      supportedFormats: "Supports .txt, .md, .pdf (text only)",
      audiences: { Beginner: "Beginner", Technical: "Technical / Professional", Executive: "Executive / Management" },
      tones: { Academic: "Academic / Formal", Corporate: "Corporate / Direct", Narrative: "Storytelling", Gamified: "Gamified / Casual" }
    },

    editor: {
      placeholder: "Untitled Module",
      subtitle: "Instructional Blueprint",
      empty: "Ready for magic. Add content in the left panel.",
      generating: "Generating pedagogical structure...",
      stopGeneration: "Stop Generation",
      loadingStates: [
        "Analyzing source content...",
        "Identifying key concepts...",
        "Structuring atomic blocks...",
        "Designing knowledge checks...",
        "Drafting visual suggestions...",
        "Refining narrative tone..."
      ],
      regenerate: "Regenerate this block",
      applyAudit: "Improve based on Audit",
      smartRewrite: "Smart Rewrite",
      remove: "Remove block",
      types: { theory: "theory", assessment: "assessment", media: "media", steps: "steps" }
    },

    preview: {
      label: "Module Preview",
      defaultTitle: "New Module",
      knowledgeCheck: "Knowledge Check",
      visualSuggestion: "Visual Suggestion",
      viewMode: "View Mode",
      scroll: "Scroll",
      slides: "Slides",
      next: "Next",
      prev: "Prev",
      of: "of"
    }
  },
  es: {
    appTitle: "ELSE",
    appSubtitle: "Motor de Guiones",
    export: "EXPORTAR",
    exportJson: "Blueprint JSON",
    exportHtml: "Reproductor Interactivo (HTML)",
    exportPdf: "Documento Imprimible (PDF)",
    howItWorks: "Cómo funciona",
    footerText: "Motor de Planificación Estructurada E-Learning v1.0",
    atomicComponents: "Componentes Atómicos",
    target: "Público",
    tone: "Tono",

    costs: {
      free: "Nivel Gratuito",
      standard: "Costo Bajo",
      premium: "Premium / Pago",
      info: "Info de Recursos",
      freeDesc: "Esta acción suele usar tu cuota gratuita de API.",
      standardDesc: "Pequeño cargo por imagen o caracteres.",
      premiumDesc: "Recurso de alta calidad. Requiere cuenta de facturación activa."
    },

    onboarding: {
      selectLanguage: "Selecciona tu idioma",
      welcome: "Bienvenido a ELSE",
      title: "Transforma el Caos en Aprendizaje",
      description: "ELSE es un motor impulsado por IA diseñado para ayudar a diseñadores instruccionales a crear guiones estructurados basados en componentes en segundos.",
      button: "Comenzar ahora",
      footer: "Construido con Principios de Diseño Atómico y Gemini 3.0",
      step1: { title: "Ingesta", desc: "Pega notas crudas, manuales o textos de investigación en el panel de fuentes." },
      step2: { title: "Procesamiento", desc: "La IA de Gemini analiza y segmenta el contenido en átomos pedagógicos." },
      step3: { title: "Curaduría", desc: "Refina títulos, definiciones y cuestionarios en el editor inteligente." },
      step4: { title: "Exportación", desc: "Descarga un esquema JSON validado listo para tu LMS o equipo de desarrollo." }
    },

    source: {
      title: "Ingesta de Contenido",
      subtitle: "Pega o sube tu contenido fuente.",
      audienceLabel: "Público Objetivo",
      toneLabel: "Tono Narrativo",
      sourceLabel: "Texto Fuente",
      placeholder: "Pega el texto fuente aquí...",
      button: "Generar Guion",
      tryExample: "Ver un ejemplo",
      uploadFile: "Subir Documento",
      dropFiles: "Suelta tu archivo aquí",
      supportedFormats: "Soporta .txt, .md, .pdf (solo texto)",
      audiences: { Beginner: "Principiante", Technical: "Técnico / Profesional", Executive: "Ejecutivo / Directivo" },
      tones: { Academic: "Académico / Formal", Corporate: "Corporativo / Directo", Narrative: "Narrativo / Storytelling", Gamified: "Gamificado / Casual" }
    },

    editor: {
      placeholder: "Módulo sin título",
      subtitle: "Plano Instruccional",
      empty: "Listo para la magia. Añade contenido en el panel izquierdo.",
      generating: "Generando estructura pedagógica...",
      stopGeneration: "Detener Generación",
      loadingStates: [
        "Analizando contenido fuente...",
        "Identificando conceptos clave...",
        "Estructurando bloques atómicos...",
        "Diseñando evaluaciones...",
        "Creando sugerencias visuales...",
        "Refinando el tono narrativo..."
      ],
      regenerate: "Regenerar este bloque",
      applyAudit: "Mejorar según Auditoría",
      smartRewrite: "Reescritura Inteligente",
      remove: "Eliminar bloque",
      types: { theory: "teoría", assessment: "evaluación", media: "multimedia", steps: "pasos" }
    },

    preview: {
      label: "Vista Previa del Módulo",
      defaultTitle: "Nuevo Módulo",
      knowledgeCheck: "Verificación de Conocimientos",
      visualSuggestion: "Sugerencia Visual",
      viewMode: "Modo de Vista",
      scroll: "Continuo",
      slides: "Diapositivas",
      next: "Siguiente",
      prev: "Anterior",
      of: "de"
    }
  }
};
