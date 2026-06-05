import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { AppError } from "../common/AppError.js";

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];

  if (!allowed.includes(file.mimetype)) {
    return cb(new AppError(400, "Invalid file type"));
  }

  cb(null, true);
};
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}); // Limit file size to 5MB

export default upload;
