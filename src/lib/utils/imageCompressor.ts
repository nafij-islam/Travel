// Ghurabo Client-Side Image Processor & Validation Utility

export interface ProcessedImageResult {
  file: File;
  previewUrl: string;
  originalFilename: string;
  fileSize: number;
  width: number;
  height: number;
  mimeType: string;
}

export interface ValidationError {
  filename: string;
  reason: string;
}

export const MAX_IMAGES_PER_TRIP = 15;
export const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif'
];

/**
  * Validates an array of files against file size, count, format, and duplication.
  */
export function validateImageFiles(
  newFiles: File[],
  existingFiles: { originalFilename: string; fileSize: number }[] = []
): { validFiles: File[]; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  const validFiles: File[] = [];

  const totalAllowed = MAX_IMAGES_PER_TRIP - existingFiles.length;

  if (totalAllowed <= 0) {
    errors.push({
      filename: 'Limit Exceeded',
      reason: `Maximum limit of ${MAX_IMAGES_PER_TRIP} images per trip reached.`
    });
    return { validFiles: [], errors };
  }

  for (const file of newFiles) {
    if (validFiles.length >= totalAllowed) {
      errors.push({
        filename: file.name,
        reason: `Exceeds maximum ${MAX_IMAGES_PER_TRIP} images allowed per trip.`
      });
      continue;
    }

    // 1. File Size Check (8MB limit)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      errors.push({
        filename: file.name,
        reason: `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds 8 MB limit.`
      });
      continue;
    }

    // 2. Extension / MIME type check
    const isExtensionValid = /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
    const isMimeValid = ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase()) || isExtensionValid;

    if (!isMimeValid) {
      errors.push({
        filename: file.name,
        reason: 'Unsupported image format. Allowed formats: JPG, JPEG, PNG, WebP, HEIC.'
      });
      continue;
    }

    // 3. Duplicate check against existing files
    const isDuplicate = existingFiles.some(
      (existing) => existing.originalFilename === file.name && existing.fileSize === file.size
    );

    if (isDuplicate) {
      errors.push({
        filename: file.name,
        reason: 'This image has already been added to the upload list.'
      });
      continue;
    }

    validFiles.push(file);
  }

  return { validFiles, errors };
}

/**
  * Resizes image, converts to WebP via HTML5 Canvas (which strips EXIF metadata),
  * and extracts image dimensions.
  */
export async function processAndOptimizeImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.82
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio bounds
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        // Draw onto Canvas (Strips EXIF / GPS location data for security)
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas 2D context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP data URL
        const dataUrl = canvas.toDataURL('image/webp', quality);

        // Convert dataURL to optimized WebP file blob
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/webp';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const webpFile = new File([u8arr], `${cleanName}.webp`, { type: mime });

        resolve({
          file: webpFile,
          previewUrl: dataUrl,
          originalFilename: file.name,
          fileSize: webpFile.size,
          width,
          height,
          mimeType: mime
        });
      };

      img.onerror = () => {
        reject(new Error(`Failed to decode image content for file: ${file.name}`));
      };

      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };

    reader.onerror = () => {
      reject(new Error(`Failed to read file: ${file.name}`));
    };

    reader.readAsDataURL(file);
  });
}
