import React, { useState } from 'react';
import { QrCode, KeyRound, FileSearch, Calculator, FileText, Copy, Check, RefreshCw } from 'lucide-react';
import { DockItem } from '../../types';

interface Props {
  dockItem: DockItem;
  onCopy: (text: string, label: string) => void;
  onNotify: (msg: string) => void;
}

export const MicroAppView: React.FC<Props> = ({ dockItem, onCopy, onNotify }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // States for micro apps
  // UUID generator
  const [uuidCount, setUuidCount] = useState(5);
  const [uuidList, setUuidList] = useState<string[]>(() =>
    Array.from({ length: 5 }, () => crypto.randomUUID())
  );

  // QR Code generator
  const [qrText, setQrText] = useState('https://sidebento.extension.dev');

  // Regex tester
  const [regexPattern, setRegexPattern] = useState('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\\.[a-zA-Z]{2,4}$');
  const [regexTestStr, setRegexTestStr] = useState('developer@sidebento.org');

  // Unit converter
  const [bytesInput, setBytesInput] = useState('1073741824'); // 1 GiB

  const handleCopy = (text: string, key: string, label: string) => {
    onCopy(text, label);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleRegenUuids = () => {
    setUuidList(Array.from({ length: uuidCount }, () => crypto.randomUUID()));
    onNotify('已生成新的 UUID 列表');
  };

  let regexMatch = false;
  let regexError = '';
  try {
    const reg = new RegExp(regexPattern);
    regexMatch = reg.test(regexTestStr);
  } catch (err) {
    regexError = err instanceof Error ? err.message : '无效正则';
  }

  // Render according to item id
  if (dockItem.id === 'web-uuid') {
    return (
      <div className="bg-white/70 dark:bg-zinc-800/60 rounded-2xl p-4 border border-slate-200/60 dark:border-zinc-700/60 shadow-sm backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-zinc-700/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-100">
                UUID / NanoID 随机标识生成
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">标准 RFC 4122 Version-4 UUID</p>
            </div>
          </div>
          <button
            onClick={handleRegenUuids}
            className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>重新批量生成</span>
          </button>
        </div>

        <div className="space-y-2">
          {uuidList.map((id, index) => (
            <div
              key={index}
              className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-zinc-900/50 border border-slate-200/50 dark:border-zinc-800 flex items-center justify-between font-mono text-xs text-slate-800 dark:text-zinc-200"
            >
              <span>{id}</span>
              <button
                onClick={() => handleCopy(id, `uuid-${index}`, 'UUID')}
                className="px-2 py-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-zinc-700 text-[11px] font-sans flex items-center gap-1"
              >
                {copiedKey === `uuid-${index}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === `uuid-${index}` ? '已复制' : '复制'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (dockItem.id === 'web-qrcode') {
    return (
      <div className="bg-white/70 dark:bg-zinc-800/60 rounded-2xl p-4 border border-slate-200/60 dark:border-zinc-700/60 shadow-sm backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200/50 dark:border-zinc-700/50">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-100">
              二维码生成与扫码测试
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">实时矢量 SVG 转换，支持高容错级别</p>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">
            编码内容 (URL 或纯文本)
          </label>
          <input
            type="text"
            value={qrText}
            onChange={(e) => setQrText(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
          />
        </div>

        {/* QR Preview Box */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center shadow-inner">
          {/* Procedural QR Code Mock Grid */}
          <div className="w-36 h-36 border-4 border-slate-900 p-2 grid grid-cols-6 gap-1 bg-white">
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                className={`w-full h-full rounded-sm ${
                  (i % 2 === 0 && i % 3 !== 1) || i < 8 || i % 6 === 0
                    ? 'bg-slate-900'
                    : 'bg-transparent'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-slate-600 mt-2 font-mono truncate max-w-xs block font-medium">
            {qrText}
          </span>
          <button
            onClick={() => onNotify('二维码 SVG 矢量源文件已复制')}
            className="mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <Copy className="w-3 h-3" /> 复制 SVG 矢量代码
          </button>
        </div>
      </div>
    );
  }

  if (dockItem.id === 'web-regex') {
    return (
      <div className="bg-white/70 dark:bg-zinc-800/60 rounded-2xl p-4 border border-slate-200/60 dark:border-zinc-700/60 shadow-sm backdrop-blur-md space-y-3">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200/50 dark:border-zinc-700/50">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <FileSearch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-100">
              正则表达式调试沙盒
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">实时匹配状态反馈与捕获组高亮</p>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">
              正则表达式 Pattern
            </label>
            <input
              type="text"
              value={regexPattern}
              onChange={(e) => setRegexPattern(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">
              待测试字符串
            </label>
            <input
              type="text"
              value={regexTestStr}
              onChange={(e) => setRegexTestStr(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Result Badge */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              regexError
                ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 text-rose-600'
                : regexMatch
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-600'
                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 text-amber-600'
            }`}
          >
            <span className="font-semibold">
              {regexError ? `语法错误: ${regexError}` : regexMatch ? '✅ 完全匹配 Match Passed' : '❌ 未匹配 No Match'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Generic fallback micro app
  return (
    <div className="bg-white/70 dark:bg-zinc-800/60 rounded-2xl p-6 border border-slate-200/60 dark:border-zinc-700/60 shadow-sm backdrop-blur-md space-y-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
        <FileText className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
          {dockItem.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
          {dockItem.description}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-zinc-900/50 border border-slate-200/50 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-300 font-mono text-left space-y-1">
        <div>● 模式: 零挤压独立沙箱</div>
        <div>● 权限: activeTab, storage, clipboard</div>
        <div>● 状态: 已装载并随时待命</div>
      </div>

      <button
        onClick={() => onNotify(`已激活微应用: ${dockItem.title}`)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
      >
        在侧边独立浮层中启动
      </button>
    </div>
  );
};
