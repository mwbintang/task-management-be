import multer, { FileFilterCallback, StorageEngine } from "multer";
import path from "path";
import { Request } from "express";

// Define allowed file extensions
const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf", ".docx"];

// Configure storage
const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, "uploads/");
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Configure multer upload
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error("Invalid file type. Allowed: PNG, JPG, JPEG, PDF, DOCX"));
    }
    cb(null, true);
  },
});
