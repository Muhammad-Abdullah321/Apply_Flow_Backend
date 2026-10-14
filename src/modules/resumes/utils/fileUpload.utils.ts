import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import multer from 'multer';

// Get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Upload directory (relative to project root)
export const UPLOAD_DIR = join(__dirname, '../../../uploads');
export const UPLOAD_RELATIVE_DIR = 'uploads';

// Ensure upload directory exists
import fs from 'fs';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// File filter - only allow PDF, DOC, DOCX
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  }
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: resume-{timestamp}-{random}.{ext}
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `resume-${uniqueSuffix}${ext}`);
  },
});

// Multer upload instance
export const resumeUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
});

// Generate file URL for frontend access
export function generateFileUrl(filename: string): string {
  return `/uploads/${filename}`;
}

// Delete file from disk
export function deleteFileFromDisk(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // Silent failure - file cleanup is best effort
  }
}

// Extract filename from URL
export function extractFilenameFromUrl(fileUrl: string): string | null {
  try {
    const urlParts = fileUrl.split('/');
    return urlParts[urlParts.length - 1] || null;
  } catch {
    return null;
  }
}
