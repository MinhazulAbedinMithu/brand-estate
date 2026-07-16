interface HTMLVideoElementWithCapture extends HTMLVideoElement {
  captureStream?: (fps?: number) => MediaStream;
  mozCaptureStream?: (fps?: number) => MediaStream;
}

interface HTMLCanvasElementWithCapture extends HTMLCanvasElement {
  mozCaptureStream?: (fps?: number) => MediaStream;
}

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

/**
 * Helper to watermark a video file client-side using Canvas + MediaRecorder.
 * It overlays `/nav-logo.png` in the bottom-right corner of the video.
 * It plays the video at 2x speed and records it back to a file.
 * If browser APIs are missing or an error occurs, it falls back to the original file.
 */
export async function applyVideoWatermark(
  file: File,
  onProgress?: (pct: number) => void
): Promise<File> {
  // If not a video, return original file
  if (!file.type.startsWith("video/")) {
    return file;
  }

  // Verify browser context has MediaRecorder and captureStream APIs
  if (
    typeof window === "undefined" ||
    !window.MediaRecorder ||
    (!(HTMLVideoElement.prototype as HTMLVideoElementWithCapture).captureStream &&
      !(HTMLVideoElement.prototype as HTMLVideoElementWithCapture).mozCaptureStream)
  ) {
    console.warn("MediaRecorder or captureStream is unsupported in this browser. Skipping video watermark.");
    return file;
  }

  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.crossOrigin = "anonymous";

    const watermarkImg = new Image();
    let watermarkLoaded = false;

    watermarkImg.onload = () => {
      watermarkLoaded = true;
    };
    watermarkImg.onerror = () => {
      console.warn("Failed to load watermark logo image for video overlay.");
    };
    watermarkImg.src = "/nav-logo.png";

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    video.onloadedmetadata = () => {
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 360;
      const duration = video.duration || 0;

      if (!duration || isNaN(duration)) {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
        return;
      }

      const fps = 30;
      let animFrameId: number;

      const drawFrame = () => {
        if (video.paused || video.ended) return;
        ctx.drawImage(video, 0, 0, width, height);

        if (watermarkLoaded) {
          const watermarkWidth = Math.max(width * 0.15, 60);
          const watermarkAspect = watermarkImg.naturalWidth / watermarkImg.naturalHeight;
          const watermarkHeight = watermarkWidth / watermarkAspect;

          const marginX = width * 0.02 > 12 ? width * 0.02 : 12;
          const marginY = height * 0.02 > 12 ? height * 0.02 : 12;
          const x = width - watermarkWidth - marginX;
          const y = height - watermarkHeight - marginY;

          ctx.globalAlpha = 0.6;
          ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight);
          ctx.globalAlpha = 1.0;
        }

        if (onProgress) {
          const pct = Math.min(Math.round((video.currentTime / duration) * 100), 100);
          onProgress(pct);
        }

        animFrameId = requestAnimationFrame(drawFrame);
      };

      // Play video at 2x speed to accelerate watermarking process
      video.playbackRate = 2.0;

      let canvasStream: MediaStream;
      try {
        const typedCanvas = canvas as HTMLCanvasElementWithCapture;
        canvasStream = typedCanvas.captureStream
          ? typedCanvas.captureStream(fps)
          : typedCanvas.mozCaptureStream!(fps);
      } catch (err) {
        console.error("Canvas stream capture failed", err);
        URL.revokeObjectURL(objectUrl);
        resolve(file);
        return;
      }

      // Try capturing audio track from original video
      let audioTrack: MediaStreamTrack | null = null;
      try {
        const typedVideo = video as HTMLVideoElementWithCapture;
        const videoStream = typedVideo.captureStream
          ? typedVideo.captureStream()
          : (typedVideo.mozCaptureStream
              ? typedVideo.mozCaptureStream()
              : null);
        if (videoStream) {
          const tracks = videoStream.getAudioTracks();
          if (tracks && tracks.length > 0) {
            audioTrack = tracks[0];
          }
        }
      } catch (err) {
        console.warn("Audio stream capture failed, recording video as silent.", err);
      }

      // Compose stream tracks
      const outputStream = new MediaStream();
      canvasStream.getVideoTracks().forEach((track) => outputStream.addTrack(track));
      if (audioTrack) {
        outputStream.addTrack(audioTrack);
      }

      // Resolve suitable recording formats
      let mimeType = "video/webm";
      if (MediaRecorder.isTypeSupported("video/mp4;codecs=h264")) {
        mimeType = "video/mp4;codecs=h264";
      } else if (MediaRecorder.isTypeSupported("video/mp4")) {
        mimeType = "video/mp4";
      } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
        mimeType = "video/webm;codecs=vp9";
      } else if (MediaRecorder.isTypeSupported("video/webm;codecs=h264")) {
        mimeType = "video/webm;codecs=h264";
      }

      let mediaRecorder: MediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(outputStream, { mimeType });
      } catch (err) {
        console.error("MediaRecorder creation failed", err);
        URL.revokeObjectURL(objectUrl);
        resolve(file);
        return;
      }

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        cancelAnimationFrame(animFrameId);
        URL.revokeObjectURL(objectUrl);

        try {
          const extension = mimeType.includes("mp4") ? ".mp4" : ".webm";
          const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
          const outputName = `${baseName}-watermarked${extension}`;
          const outputType = mimeType.split(";")[0];

          const blob = new Blob(chunks, { type: outputType });
          const watermarkedFile = new File([blob], outputName, {
            type: outputType,
            lastModified: Date.now(),
          });

          if (onProgress) onProgress(100);
          resolve(watermarkedFile);
        } catch (err) {
          console.error("Assembly of watermarked file failed", err);
          resolve(file);
        }
      };

      video.play().then(() => {
        mediaRecorder.start();
        drawFrame();
      }).catch((err) => {
        console.error("Video element playback failed", err);
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      });

      video.onended = () => {
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
        }
      };

      video.onerror = () => {
        console.error("Video source playback error");
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
        } else {
          URL.revokeObjectURL(objectUrl);
          resolve(file);
        }
      };
    };

    video.onerror = (err) => {
      console.error("Video source loading failed", err);
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };
  });
}
