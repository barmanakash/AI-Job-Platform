// backend/src/services/skillGapAI.service.ts
import OpenAI from 'openai';
import { JobModel } from '../models/Job';
import { ResumeModel } from '../models/Resume';
import { SkillGapModel, ISkillGap } from '../models/SkillGap';
import { SKILL_GAP_PROMPT } from '../integrations/ai/prompts/skillGap.prompt';

export class SkillGapAIService {
  public static async generateSkillGapMatrix(jobId: string, resumeId: string, userId: string): Promise<ISkillGap> {
    const [job, resume] = await Promise.all([
      JobModel.findOne({ _id: jobId, user: userId }),
      ResumeModel.findOne({ _id: resumeId, user: userId }),
    ]);

    if (!job) throw { statusCode: 404, message: 'Job not found', code: 'JOB_NOT_FOUND' };
    if (!resume) throw { statusCode: 404, message: 'Resume not found', code: 'RESUME_NOT_FOUND' };

    const client = new OpenAI({ apiKey: process.env.AI_API_KEY });
    const response = await client.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SKILL_GAP_PROMPT },
        {
          role: 'user',
          content: `--- CANDIDATE RESUME ---\n${resume.rawText}\n\n--- TARGET JOB (${job.title} at ${job.company}) ---\n${job.description}`,
        },
      ],
      temperature: 0.2,
    });

    const parsed = JSON.parse(response.choices[0].message.content || '{}');

    const result = await SkillGapModel.findOneAndUpdate(
      { user: userId, job: job._id, resume: resume._id },
      {
        $set: {
          matchingSkills: parsed.matchingSkills || [],
          missingSkills: parsed.missingSkills || [],
          roadmap: parsed.roadmap || [],
        },
      },
      { upsert: true, new: true }
    );

    return result;
  }
}