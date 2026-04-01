/**
 * Video export utility - captures canvas frames and sends to backend for encoding
 */

export async function recordAndExportVideo(
  canvas,
  years,
  options = {},
  metadata = {}
) {
  const { width = 1920, height = 1080, fps = 30 } = options;
  const { product, startYear } = metadata;

  return new Promise(async (resolve, reject) => {
    try {
      console.log('Starting video recording...');
      const frames = [];

      // Capture frames for each year
      for (let i = 0; i < years.length; i++) {
        const year = years[i];
        console.log(`Capturing frame ${i + 1}/${years.length} (Year: ${year})`);

        // Convert canvas to blob/data URL
        const imageData = canvas.toDataURL('image/png');
        frames.push(imageData);

        // Update progress (optional UI update)
        if (window.updateExportProgress) {
          window.updateExportProgress((i + 1) / years.length);
        }
      }

      console.log(`Captured ${frames.length} frames, sending to backend...`);

      // Send frames to backend for encoding
      const response = await fetch('/api/encode-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          frames,
          fps,
          product,
          startYear
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Video encoding failed');
      }

      console.log('Video encoded successfully:', result.filename);

      // Download video
      downloadVideo(result.downloadUrl, `${product}_${startYear}.mp4`);

      resolve(result);
    } catch (error) {
      console.error('Video export error:', error);
      reject(error);
    }
  });
}

/**
 * Download video from server
 */
function downloadVideo(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Alternative: Use MediaRecorder API to record canvas in browser (may have smaller file size but slower)
 */
export async function recordCanvasToBlob(
  canvas,
  durationMs,
  options = {}
) {
  return new Promise((resolve, reject) => {
    try {
      const { mimeType = 'video/webm' } = options;

      const stream = canvas.captureStream(30); // 30 FPS
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType
      });

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        resolve(blob);
      };

      mediaRecorder.onerror = (error) => {
        reject(error);
      };

      mediaRecorder.start();

      // Stop recording after duration
      setTimeout(() => {
        mediaRecorder.stop();
      }, durationMs);
    } catch (error) {
      reject(error);
    }
  });
}
