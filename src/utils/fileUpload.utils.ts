import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// ─── Constants ────────────────────────────────────────────────────────────────

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.doc', '.docx']);

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// Relative path used for DB references and cleanup
export const UPLOAD_RELATIVE_DIR = path.join('uploads', 'resumes');

// Absolute path used by multer to save files
export const UPLOAD_ABSOLUTE_DIR = path.join(process.cwd(), UPLOAD_RELATIVE_DIR);

// ─── Ensure Upload Directory Exists ──────────────────────────────────────────

if (!fs.existsSync(UPLOAD_ABSOLUTE_DIR)) {
  fs.mkdirSync(UPLOAD_ABSOLUTE_DIR, { recursive: true });
}

// ─── Multer Storage ───────────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_ABSOLUTE_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `resume-${uniqueSuffix}${ext}`);
  },
});

// ─── File Filter ──────────────────────────────────────────────────────────────

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ALLOWED_MIME_TYPES.has(file.mimetype) && ALLOWED_EXTENSIONS.has(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are accepted.'));
  }
};

// ─── Multer Instance ──────────────────────────────────────────────────────────

export const resumeUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Generates a public URL for a stored resume file.
 * Requires Express to serve static files:
 *   app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
 */
export const generateFileUrl = (generatedFilename: string): string => {
  const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  return `${base}/uploads/resumes/${generatedFilename}`;
};

/**
 * Extracts the disk filename from a stored fileUrl.
 * e.g. "http://localhost:3000/uploads/resumes/resume-123.pdf" → "resume-123.pdf"
 */
export const extractFilenameFromUrl = (fileUrl: string): string => {
  return fileUrl.split('/').pop() ?? '';
};

/**
 * Silently deletes a file from disk using its relative path.
 * Never throws — DB operations should not be blocked by file cleanup failures.
 */
export const deleteFileFromDisk = (relativeFilePath: string): void => {
  try {
    const absolute = path.join(process.cwd(), relativeFilePath);
    if (fs.existsSync(absolute)) {
      fs.unlinkSync(absolute);
    }
  } catch {
    console.warn(`[FileUpload] Could not delete file: ${relativeFilePath}`);
  }
};