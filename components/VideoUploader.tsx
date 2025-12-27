import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, Play, Pause, Film } from 'lucide-react';

interface VideoUploaderProps {
  onVideoLoaded: (file: File) => void;
  onFramesCaptured: (frames: string[]) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoLoaded, onFramesCaptured }) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setFileName(file.name);
      onVideoLoaded(file);
      
      // Reset captures
      setIsCapturing(true);
    }
  };

  const handleRemove = () => {
    setVideoSrc(null);
    setFileName('');
    if (videoRef.current) {
      videoRef.current.src = '';
    }
    setIsCapturing(false);
  };

  // Auto-capture frames when video metadata is loaded
  const captureFrames = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !isCapturing) return;

    const frames: string[] = [];
    const duration = video.duration;
    
    // Capture at 10%, 30%, 50%, 70%, 90%
    const timePoints = [0.1, 0.3, 0.5, 0.7, 0.9].map(p => duration * p);

    try {
      // Helper to seek and capture
      const captureAtTime = (time: number): Promise<string> => {
        return new Promise((resolve) => {
          const onSeeked = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              // Use lower quality for AI to save token/bandwidth if needed, though Gemini handles high res well
              resolve(canvas.toDataURL('image/jpeg', 0.8)); 
            } else {
              resolve('');
            }
            video.removeEventListener('seeked', onSeeked);
          };
          video.addEventListener('seeked', onSeeked);
          video.currentTime = time;
        });
      };

      video.pause();
      for (const t of timePoints) {
        if (!isNaN(t)) {
          const frame = await captureAtTime(t);
          if (frame) frames.push(frame);
        }
      }
      
      // Reset video to start
      video.currentTime = 0;
      onFramesCaptured(frames);
      setIsCapturing(false);
      console.log(`Captured ${frames.length} frames for analysis`);
      
    } catch (e) {
      console.error("Frame capture error:", e);
      setIsCapturing(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <Film className="w-5 h-5 text-blue-600" />
          作品预览
        </h3>
        {videoSrc && (
          <button 
            onClick={handleRemove}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition"
          >
            <X className="w-3 h-3" /> 清除
          </button>
        )}
      </div>

      <div className="p-6">
        {!videoSrc ? (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 flex flex-col items-center justify-center text-center transition hover:border-blue-400 hover:bg-slate-50 relative">
            <input
              type="file"
              accept="video/mp4"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-slate-600 font-medium">点击上传 MP4 视频文件</p>
            <p className="text-slate-400 text-sm mt-1">支持拖拽上传</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-inner">
              <video
                ref={videoRef}
                src={videoSrc}
                controls
                className="w-full h-full object-contain"
                onLoadedMetadata={captureFrames}
              />
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span className="font-mono truncate max-w-[200px]" title={fileName}>{fileName}</span>
              {isCapturing && <span className="text-amber-600 animate-pulse text-xs">正在分析视频帧...</span>}
            </div>
            {/* Hidden canvas for frame extraction */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUploader;
