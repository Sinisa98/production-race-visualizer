import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set ffmpeg path (will use system ffmpeg if available)
// For Windows, make sure ffmpeg is in PATH or specify path here
// ffmpeg.setFfmpegPath('C:\\ffmpeg\\bin\\ffmpeg.exe');

/**
 * Encode canvas frames into MP4 video
 * @param {Array<string>} frames - Array of base64 encoded canvas frames
 * @param {string} outputPath - Output file path
 * @param {number} fps - Frames per second
 */
export async function encodeVideo(frames, outputPath, fps = 30) {
  return new Promise((resolve, reject) => {
    console.log(`Encoding ${frames.length} frames at ${fps} fps...`);
    
    // Create temp directory for frame images
    const tmpDir = path.join(__dirname, '..', 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    
    try {
      // Write frames to temporary PNG files
      frames.forEach((frame, index) => {
        const base64Data = frame.replace(/^data:image\/png;base64,/, '');
        const frameBuffer = Buffer.from(base64Data, 'base64');
        const framePath = path.join(tmpDir, `frame_${String(index).padStart(6, '0')}.png`);
        fs.writeFileSync(framePath, frameBuffer);
      });
      
      // Use ffmpeg to create video from frames
      ffmpeg()
        .input(path.join(tmpDir, 'frame_%06d.png'))
        .inputFPS(fps)
        .output(outputPath)
        .outputOptions('-c:v libx264', '-preset medium', '-crf 23', '-pix_fmt yuv420p')
        .on('start', (commandLine) => {
          console.log('FFmpeg started:', commandLine);
        })
        .on('progress', (progress) => {
          console.log(`Progress: ${progress.percent}%`);
        })
        .on('end', () => {
          console.log('Video encoding finished');
          
          // Clean up temp files
          fs.readdirSync(tmpDir).forEach((file) => {
            if (file.startsWith('frame_')) {
              fs.unlinkSync(path.join(tmpDir, file));
            }
          });
          
          resolve(outputPath);
        })
        .on('error', (error) => {
          console.error('FFmpeg error:', error.message);
          reject(error);
        })
        .run();
        
    } catch (error) {
      console.error('Error during video encoding:', error);
      reject(error);
    }
  });
}
