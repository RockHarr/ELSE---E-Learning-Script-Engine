
export type BlockType = 'theory' | 'assessment' | 'media' | 'steps';

export interface Tooltip {
  term: string;
  definition: string;
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface ScriptBlock {
  id: string;
  type: BlockType;
  title: string;
  content: string;
  tooltips?: Tooltip[];
  options?: QuizOption[];
  visualPrompt?: string;
  steps?: string[];
  competency?: string;
  generatedImageUrl?: string;
  generatedAudioUrl?: string;
  generatedVideoUrl?: string; // New property for Veo video
}

export interface UsageStats {
  inputTokens: number;
  outputTokens: number;
  imagesGenerated: number;
  audioCharsGenerated: number;
  videosGenerated: number; // New stat
}

export interface ELearningScript {
  title: string;
  description: string;
  audience: string;
  tone: string;
  blocks: ScriptBlock[];
  usage?: Partial<UsageStats>;
}

export type Tone = 'Academic' | 'Corporate' | 'Narrative' | 'Gamified';
export type Audience = 'Beginner' | 'Technical' | 'Executive';
