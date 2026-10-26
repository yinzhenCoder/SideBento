import React, { useState } from 'react';
import { X, Scissors, Check, Eye, HelpCircle } from 'lucide-react';
import { FolderBookmark } from '../types';

interface Props {
  bookmark: FolderBookmark | null;
  onClose: () => void;
  onSave: (bookmarkId: string, selector: string) => void;
}

export const DomCropperModal: React.FC<Props> = ({ bookmark, onClose, onSave }) => {
  if (!bookmark) return null;

  const [selector, setSelector] = useState(bookmark.selector || '#main-content-table');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [hideAds, setHideAds] = useState(true);

  const presets = [
    { label: '核心指标卡 (#metrics)', val: '#dashboard-kpi' },
    { label: '数据列表表格 (table.data-grid)', val: '.issue-stream-list' },
    { label: '图表折线区 (.chart-wrapper)', val: '.chart-container' },
    { label: '右侧状态栏 (#aside-summary)', val: '#sidebar-widget' },
  ];

  const handleApply = () => {
    onSave(bookmark.id, selector);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                网页 DOM 区域裁剪注入器
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                提取 {bookmark.name} 的核心区域，过滤页头导航与杂讯
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Target URL */}
          <div className="text-xs text-slate-500 dark:text-zinc-400 font-mono bg-slate-100/60 dark:bg-zinc-800/60 px-3 py-2 rounded-xl flex items-center justify-between">
            <span className="truncate">目标地址: {bookmark.url}</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
              ● 连通性正常
            </span>
          </div>

          {/* Selector input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center justify-between">
              <span>CSS 目标选择器 (Selector)</span>
              <span className="text-[11px] text-slate-400">如 #main, .table-view</span>
            </label>
            <input
              type="text"
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
              placeholder="例如: #grafana-panel-2 或 .dashboard-metrics"
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 block mb-1.5">
              常用 DOM 区域预设:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setSelector(p.val)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/40 dark:hover:text-amber-400 text-slate-600 dark:text-zinc-300 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Simulation Preview Window */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-500" /> 裁剪视口高保真模拟
              </span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">
                {selector} (生效中)
              </span>
            </div>

            <div className="relative h-44 rounded-2xl border-2 border-amber-400/80 dark:border-amber-500/80 bg-slate-950 overflow-hidden shadow-inner flex flex-col">
              {/* Simulated browser window bar */}
              <div className="h-6 bg-slate-900 border-b border-slate-800 flex items-center px-3 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-slate-400 font-mono ml-2 truncate">
                  {bookmark.name} [Cropped: {selector}]
                </span>
              </div>

              {/* Cropped content view */}
              <div className="p-3 text-slate-200 flex-1 overflow-hidden font-mono text-xs space-y-2 bg-gradient-to-b from-slate-900 to-slate-950">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px]">
                  <span className="text-emerald-400 font-bold">● LIVE DOM EXTRACTED</span>
                  <span className="text-slate-500">Auto Refresh: 5m</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] text-slate-400">Total TPS</span>
                    <div className="text-sm font-bold text-white">4,821 /s</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] text-slate-400">Avg Latency</span>
                    <div className="text-sm font-bold text-amber-400">14.2 ms</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] text-slate-400">Health</span>
                    <div className="text-sm font-bold text-emerald-400">99.98%</div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  已自动剔除该网站的页眉导航、Cookie 弹窗以及侧边栏，仅将目标节点注入 SideBento 卡片。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/40">
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              checked={hideAds}
              onChange={(e) => setHideAds(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span>自动移除页面内广告与无关样式</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-200/60 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-1.5 text-xs font-medium bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>保存裁剪规则</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
