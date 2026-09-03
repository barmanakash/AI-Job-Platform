// backend/src/services/documentExtraction.service.ts
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export class DocumentExtractionService {
  public static async extractTextFromBuffer(buffer: Buffer, mimeType: string): Promise<string> {
    if (mimeType === 'application/pdf') {
      return this.extractFromPdf(buffer);
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      return this.extractFromDocx(buffer);
    }
    throw new Error('UNSUPPORTED_FILE_TYPE');
  }

  private static async extractFromPdf(buffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(buffer);
      const cleaned = data.text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
      if (!cleaned.trim()) {
        throw new Error('EMPTY_DOCUMENT: Could not extract readable text from PDF.');
      }
      return cleaned;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'PDF parsing failed';
      throw new Error(`PDF_PARSING_FAILED: ${message}`);
    }
  }

  private static async extractFromDocx(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const cleaned = result.value.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
      if (!cleaned.trim()) {
        throw new Error('EMPTY_DOCUMENT: Could not extract readable text from DOCX.');
      }
      return cleaned;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'DOCX parsing failed';
      throw new Error(`DOCX_PARSING_FAILED: ${message}`);
    }
  }
}