/**
 * Helper to apply a watermark to an image file client-side using HTML5 Canvas.
 * It overlays `/nav-logo.png` in the bottom-right corner of the image.
 * If the file is not an image or if an error occurs, it falls back to the original file.
 */
export async function applyWatermark(file: File): Promise<File> {
  // If not an image, return original file
  if (!file.type.startsWith("image/")) {
    return file;
  }

  return new Promise((resolve) => {
    const originalImg = new Image();
    const watermarkImg = new Image();

    let originalLoaded = false;
    let watermarkLoaded = false;

    let objectUrl = "";

    const cleanUp = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };

    const processWatermark = () => {
      if (!originalLoaded || !watermarkLoaded) return;

      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          cleanUp();
          resolve(file);
          return;
        }

        // Set canvas to the natural/original dimensions of the image
        const width = originalImg.naturalWidth || originalImg.width;
        const height = originalImg.naturalHeight || originalImg.height;

        canvas.width = width;
        canvas.height = height;

        // Draw original image
        ctx.drawImage(originalImg, 0, 0);

        // Calculate watermark scale (e.g., 15% of original image width)
        const watermarkWidth = originalImg.naturalWidth
          ? Math.max(width * 0.15, 60)
          : 60;
        
        const watermarkAspect = watermarkImg.naturalWidth / watermarkImg.naturalHeight;
        const watermarkHeight = watermarkWidth / watermarkAspect;

        // Positioning: bottom-right with 2% margin or at least 12px
        const marginX = width * 0.02 > 12 ? width * 0.02 : 12;
        const marginY = height * 0.02 > 12 ? height * 0.02 : 12;
        const x = width - watermarkWidth - marginX;
        const y = height - watermarkHeight - marginY;

        // Render watermark with semi-transparency
        ctx.globalAlpha = 0.6;
        ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight);
        ctx.globalAlpha = 1.0;

        // Convert canvas back to a file
        canvas.toBlob((blob) => {
          cleanUp();
          if (blob) {
            const watermarkedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(watermarkedFile);
          } else {
            resolve(file);
          }
        }, file.type);
      } catch (err) {
        console.error("[Watermark Processing Error]", err);
        cleanUp();
        resolve(file);
      }
    };

    originalImg.onload = () => {
      originalLoaded = true;
      processWatermark();
    };

    originalImg.onerror = (err) => {
      console.error("[Watermark: Original Image Load Failed]", err);
      cleanUp();
      resolve(file);
    };

    watermarkImg.onload = () => {
      watermarkLoaded = true;
      processWatermark();
    };

    watermarkImg.onerror = (err) => {
      console.warn("[Watermark: Logo Image Load Failed, uploading original]", err);
      cleanUp();
      resolve(file);
    };

    // Load original image via object URL
    objectUrl = URL.createObjectURL(file);
    originalImg.src = objectUrl;

    // Load watermark image
    watermarkImg.src = "/nav-logo.png";
  });
}
