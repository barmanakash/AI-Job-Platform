// backend/src/services/interviewAI.service.ts
import OpenAI from 'openai';
import { JobModel } from '../models/Job';
import { ResumeModel } from '../models/Resume';
import { InterviewPrepModel, IInterviewPrep } from '../models/InterviewPrep';
import { INTERVIEW_PREP_PROMPT } from '../integrations/ai/prompts/interviewPrep.prompt';

export class InterviewAIService {
  public static async generatePrep(jobId: string, resumeId: string, userId: string): Promise<IInterviewPrep> {
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
        { role: 'system', content: INTERVIEW_PREP_PROMPT },
        {
          role: 'user',
          content: `TARGET JOB (${job.title} at ${job.company}):\n${job.description}\n\nCANDIDATE RESUME:\n${resume.rawText}`,
        },
      ],
      temperature: 0.3,
    });

    const parsed = JSON.parse(response.choices[0].message.content || '{}');

    const prep = await InterviewPrepModel.findOneAndUpdate(
      { user: userId, job: job._id, resume: resume._id },
      {
        $set: {
          questions: parsed.questions || [],
        },
      },
      { upsert: true, new: true }
    );

    return prep;
  }
}