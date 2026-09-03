// backend/src/services/matchAI.service.ts
import OpenAI from 'openai';
import { ResumeModel } from '../models/Resume';
import { JobModel } from '../models/Job';
import { MatchAnalysisModel, IMatchAnalysis } from '../models/MatchAnalysis';
import { RESUME_JOB_MATCH_PROMPT } from '../integrations/ai/prompts/resumeJobMatch.prompt';

export class MatchAIService {
  public static async evaluateMatch(resumeId: string, jobId: string, userId: string): Promise<IMatchAnalysis> {
    const [resume, job] = await Promise.all([
      ResumeModel.findOne({ _id: resumeId, user: userId }),
      JobModel.findOne({ _id: jobId, user: userId }),
    ]);

    if (!resume) {
      throw { statusCode: 404, message: 'Resume not found', code: 'RESUME_NOT_FOUND' };
    }
    if (!job) {
      throw { statusCode: 404, message: 'Job not found', code: 'JOB_NOT_FOUND' };
    }

    const client = new OpenAI({ apiKey: process.env.AI_API_KEY });
    const response = await client.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: RESUME_JOB_MATCH_PROMPT },
        {
          role: 'user',
          content: `--- CANDIDATE RESUME ---\n${resume.rawText}\n\n--- TARGET JOB DESCRIPTION (${job.title} at ${job.company}) ---\n${job.description}`,
        },
      ],
      temperature: 0.2,
    });

    const parsed = JSON.parse(response.choices[0].message.content || '{}');

    const matchAnalysis = await MatchAnalysisModel.findOneAndUpdate(
      { resume: resume._id, job: job._id, user: userId },
      {
        $set: {
          matchScore: parsed.matchScore || 0,
          technicalMatch: parsed.technicalMatch || 0,
          experienceMatch: parsed.experienceMatch || 0,
          educationMatch: parsed.educationMatch || 0,
          keywordMatch: parsed.keywordMatch || 0,
          matchingSkills: parsed.matchingSkills || [],
          missingSkills: parsed.missingSkills || [],
          recommendations: parsed.recommendations || [],
          potentialWeaknesses: parsed.potentialWeaknesses || [],
        },
      },
      { upsert: true, new: true }
    );

    return matchAnalysis;
  }
}