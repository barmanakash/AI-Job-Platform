// backend/src/services/jobAI.service.ts
import OpenAI from 'openai';
import { JobModel } from '../models/Job';
import { JobAnalysisModel, IJobAnalysis } from '../models/JobAnalysis';
import { JOB_ANALYSIS_PROMPT } from '../integrations/ai/prompts/jobAnalysis.prompt';

export class JobAIService {
  public static async analyzeJobDescription(jobId: string, userId: string): Promise<IJobAnalysis> {
    const job = await JobModel.findOne({ _id: jobId, user: userId });
    if (!job) {
      throw { statusCode: 404, message: 'Job posting not found', code: 'NOT_FOUND' };
    }

    const client = new OpenAI({ apiKey: process.env.AI_API_KEY });
    const response = await client.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: JOB_ANALYSIS_PROMPT },
        { role: 'user', content: `Job Title: ${job.title}\nCompany: ${job.company}\nDescription:\n${job.description}` },
      ],
      temperature: 0.2,
    });

    const parsed = JSON.parse(response.choices[0].message.content || '{}');

    // Auto-update core job document with extracted skills if initially empty
    if (job.requiredSkills.length === 0 && parsed.extractedRequiredSkills) {
      job.requiredSkills = parsed.extractedRequiredSkills;
      await job.save();
    }

    const jobAnalysis = await JobAnalysisModel.findOneAndUpdate(
      { job: job._id },
      {
        $set: {
          job: job._id,
          user: userId,
          extractedRequiredSkills: parsed.extractedRequiredSkills || [],
          extractedPreferredSkills: parsed.extractedPreferredSkills || [],
          responsibilities: parsed.responsibilities || [],
          experienceLevel: parsed.experienceLevel || 'Not Specified',
          educationRequirements: parsed.educationRequirements || [],
          importantKeywords: parsed.importantKeywords || [],
          technologies: parsed.technologies || [],
          softSkills: parsed.softSkills || [],
        },
      },
      { upsert: true, new: true }
    );

    return jobAnalysis;
  }
}