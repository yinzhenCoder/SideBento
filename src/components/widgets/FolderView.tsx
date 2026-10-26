import React, { useState } from 'react';
import { Folder, ExternalLink, Scissors, Check, Sparkles, Plus, Globe } from 'lucide-react';
import { DockItem, FolderBookmark } from '../../types';

interface Props {
  dockItem: DockItem;
  onOpenCropper: (bookmark: FolderBookmark) => void;
  onNotify: (msg: string) => void;
}

export const FolderView: React.FC<Props> = ({ dockItem, onOpenCropper, onNotify }) => {
  const items = dockItem.folderItems || [];
  const [filterQuery, setFilterQuery] = useState('');

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Folder Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-zinc-800/80 dark:to-zinc-800/40 border border-slate-200/60 dark:border-zinc-700/60 shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 dark:bg-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
              <Folder className="w-5 h-5 fill-amber-500/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                  {dockItem.title}
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 font-medium">
                  {items.length} 个书签微缩卡
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{dockItem.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="在书签包内搜索..."
              className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500 w-36"
            />
          </div>
        </div>
      </div>

      {/* iOS Folder 9-grid Bento Cards */}
      <div className="grid grid-cols-2 gap-3">
        {filteredItems.map((bm) => (
          <div
            key={bm.id}
            className="group relative p-3.5 rounded-2xl bg-white/75 dark:bg-zinc-800/70 border border-slate-200/60 dark:border-zinc-700/60 hover:border-amber-400/50 dark:hover:border-amber-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-700 flex items-center justify-center text-slate-700 dark:text-zinc-200 text-xs font-semibold">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-zinc-100 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {bm.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                      {bm.category}
                    </span>
                  </div>
                </div>

                {bm.isCropped && (
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-200/50 dark:border-emerald-800/50">
                    已裁剪
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                {bm.desc}
              </p>

              {bm.selector && (
                <div className="mt-2 text-[10px] font-mono text-slate-400 dark:text-zinc-500 truncate bg-slate-50 dark:bg-zinc-900/60 p-1 rounded-md">
                  DOM: {bm.selector}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-zinc-700/50 flex items-center justify-between gap-2">
              <button
                onClick={() => onOpenCropper(bm)}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700/60 transition-colors"
                title="选择网页局部区域（如只保留数据表格或图表），生成无杂讯小组件"
              >
                <Scissors className="w-3 h-3" />
                <span>{bm.isCropped ? '修改裁剪' : '⚙️ 裁剪网页 DOM'}</span>
              </button>

              <button
                onClick={() => onNotify(`在 Chrome 扩展侧边微窗口载入: ${bm.url}`)}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300 px-1.5 py-1 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>访问</span>
              </button>
            </div>
          </div>
        ))}

        {/* Add new card slot */}
        <button
          onClick={() => onNotify('点击右上角 [+ 添加书签/套壳] 即可录入新微缩网页')}
          className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-700 hover:border-amber-400/80 dark:hover:border-amber-500/80 flex flex-col items-center justify-center text-center text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors min-h-[140px]"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-1.5">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium">添加微缩卡片到此包</span>
          <span className="text-[10px] text-slate-400">支持一键 DOM 裁剪</span>
        </button>
      </div>
    </div>
  );
};
