// backend/src/services/resumeAI.service.ts
import { AIService } from '../integrations/ai/AIService';
import { ResumeModel } from '../models/Resume';
import { ResumeAnalysisModel, IResumeAnalysis } from '../models/ResumeAnalysis';
import { RESUME_IMPROVEMENT_PROMPT } from '../integrations/ai/prompts/resumeImprovement.prompt';
import OpenAI from 'openai';

export interface ImprovementResult {
  originalText: string;
  suggestedText: string;
  explanation: string;
  keyImprovements: string[];
}

export class ResumeAIService {
  private static aiService = new AIService();

  public static async analyzeAndSaveResume(resumeId: string, userId: string): Promise<IResumeAnalysis> {
    const resume = await ResumeModel.findOne({ _id: resumeId, user: userId });
    if (!resume) {
      throw { statusCode: 404, message: 'Resume not found', code: 'NOT_FOUND' };
    }

    // Call AI provider abstraction layer
    const analysisResult = await this.aiService.analyzeResume(resume.rawText);

    // Save and link persistent historical analysis record
    const savedAnalysis = await ResumeAnalysisModel.create({
      resume: resume._id,
      user: userId,
      score: analysisResult.score,
      atsScore: analysisResult.atsScore,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      missingKeywords: analysisResult.missingKeywords,
      skillAnalysis: analysisResult.skillAnalysis,
      recommendations: analysisResult.recommendations,
      sectionScores: analysisResult.sectionScores,
    });

    return savedAnalysis;
  }

  public static async suggestImprovement(sectionText: string): Promise<ImprovementResult> {
    const client = new OpenAI({ apiKey: process.env.AI_API_KEY });
    
    const response = await client.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: RESUME_IMPROVEMENT_PROMPT },
        { role: 'user', content: `Target text section:\n"${sectionText}"` },
      ],
      temperature: 0.3,
    });

    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content) as ImprovementResult;
  }
}