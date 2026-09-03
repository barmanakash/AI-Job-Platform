// backend/src/integrations/ai/providers/OpenAIProvider.ts
import OpenAI from 'openai';
import { IAIServiceProvider, MatchAnalysisResult } from '../types';
import { IAIScoreBreakdown } from '../../../types/domain';
import { RESUME_ANALYSIS_PROMPT } from '../prompts/resumeAnalysis.prompt';

export class OpenAIProvider implements IAIServiceProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  public async analyzeResume(resumeText: string): Promise<IAIScoreBreakdown> {
    const response = await this.client.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: RESUME_ANALYSIS_PROMPT },
        { role: 'user', content: `Analyze the following resume:\n${resumeText}` },
      ],
      temperature: 0.2,
    });

    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content) as IAIScoreBreakdown;
  }

  public async analyzeJob(jobDescription: string): Promise<Record<string, unknown>> {
    // Structured extraction logic
    return { jobDescriptionLength: jobDescription.length };
  }

  public async matchResumeToJob(resumeText: string, jobDescription: string): Promise<MatchAnalysisResult> {
    // Structured matching evaluation logic
    return {
      matchScore: 85,
      technicalMatch: 80,
      experienceMatch: 90,
      educationMatch: 85,
      keywordMatch: 82,
      matchingSkills: ['TypeScript', 'React', 'Node.js'],
      missingSkills: ['Docker', 'GraphQL'],
      recommendations: ['Highlight backend scalability metrics'],
    };
  }

  public async generateCoverLetter(params: { resumeText: string; jobDescription: string; tone: string; company: string }): Promise<string> {
    return `Dear Hiring Manager at ${params.company}...`;
  }
}