const multer = require('multer');
const { uploadBuffer } = require('../config/cloudinary');

// Configure multer to use memory storage (files stored in buffer)
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, WebP, and SVG are allowed.`), false);
  }
};

// Configure multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

/**
 * Upload a single image file to Cloudinary
 * @param {Object} file - Multer file object with buffer
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<string>} Cloudinary URL
 */
const uploadSingleImage = async (file, folder = 'packages') => {
  if (!file || !file.buffer) {
    return null;
  }

  try {
    const result = await uploadBuffer(file.buffer, { folder });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Upload multiple image files to Cloudinary
 * @param {Array} files - Array of multer file objects
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<Array<string>>} Array of Cloudinary URLs
 */
const uploadMultipleImages = async (files, folder = 'packages') => {
  if (!files || files.length === 0) {
    return [];
  }

  try {
    const uploadPromises = files.map((file) => uploadSingleImage(file, folder));
    const urls = await Promise.all(uploadPromises);
    return urls.filter(Boolean);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

/**
 * Process uploaded files from multer fields
 * @param {Object} files - req.files object from multer
 * @param {Object} config - Configuration for each field { fieldName: folder }
 * @returns {Promise<Object>} Object with field names as keys and URLs as values
 */
const processUploadedFiles = async (files, config = {}) => {
  const result = {};

  for (const [fieldName, folder] of Object.entries(config)) {
    const fieldFiles = files[fieldName];
    
    if (!fieldFiles || fieldFiles.length === 0) {
      continue;
    }

    if (fieldFiles.length === 1) {
      result[fieldName] = await uploadSingleImage(fieldFiles[0], folder);
    } else {
      result[fieldName] = await uploadMultipleImages(fieldFiles, folder);
    }
  }

  return result;
};

module.exports = {
  upload,
  uploadSingleImage,
  uploadMultipleImages,
  processUploadedFiles,
};
