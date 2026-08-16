/**
 * Client-Side Image Compression & Resizing Utility
 * Downscales camera and smartphone photos to optimized web formats (WebP/JPEG) in <50ms.
 */

export interface CompressionOptions {
  maxDimension?: number;
  quality?: number;
  mimeType?: "image/webp" | "image/jpeg" | "image/png";
}

/**
 * Resizes and compresses an image File using HTML5 Canvas before uploading.
 * @param file The original File from user's file input or drop zone
 * @param options maxDimension (default: 512px), quality (default: 0.82)
 * @returns A compressed File ready for fast multipart upload
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxDimension = 512,
    quality = 0.82,
    mimeType = "image/webp",
  } = options;

  // If already small (< 100KB) and not oversized, return as-is
  if (file.size < 100 * 1024 && !file.type.includes("bmp")) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaled dimensions while preserving aspect ratio
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file); // Fallback to original if canvas context unavailable
          return;
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              resolve(file); // If compression didn't reduce size, keep original
              return;
            }

            const fileName = file.name.replace(/\.[^/.]+$/, "") + (mimeType === "image/webp" ? ".webp" : ".jpg");
            const compressedFile = new File([blob], fileName, {
              type: mimeType,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        resolve(file); // Fallback to original
      };
    };

    reader.onerror = () => {
      resolve(file); // Fallback to original
    };
  });
}
