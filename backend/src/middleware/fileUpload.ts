// backend/src/middleware/fileUpload.ts
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit

const allowedMimeTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/msword', // doc
];

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('INVALID_FILE_TYPE: Only PDF and DOCX documents are supported.'));
  }
};

export const uploadResumeMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});