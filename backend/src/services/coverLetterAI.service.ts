// backend/src/services/coverLetterAI.service.ts
import OpenAI from 'openai';
import { JobModel } from '../models/Job';
import { ResumeModel } from '../models/Resume';
import { CoverLetterModel, ICoverLetter, CoverLetterTone } from '../models/CoverLetter';
import { COVER_LETTER_PROMPT } from '../integrations/ai/prompts/coverLetter.prompt';

export class CoverLetterAIService {
  public static async generateCoverLetter(params: {
    jobId: string;
    resumeId: string;
    userId: string;
    hiringManagerName?: string;
    tone: CoverLetterTone;
  }): Promise<ICoverLetter> {
    const [job, resume] = await Promise.all([
      JobModel.findOne({ _id: params.jobId, user: params.userId }),
      ResumeModel.findOne({ _id: params.resumeId, user: params.userId }),
    ]);

    if (!job) throw { statusCode: 404, message: 'Job not found', code: 'JOB_NOT_FOUND' };
    if (!resume) throw { statusCode: 404, message: 'Resume not found', code: 'RESUME_NOT_FOUND' };

    const client = new OpenAI({ apiKey: process.env.AI_API_KEY });
    const response = await client.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: COVER_LETTER_PROMPT },
        {
          role: 'user',
          content: `Company Name: ${job.company}\nJob Title: ${job.title}\nRequested Tone: ${params.tone}\nHiring Manager: ${
            params.hiringManagerName || 'Hiring Manager'
          }\n\nTarget Job Description:\n${job.description}\n\nCandidate Resume Details:\n${resume.rawText}`,
        },
      ],
      temperature: 0.4,
    });

    const parsed = JSON.parse(response.choices[0].message.content || '{}');

    const coverLetter = await CoverLetterModel.create({
      user: params.userId,
      job: job._id,
      resume: resume._id,
      companyName: job.company,
      hiringManagerName: params.hiringManagerName,
      tone: params.tone,
      content: parsed.content || '',
      keyHighlights: parsed.keyHighlights || [],
    });

    return coverLetter;
  }
}