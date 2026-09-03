// backend/src/integrations/ai/AIService.ts
import { IAIServiceProvider, MatchAnalysisResult } from './types';
import { OpenAIProvider } from './providers/OpenAIProvider';
import { IAIScoreBreakdown } from '../../types/domain';

export class AIService implements IAIServiceProvider {
  private provider: IAIServiceProvider;

  constructor() {
    const providerType = process.env.AI_PROVIDER || 'OPENAI';
    switch (providerType) {
      case 'OPENAI':
      default:
        this.provider = new OpenAIProvider(process.env.AI_API_KEY || '');
        break;
    }
  }

  public async analyzeResume(resumeText: string): Promise<IAIScoreBreakdown> {
    return this.provider.analyzeResume(resumeText);
  }

  public async analyzeJob(jobDescription: string): Promise<Record<string, unknown>> {
    return this.provider.analyzeJob(jobDescription);
  }

  public async matchResumeToJob(resumeText: string, jobDescription: string): Promise<MatchAnalysisResult> {
    return this.provider.matchResumeToJob(resumeText, jobDescription);
  }

  public async generateCoverLetter(params: { resumeText: string; jobDescription: string; tone: string; company: string }): Promise<string> {
    return this.provider.generateCoverLetter(params);
  }
}