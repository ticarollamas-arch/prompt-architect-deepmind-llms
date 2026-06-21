/**
 * Type declarations for the Prompt Architect application.
 */

export interface GeneratorOptions {
  category?: string;
  tone?: string;
  targetLLM?: string;
  depth?: 'standard' | 'deep' | 'exhaustive';
}

export interface PromptArchitectResponse {
  objective: string;
  architecture: string;
  functionalRequirements: string;
  nonFunctionalRequirements: string;
  security: string;
  uxUi: string;
  directoryStructure: string;
  technologyStack: string;
  scalability: string;
  finalPrompt: string;
  meta: {
    originalPrompt: string;
    ethicalShiftApplied: boolean;
    shiftReasoning: string;
    categoryDetected: string;
    estimatedComplexity: 'Low' | 'Medium' | 'High' | 'Enterprise';
    targetLLM: string;
  };
}

export interface SavedPrompt {
  id: string;
  timestamp: string;
  title: string;
  originalInput: string;
  options: GeneratorOptions;
  response: PromptArchitectResponse;
}
