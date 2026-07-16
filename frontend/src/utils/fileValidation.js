// Mirrors the backend's multer allow-lists (src/common/utils/multer.utils.js,
// src/middleware/file-validation.middleware.js) for fast client-side feedback.
// The backend's magic-number check remains the real gate.

export const ALLOWED_MESSAGE_IMAGE_TYPES = ['image/png', 'image/gif', 'image/jpeg'];
export const ALLOWED_PROFILE_IMAGE_TYPES = ['image/png', 'image/jpeg'];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB, client-side sanity cap

export function validateFiles(files, allowedTypes = ALLOWED_MESSAGE_IMAGE_TYPES) {
  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      return `"${file.name}" has an unsupported file type`;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `"${file.name}" exceeds the 5MB size limit`;
    }
  }
  return null;
}
