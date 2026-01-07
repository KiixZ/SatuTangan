import multer from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, JPEG, and PNG are allowed."));
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Wrapper function to handle multer errors
const handleMulterError = (uploadMiddleware: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        // Multer-specific errors
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            error: {
              code: "UPLOAD_001",
              message: "File size too large. Maximum size is 5MB.",
            },
          });
        }
        return res.status(400).json({
          success: false,
          error: {
            code: "UPLOAD_002",
            message: err.message,
          },
        });
      } else if (err) {
        // Custom errors (like file type validation)
        return res.status(400).json({
          success: false,
          error: {
            code: "UPLOAD_003",
            message: err.message,
          },
        });
      }
      next();
    });
  };
};

// Export middleware for single file upload
export const uploadSingle = (fieldName: string) =>
  handleMulterError(upload.single(fieldName));

// Export middleware for multiple file uploads
export const uploadMultiple = (fieldName: string, maxCount: number = 10) =>
  handleMulterError(upload.array(fieldName, maxCount));

// Specific middleware for banner uploads
export const uploadBanner = uploadSingle("image");

// Specific middleware for campaign photo uploads (multiple)
export const uploadCampaignPhotos = uploadMultiple("photos", 10);

// Specific middleware for verification documents (multiple fields)
export const uploadVerificationDocuments = handleMulterError(
  upload.fields([
    { name: "ktp_photo", maxCount: 1 },
    { name: "bank_account_photo", maxCount: 1 },
    { name: "terms_photo", maxCount: 1 },
  ]),
);

export default upload;
