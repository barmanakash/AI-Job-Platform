// backend/src/services/recommendationAI.service.ts
import OpenAI from 'openai';
import { ResumeModel } from '../models/Resume';
import { JobModel } from '../models/Job';
import { RecommendationModel, IRecommendation } from '../models/Recommendation';
import { RECOMMENDATION_PROMPT } from '../integrations/ai/prompts/recommendation.prompt';

export class RecommendationAIService {
  public static async generateRecommendations(
    resumeId: string,
    userId: string,
    limit: number = 5
  ): Promise<IRecommendation> {
    const resume = await ResumeModel.findOne({ _id: resumeId, user: userId });
    if (!resume) {
      throw { statusCode: 404, message: 'Resume not found', code: 'RESUME_NOT_FOUND' };
    }

    const availableJobs = await JobModel.find({ user: userId, isArchived: false }).limit(20);
    if (availableJobs.length === 0) {
      throw { statusCode: 400, message: 'No tracked jobs available to rank', code: 'NO_JOBS_FOUND' };
    }

    const jobPayload = availableJobs.map((j) => ({
      id: j._id.toString(),
      title: j.title,
      company: j.company,
      description: j.description.substring(0, 1000), // Trim for payload size efficiency
    }));

    const client = new OpenAI({ apiKey: process.env.AI_API_KEY });
    const response = await client.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: RECOMMENDATION_PROMPT },
        {
          role: 'user',
          content: `CANDIDATE RESUME:\n${resume.rawText}\n\nAVAILABLE JOBS TO RANK:\n${JSON.stringify(jobPayload)}`,
        },
      ],
      temperature: 0.2,
    });

    const parsed = JSON.parse(response.choices[0].message.content || '{}');
    const rankedJobs = (parsed.recommendations || []).slice(0, limit).map((r: any) => ({
      job: r.jobId,
      score: r.score,
      reasoning: r.reasoning,
      matchingSkillsCount: r.matchingSkillsCount || 0,
      missingSkillsCount: r.missingSkillsCount || 0,
    }));

    const recommendationDoc = await RecommendationModel.findOneAndUpdate(
      { user: userId, resume: resume._id },
      {
        $set: {
          recommendedJobs: rankedJobs,
        },
      },
      { upsert: true, new: true }
    ).populate('recommendedJobs.job', 'title company location salary workLocationType');

    return recommendationDoc;
  }
}