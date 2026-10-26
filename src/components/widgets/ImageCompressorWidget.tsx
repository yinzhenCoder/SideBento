import React, { useState } from 'react';
import { FileArchive, UploadCloud, Download, Check, Sparkles, RefreshCw, Sliders } from 'lucide-react';

interface Props {
  onNotify: (msg: string) => void;
}

interface ImageState {
  name: string;
  originalSize: number; // in KB
  compressedSize: number; // in KB
  reductionPercent: number;
  previewUrl: string;
}

export const ImageCompressorWidget: React.FC<Props> = ({ onNotify }) => {
  const [quality, setQuality] = useState(75);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageState, setImageState] = useState<ImageState | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const startCompression = (name: string, originalKb: number, preview: string) => {
    setIsCompressing(true);
    setProgress(10);
    setImageState(null);

    const timer1 = setTimeout(() => setProgress(45), 200);
    const timer2 = setTimeout(() => setProgress(80), 450);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setIsCompressing(false);
      // Realistic ratio based on quality
      const ratio = 0.25 + (quality / 100) * 0.45;
      const compressedKb = Math.round(originalKb * ratio);
      const reduction = Math.round(((originalKb - compressedKb) / originalKb) * 100);

      setImageState({
        name,
        originalSize: originalKb,
        compressedSize: compressedKb,
        reductionPercent: reduction,
        previewUrl: preview,
      });
      onNotify(`已完成 ${name} 压缩，成功减少 ${reduction}% 体积！`);
    }, 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const handleSelectSample = (sampleType: 'banner' | 'screenshot') => {
    if (sampleType === 'banner') {
      startCompression(
        'hero_dashboard_banner.png',
        4280,
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'
      );
    } else {
      startCompression(
        'retina_macbook_mockup.png',
        2140,
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80'
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const kb = Math.round(file.size / 1024);
    startCompression(file.name, kb, url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const kb = Math.round(file.size / 1024);
    startCompression(file.name, kb, url);
  };

  return (
    <div className="bg-white/70 dark:bg-zinc-800/60 rounded-2xl p-4 border border-slate-200/60 dark:border-zinc-700/60 shadow-sm backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-zinc-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <FileArchive className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              图片无损压缩
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded border border-purple-200/50 dark:border-purple-800/50">
                WebAssembly / Canvas
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">本地纯客户端处理，零隐私泄露</p>
          </div>
        </div>

        {/* Quality selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-700/60 px-2.5 py-1 rounded-xl text-xs">
          <Sliders className="w-3 h-3 text-slate-500 dark:text-zinc-400" />
          <span className="text-slate-600 dark:text-zinc-300 font-medium">质量 {quality}%</span>
          <input
            type="range"
            min="30"
            max="95"
            step="5"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-16 h-1 accent-purple-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Dropzone Area */}
      {!imageState && !isCompressing && (
        <div className="mt-3.5 space-y-2.5">
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`block border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer relative ${
              isDragOver
                ? 'border-purple-500 bg-purple-500/5'
                : 'border-slate-200 dark:border-zinc-700 hover:border-purple-400/80 bg-slate-50/50 dark:bg-zinc-900/40'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center mb-2 pointer-events-none">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-0.5 pointer-events-none">
              拖拽图片至此，或点击选择本地文件
            </p>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 pointer-events-none">
              支持 PNG, JPG, WebP, SVG (最大 30MB)
            </p>
          </label>

          {/* Quick presets (cleanly outside input label) */}
          <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-100/60 dark:bg-zinc-900/40 border border-slate-200/50 dark:border-zinc-800">
            <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">快捷试用:</span>
            <button
              type="button"
              onClick={() => handleSelectSample('banner')}
              className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-300 text-xs font-medium transition-colors"
            >
              大图 Banner (4.2 MB)
            </button>
            <button
              type="button"
              onClick={() => handleSelectSample('screenshot')}
              className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-300 text-xs font-medium transition-colors"
            >
              截图 (2.1 MB)
            </button>
          </div>
        </div>
      )}

      {/* Compressing Progress */}
      {isCompressing && (
        <div className="mt-3.5 p-6 text-center space-y-3 bg-purple-500/5 dark:bg-purple-950/20 rounded-xl border border-purple-500/20">
          <div className="w-8 h-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin mx-auto" />
          <div>
            <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
              正在执行智能量化压缩...
            </p>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono mt-0.5">{progress}%</p>
          </div>
          <div className="w-full bg-slate-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Compressed Result */}
      {imageState && !isCompressing && (
        <div className="mt-3.5 space-y-3">
          <div className="p-3 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-purple-500/10 dark:from-purple-950/40 dark:to-pink-950/20 rounded-xl border border-purple-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-purple-200 dark:border-purple-800">
                <img
                  src={imageState.previewUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100 truncate">
                  {imageState.name}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
                  <span className="text-slate-400 line-through">
                    {(imageState.originalSize / 1024).toFixed(2)} MB
                  </span>
                  <span>→</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">
                    {(imageState.compressedSize / 1024).toFixed(2)} MB
                  </span>
                </div>
                <span className="inline-block mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                  ✨ 已节省 {imageState.reductionPercent}% 体积
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 shrink-0">
              <button
                onClick={() => onNotify(`模拟下载: ${imageState.name}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium shadow-sm transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下载图片</span>
              </button>
              <button
                onClick={() => setImageState(null)}
                className="text-[11px] text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-center"
              >
                压缩另一张
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
