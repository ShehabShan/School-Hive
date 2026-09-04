import imageCompression from "browser-image-compression";

/**
 * Compress + resize an image before upload.
 * - Keeps visual quality (WebP q ~0.80-0.82) while shrinking bytes 60-85%
 * - Off-main-thread via Web Worker, handles EXIF orientation
 * - Fast path: tiny images returned untouched
 *
 * @param {File} file - original user file
 * @param {Object} opts
 * @param {number} opts.maxSizeMB - target max MB (default 0.8)
 * @param {number} opts.maxWidthOrHeight - longest side px (default 1280)
 * @param {number} opts.quality - 0-1 (default 0.82)
 * @returns {Promise<File>} optimized file (type image/webp when supported, else jpeg)
 */
export async function optimizeImage(file, opts = {}) {
  const { maxSizeMB = 0.8, maxWidthOrHeight = 1280, quality = 0.82 } = opts;
  if (!file || !file.type?.startsWith("image/")) return file;

  // Fast path: already small enough — skip worker
  const isSmall = file.size < 280 * 1024 && file.size < maxSizeMB * 1024 * 1024;
  // Probe dimensions via createImageBitmap if available to avoid decoding full 8K
  // We still let the lib handle it; this is just an early exit for thumbnails
  if (isSmall) {
    try {
      const bmp = await createImageBitmap(file);
      if (Math.max(bmp.width, bmp.height) <= maxWidthOrHeight) {
        bmp.close?.();
        return file;
      }
      bmp.close?.();
    } catch {
      // fall through to compress
    }
  }

  const supportsWebP = await canEncodeWebP();

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight,
      initialQuality: quality,
      useWebWorker: true,
      fileType: supportsWebP ? "image/webp" : "image/jpeg",
      alwaysKeepResolution: false,
      exifOrientation: undefined, // auto-correct
    });
    // imageCompression may return Blob without name — wrap as File
    if (compressed instanceof File) return compressed;
    const ext = supportsWebP ? "webp" : "jpg";
    const name = file.name.replace(/\.[^.]+$/, `.${ext}`);
    return new File([compressed], name, { type: compressed.type || (supportsWebP ? "image/webp" : "image/jpeg") });
  } catch {
    // Fallback: canvas manual (no worker)
    try {
      return await canvasFallback(file, { maxWidthOrHeight, quality, mimeType: supportsWebP ? "image/webp" : "image/jpeg" });
    } catch {
      return file; // last resort: return original
    }
  }
}

let webpSupportCache = null;
async function canEncodeWebP() {
  if (webpSupportCache !== null) return webpSupportCache;
  try {
    if (typeof document === "undefined") {
      webpSupportCache = true;
      return true;
    }
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    webpSupportCache = canvas.toDataURL("image/webp").startsWith("data:image/webp");
    return webpSupportCache;
  } catch {
    webpSupportCache = false;
    return false;
  }
}

function canvasFallback(file, { maxWidthOrHeight, quality, mimeType }) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      try {
        let { width, height } = img;
        const scale = Math.min(1, maxWidthOrHeight / Math.max(width, height));
        width = Math.round(width * scale);
        height = Math.round(height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (!blob) return reject(new Error("canvas toBlob failed"));
            const ext = mimeType === "image/webp" ? "webp" : "jpg";
            const name = file.name.replace(/\.[^.]+$/, `.${ext}`);
            resolve(new File([blob], name, { type: blob.type }));
          },
          mimeType,
          quality
        );
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image load failed"));
    };
    img.src = url;
  });
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
