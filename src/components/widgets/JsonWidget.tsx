import React, { useState } from 'react';
import { Code2, Copy, Check, Maximize2, Minimize2, Trash2, Wand2, FileCode, AlertCircle } from 'lucide-react';
import { validateJson, formatJson, minifyJson, SAMPLE_JSON } from '../../utils/jsonTool';

interface Props {
  onCopy: (text: string, label: string) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const JsonWidget: React.FC<Props> = ({ onCopy, isFullscreen = false, onToggleFullscreen }) => {
  const [content, setContent] = useState(SAMPLE_JSON);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const validation = validateJson(content);

  const handleFormat = () => {
    const res = formatJson(content, 2);
    if (res.success) {
      setContent(res.result);
      setStatusMessage('格式化成功');
      setTimeout(() => setStatusMessage(null), 1500);
    }
  };

  const handleMinify = () => {
    const res = minifyJson(content);
    if (res.success) {
      setContent(res.result);
      setStatusMessage('压缩为单行成功');
      setTimeout(() => setStatusMessage(null), 1500);
    }
  };

  const handleCopy = () => {
    onCopy(content, 'JSON 数据');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleLoadSample = () => {
    setContent(SAMPLE_JSON);
    setStatusMessage('已载入测试示例');
    setTimeout(() => setStatusMessage(null), 1500);
  };

  const handleClear = () => {
    setContent('');
  };

  return (
    <div
      className={`bg-white/70 dark:bg-zinc-800/60 rounded-2xl border border-slate-200/60 dark:border-zinc-700/60 shadow-sm backdrop-blur-md flex flex-col transition-all ${
        isFullscreen ? 'h-full p-5' : 'p-4'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-zinc-700/50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              JSON 美化与校验
              {validation.valid ? (
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-200/50 dark:border-emerald-800/50">
                  语法有效
                </span>
              ) : (
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded border border-rose-200/50 dark:border-rose-800/50">
                  语法错误
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">支持 2 空格缩进、单行压缩与错误精准定位</p>
          </div>
        </div>

        {/* Fullscreen Button */}
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-slate-700 dark:text-zinc-200 transition-colors"
            title={isFullscreen ? '退出全屏' : '在抽屉内全屏展开'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? '恢复常规' : '全屏展开'}</span>
          </button>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-between gap-2 py-2.5 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={handleFormat}
            disabled={!validation.valid}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white rounded-lg font-medium flex items-center gap-1 shadow-sm transition-colors"
          >
            <Wand2 className="w-3 h-3" />
            <span>美化 (2空格)</span>
          </button>
          <button
            onClick={handleMinify}
            disabled={!validation.valid}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 disabled:opacity-40 text-slate-700 dark:text-zinc-200 rounded-lg font-medium flex items-center gap-1 transition-colors"
          >
            <span>压缩为单行</span>
          </button>
          <button
            onClick={handleLoadSample}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-slate-600 dark:text-zinc-300 rounded-lg font-medium flex items-center gap-1 transition-colors"
          >
            <FileCode className="w-3 h-3" />
            <span>载入示例</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-slate-700 dark:text-zinc-200 rounded-lg font-medium flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? '已复制' : '复制'}</span>
          </button>
          <button
            onClick={handleClear}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
            title="清空"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Textarea with Line Numbers simulation or clean font-mono */}
      <div className={`relative flex-1 ${isFullscreen ? 'min-h-[400px]' : 'h-48'}`}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="在此粘贴或输入待校验格式化的 JSON 字符串..."
          className="w-full h-full p-3 font-mono text-xs leading-relaxed bg-slate-900 text-amber-200/90 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/50 custom-scrollbar border border-slate-800"
          spellCheck={false}
        />
      </div>

      {/* Error or Status Bar */}
      <div className="pt-2 shrink-0">
        {!validation.valid ? (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div className="truncate">
              <span className="font-semibold">
                第 {validation.line || 1} 行，第 {validation.column || 1} 列错误：
              </span>{' '}
              {validation.error}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 px-1">
            <span>
              {content ? `${(new Blob([content]).size / 1024).toFixed(2)} KB · ${content.split('\n').length} 行` : '准备就绪'}
            </span>
            {statusMessage && <span className="text-emerald-600 dark:text-emerald-400 font-medium">{statusMessage}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
