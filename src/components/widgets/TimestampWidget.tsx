import React, { useState, useEffect } from 'react';
import { Play, Pause, Copy, Check, Clock, RefreshCw, ArrowRightLeft } from 'lucide-react';
import { formatDateTime, parseToDate, dateToTimestamps, getRelativeTimeDescription } from '../../utils/timestamp';

interface Props {
  onCopy: (text: string, label: string) => void;
}

export const TimestampWidget: React.FC<Props> = ({ onCopy }) => {
  const [now, setNow] = useState(new Date());
  const [isRunning, setIsRunning] = useState(true);
  const [unitMode, setUnitMode] = useState<'s' | 'ms'>('s');

  // Interactive conversion fields
  const [inputTs, setInputTs] = useState('1792571460');
  const [parsedDateTime, setParsedDateTime] = useState('');
  const [parsedRelative, setParsedRelative] = useState('');

  const [inputDateStr, setInputDateStr] = useState('');
  const [parsedOutputTs, setParsedOutputTs] = useState('');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Ticking clock
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setNow(new Date());
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Handle timestamp -> date conversion
  useEffect(() => {
    if (!inputTs.trim()) {
      setParsedDateTime('请输入有效数字时间戳');
      setParsedRelative('');
      return;
    }
    const d = parseToDate(inputTs);
    if (!d) {
      setParsedDateTime('无效时间戳格式');
      setParsedRelative('');
    } else {
      setParsedDateTime(formatDateTime(d, true));
      setParsedRelative(getRelativeTimeDescription(d, now));
    }
  }, [inputTs, now]);

  // Handle date -> timestamp conversion
  useEffect(() => {
    if (!inputDateStr.trim()) {
      setParsedOutputTs('');
      return;
    }
    const d = parseToDate(inputDateStr);
    if (!d) {
      setParsedOutputTs('无效日期格式');
    } else {
      const ts = dateToTimestamps(d);
      setParsedOutputTs(`${ts.seconds} (秒) / ${ts.milliseconds} (毫秒)`);
    }
  }, [inputDateStr]);

  const currentTs = dateToTimestamps(now);
  const currentVal = unitMode === 's' ? currentTs.seconds : currentTs.milliseconds;

  const triggerCopy = (val: string, key: string, label: string) => {
    onCopy(val, label);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleQuickPreset = (type: 'now' | 'today0' | 'plus1h' | 'plus1d') => {
    const d = new Date();
    if (type === 'today0') {
      d.setHours(0, 0, 0, 0);
    } else if (type === 'plus1h') {
      d.setHours(d.getHours() + 1);
    } else if (type === 'plus1d') {
      d.setDate(d.getDate() + 1);
    }
    const ts = dateToTimestamps(d);
    setInputTs(String(unitMode === 's' ? ts.seconds : ts.milliseconds));
  };

  return (
    <div className="bg-white/70 dark:bg-zinc-800/60 rounded-2xl p-4 border border-slate-200/60 dark:border-zinc-700/60 shadow-sm backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-zinc-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              时间戳转换
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping opacity-75" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">实时秒 / 毫秒跳动与双向转换</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-700/60 p-1 rounded-xl text-xs">
          <button
            onClick={() => setUnitMode(unitMode === 's' ? 'ms' : 's')}
            className="px-2 py-1 rounded-lg font-mono font-medium text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-600 transition-colors"
            title="切换秒/毫秒"
          >
            {unitMode.toUpperCase()}
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-1.5 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-600 transition-colors"
            title={isRunning ? '暂停' : '继续'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Live Current Time Display */}
      <div className="mt-3 p-3 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-950/20 dark:to-teal-950/10 rounded-xl border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 block mb-0.5">
            当前时间戳 ({unitMode === 's' ? '秒 s' : '毫秒 ms'})
          </span>
          <div className="text-xl font-mono font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
            {currentVal}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono mt-0.5 block">
            {formatDateTime(now, unitMode === 'ms')}
          </span>
        </div>
        <button
          onClick={() => triggerCopy(String(currentVal), 'curr', '当前时间戳')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium shadow-sm transition-all active:scale-95 shrink-0"
        >
          {copiedKey === 'curr' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedKey === 'curr' ? '已复制' : '复制'}</span>
        </button>
      </div>

      {/* Conversion Section */}
      <div className="mt-3.5 space-y-3">
        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] text-slate-600 dark:text-zinc-300 shrink-0 font-medium">快捷填入:</span>
          <button
            onClick={() => handleQuickPreset('now')}
            className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-zinc-700/80 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition-colors shrink-0"
          >
            现在
          </button>
          <button
            onClick={() => handleQuickPreset('today0')}
            className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-zinc-700/80 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition-colors shrink-0"
          >
            今日0点
          </button>
          <button
            onClick={() => handleQuickPreset('plus1h')}
            className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-zinc-700/80 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition-colors shrink-0"
          >
            +1小时
          </button>
          <button
            onClick={() => handleQuickPreset('plus1d')}
            className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-zinc-700/80 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition-colors shrink-0"
          >
            +1天
          </button>
        </div>

        {/* Timestamp -> DateTime */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center justify-between">
            <span>时间戳 → 北京时间</span>
            {parsedRelative && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                {parsedRelative}
              </span>
            )}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputTs}
              onChange={(e) => setInputTs(e.target.value)}
              placeholder="输入时间戳 (如 1792571460)"
              className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-zinc-100"
            />
            <button
              onClick={() => triggerCopy(parsedDateTime, 'dateResult', '解析日期')}
              disabled={!parsedDateTime || parsedDateTime.includes('无效')}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 disabled:opacity-40 text-slate-700 dark:text-zinc-200 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors shrink-0"
            >
              {copiedKey === 'dateResult' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>复制结果</span>
            </button>
          </div>
          <div className="p-2 rounded-xl bg-slate-100/70 dark:bg-zinc-900/40 border border-slate-200/50 dark:border-zinc-800 text-xs font-mono text-slate-700 dark:text-zinc-300 flex items-center justify-between">
            <span className="truncate">{parsedDateTime}</span>
          </div>
        </div>

        {/* DateTime -> Timestamp */}
        <div className="space-y-1.5 pt-1 border-t border-slate-200/50 dark:border-zinc-700/50">
          <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center justify-between">
            <span>日期时间 → 时间戳</span>
            <button
              onClick={() => setInputDateStr(formatDateTime(new Date()))}
              className="text-[11px] text-slate-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1"
            >
              <RefreshCw className="w-2.5 h-2.5" /> 填入此时
            </button>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputDateStr}
              onChange={(e) => setInputDateStr(e.target.value)}
              placeholder="如 2026-10-21 16:30:00"
              className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-zinc-100"
            />
            {parsedOutputTs && !parsedOutputTs.includes('无效') && (
              <button
                onClick={() => triggerCopy(parsedOutputTs.split(' ')[0], 'tsResult', '时间戳')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-slate-700 dark:text-zinc-200 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors shrink-0"
              >
                {copiedKey === 'tsResult' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>复制秒戳</span>
              </button>
            )}
          </div>
          {parsedOutputTs && (
            <div className="p-2 rounded-xl bg-slate-100/70 dark:bg-zinc-900/40 border border-slate-200/50 dark:border-zinc-800 text-xs font-mono text-emerald-600 dark:text-emerald-400">
              {parsedOutputTs}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
