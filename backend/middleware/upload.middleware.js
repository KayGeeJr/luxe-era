const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const allowedImageFormats = ["jpg", "jpeg", "png", "webp"];
const allowedVideoFormats = ["mp4", "mov", "webm", "avi"];

function createUpload(folder = "anti-store/products") {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: allowedImageFormats,
      transformation: [{ width: 1200, crop: "limit", quality: "auto" }],
    },
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(_req, file, cb) {
      if (file.mimetype && file.mimetype.startsWith("image/")) {
        cb(null, true);
        return;
      }
      const err = new Error("Only image files are allowed (e.g. JPG, PNG, WebP).");
      err.statusCode = 400;
      cb(err);
    },
  });
}

// Separate storage config for videos (resource_type must be "video")
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "anti-store/videos",
    allowed_formats: allowedVideoFormats,
    resource_type: "video",
  },
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "anti-store/categories",
    allowed_formats: allowedImageFormats,
    transformation: [{ width: 1200, crop: "limit", quality: "auto" }],
    resource_type: "image",
  }),
});

// Mixed upload for category routes: accepts image + video in same request
const categoryUpload = multer({
  storage: multer.memoryStorage(), // handled per-field below
  limits: { fileSize: 200 * 1024 * 1024 },
});

// Middleware that routes each field to its own Cloudinary storage
async function categoryUploadMiddleware(req, res, next) {
  const upload = multer({
    limits: { fileSize: 200 * 1024 * 1024 },
    fileFilter(_req, file, cb) {
      if (file.fieldname === "image" && file.mimetype.startsWith("image/")) return cb(null, true);
      if (file.fieldname === "video" && file.mimetype.startsWith("video/")) return cb(null, true);
      cb(new Error(`Unsupported file type for field "${file.fieldname}"`));
    },
    storage: {
      _handleFile(req, file, cb) {
        const storage = file.fieldname === "video" ? videoStorage : imageStorage;
        storage._handleFile(req, file, cb);
      },
      _removeFile(req, file, cb) {
        const storage = file.fieldname === "video" ? videoStorage : imageStorage;
        storage._removeFile(req, file, cb);
      },
    },
  });

  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ])(req, res, next);
}

const upload = createUpload("anti-store/products");

module.exports = { upload, createUpload, categoryUploadMiddleware };
