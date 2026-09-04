import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { DocumentExtractionService } from '../services/documentExtraction.service';
import { ResumeModel } from '../models/Resume';
import { ResumeAIService } from '../services/resumeAI.service';

export class ResumeController {
	public static async uploadResume(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!req.file) {
				res.status(400).json({ success: false, message: 'Resume document is required', code: 'NO_FILE' });
				return;
			}

			const userId = req.user!.userId;
			const extractedText = await DocumentExtractionService.extractTextFromBuffer(
				req.file.buffer,
				req.file.mimetype
			);

			const fileType = req.file.mimetype.includes('pdf') ? 'pdf' : 'docx';
			const resumeTitle = req.body.title || req.file.originalname.replace(/\.[^/.]+$/, '');
			const hasDefault = await ResumeModel.exists({ user: userId, isDefault: true });

			const resume = await ResumeModel.create({
				user: userId,
				title: resumeTitle,
				isDefault: !hasDefault,
				fileType,
				rawText: extractedText,
				sections: [
					{ title: 'Full Resume Content', content: extractedText },
				],
			});

			res.status(201).json({
				success: true,
				message: 'Resume uploaded and parsed successfully',
				data: resume,
			});
		} catch (error) {
			next(error);
		}
	}

	public static async getUserResumes(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			const resumes = await ResumeModel.find({ user: req.user!.userId }).sort({ updatedAt: -1 });
			res.status(200).json({ success: true, data: resumes });
		} catch (error) {
			next(error);
		}
	}

	public static async analyzeResume(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			const analysis = await ResumeAIService.analyzeAndSaveResume(req.params.id, req.user!.userId);

			res.status(200).json({
				success: true,
				message: 'Resume analyzed successfully',
				data: analysis,
			});
		} catch (error) {
			next(error);
		}
	}

	public static async improveSection(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
		try {
			const { text } = req.body;
			if (!text || text.trim().length === 0) {
				res.status(400).json({ success: false, message: 'Text section is required' });
				return;
			}

			const suggestion = await ResumeAIService.suggestImprovement(text);
			res.status(200).json({ success: true, data: suggestion });
		} catch (error) {
			next(error);
		}
	}
}
