// import multer from "multer";
// import path from "path";
// import { fileURLToPath } from "url";
// import fs from "fs";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const uploadPath = path.join(__dirname, "..", "uploads");
// if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadPath),
//   filename: (req, file, cb) => {
//     const safeName = file.originalname.replace(/\s+/g, "_");
//     cb(null, `${Date.now()}_${safeName}`);
//   },
// });

// export const upload = multer({
//   storage,
//   limits: { fileSize: 15 * 1024 * 1024 },
// });

// export const handleUploadError = (err, req, res, next) => {
//   if (err) {
//     return res.status(400).json({ success: false, message: err.message });
//   }
//   next();
// };

import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${unique}${path.extname(file.originalname)}`);
  },
});

// Image filter
const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);

  if (extOk && mimeOk) cb(null, true);
  else cb(new Error("Only image files are allowed"));
};

// Document filter (PDF + images)
const documentFilter = (req, file, cb) => {
  const allowedExt = /pdf|doc|docx|jpg|jpeg|png/;
  const extOk = allowedExt.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimeOk =
    file.mimetype.includes("pdf") ||
    file.mimetype.includes("image") ||
    file.mimetype.includes("document");

  if (extOk && mimeOk) cb(null, true);
  else cb(new Error("Only PDF, DOC, DOCX, and images are allowed"));
};

// Image upload
export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter,
});

// Document upload (PDFs)
export const uploadDocument = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: documentFilter,
});

// Error handler
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large",
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }

  next();
};


// Event images upload (banner and thumbnail)
export const uploadEventImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
}).fields([
  { name: "banner", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);