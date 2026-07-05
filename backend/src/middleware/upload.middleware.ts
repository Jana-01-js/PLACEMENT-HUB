import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { ApiError } from "@utils/ApiError";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "resumes");

// Ensure the directory exists on boot rather than failing on first upload.
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (req: Request, file, cb) => {
    const userId = (req as unknown as { user?: { userId: string } }).user
      ?.userId;
    const ext = path.extname(file.originalname);
    const unique = `${userId}-${Date.now()}${ext}`;
    cb(null, unique);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      ApiError.badRequest("Only PDF, DOC, or DOCX files are allowed") as unknown as Error
    );
  }
  cb(null, true);
};

export const resumeUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("resume");

// NOTE: This currently stores files on local disk. When Cloudinary
// credentials are available, swap `storage` for `multer.memoryStorage()`
// and upload `req.file.buffer` to Cloudinary inside the controller —
// the rest of the flow (validation, route, response shape) stays the same.
