
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ELearningScript, ScriptBlock } from "../types";
import { Language } from "../i18n";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SCRIPT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    blocks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, description: "MUST BE strictly one of: theory, assessment, media, steps" },
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          competency: { type: Type.STRING },
          tooltips: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definition: { type: Type.STRING }
              }
            }
          },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                isCorrect: { type: Type.BOOLEAN },
                feedback: { type: Type.STRING }
              }
            }
          },
          visualPrompt: { type: Type.STRING },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["id", "type", "title", "content"]
      }
    }
  },
  required: ["title", "description", "blocks"]
};

export const generateScript = async (
  sourceText: string,
  audience: string,
  tone: string,
  lang: Language
): Promise<{ script: ELearningScript, usage: { inputTokens: number, outputTokens: number } }> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Act as an expert Instructional Designer.
      Transform content into modular blocks using Atomic Design.
      IMPORTANT: Use ONLY the following block types: theory, assessment, media, steps.
      Language: ${lang === 'es' ? 'Spanish' : 'English'}.
      Tone: ${tone}.
      Audience: ${audience}.
      RAW CONTENT: ${sourceText}
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: SCRIPT_SCHEMA,
    }
  });

  const script = JSON.parse(response.text || '{}');
  const usage = {
    inputTokens: response.usageMetadata?.promptTokenCount || 0,
    outputTokens: response.usageMetadata?.candidatesTokenCount || 0
  };

  return { script, usage };
};

export const regenerateBlock = async (
  block: ScriptBlock,
  lang: Language
): Promise<ScriptBlock> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      As an Instructional Designer, regenerate the following e-learning block to improve its clarity, engagement, and pedagogical value.
      Maintain the same block type and core topic but refine the content and structure.
      BLOCK TO REGENERATE: ${JSON.stringify(block)}
      Language: ${lang === 'es' ? 'Spanish' : 'English'}.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: SCRIPT_SCHEMA.properties.blocks.items,
    }
  });
  return JSON.parse(response.text || JSON.stringify(block));
};

export const applyAuditToBlock = async (
  block: ScriptBlock, 
  audit: string, 
  lang: Language
): Promise<ScriptBlock> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      You are an Instructional Designer. Improve this specific block based on the pedagogical audit provided.
      Prioritize fixing items marked as 'Critical' (🔴) and 'Improvements' (🟡).
      BLOCK TO IMPROVE: ${JSON.stringify(block)}
      FULL AUDIT CONTEXT: ${audit}
      Language: ${lang === 'es' ? 'Spanish' : 'English'}.
      Return the IMPROVED block in JSON format following the original schema.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: SCRIPT_SCHEMA.properties.blocks.items,
    }
  });
  return JSON.parse(response.text || JSON.stringify(block));
};

export const smartRewrite = async (text: string, lang: Language): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Rewrite the following e-learning content to be more engaging, clear, and professional. 
    Language: ${lang === 'es' ? 'Spanish' : 'English'}. 
    TEXT: ${text}. 
    Return ONLY the rewritten text, no commentary.`,
  });
  return response.text || text;
};

export const generateVideo = async (prompt: string): Promise<string | undefined> => {
  try {
    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let operation = await aiInstance.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Educational e-learning video style: ${prompt}`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await aiInstance.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
      return `${downloadLink}&key=${process.env.API_KEY}`;
    }
  } catch (error) {
    console.error("Video generation failed", error);
  }
  return undefined;
};

export const auditScript = async (script: ELearningScript, lang: Language): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `
      Audit this e-learning script from a pedagogical perspective. 
      Analyze: Learning objectives, cognitive load, assessment validity, and tone consistency.
      Language: ${lang === 'es' ? 'Spanish' : 'English'}.
      SCRIPT: ${JSON.stringify(script)}
      Format the response in clean Markdown with sections: 🔴 Critical, 🟡 Improvements, 🟢 Strengths.
    `,
    config: {
      thinkingConfig: { thinkingBudget: 2000 }
    }
  });
  return response.text || "";
};

export const generateImage = async (prompt: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High quality clean e-learning style illustration: ${prompt}` }],
      },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed", error);
  }
  return undefined;
};

function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function pcmToWav(pcmData: Uint8Array, sampleRate: number): Blob {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const length = pcmData.length;
  view.setUint32(0, 0x46464952, true); // "RIFF"
  view.setUint32(4, 36 + length, true);
  view.setUint32(8, 0x45564157, true); // "WAVE"
  view.setUint32(12, 0x20746d66, true); // "fmt "
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); 
  view.setUint16(22, 1, true); 
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  view.setUint32(36, 0x61746164, true); 
  view.setUint32(40, length, true);
  return new Blob([header, pcmData], { type: 'audio/wav' });
}

export const generateAudio = async (text: string, lang: Language): Promise<string | undefined> => {
  try {
    const voiceName = lang === 'es' ? 'Kore' : 'Zephyr';
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Professional narrator: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName } },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const pcmData = decodeBase64(base64Audio);
      const wavBlob = pcmToWav(pcmData, 24000);
      return URL.createObjectURL(wavBlob);
    }
  } catch (error) {
    console.error("Audio generation failed", error);
  }
  return undefined;
};
