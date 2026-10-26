import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { DockItem } from '../types';

interface Props {
  items: DockItem[];
  activeItemId: string | null;
  onSelectItem: (id: string) => void;
  isExpandedLabels: boolean;
  onToggleLabels: () => void;
  onOpenBookmarkManager: () => void;
}

export const VerticalDockRail: React.FC<Props> = ({
  items,
  activeItemId,
  onSelectItem,
  isExpandedLabels,
  onToggleLabels,
  onOpenBookmarkManager,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Group items by category
  const tools = items.filter((i) => i.category === 'tool');
  const bookmarks = items.filter((i) => i.category === 'bookmark');
  const folders = items.filter((i) => i.category === 'folder');
  const iframes = items.filter((i) => i.category === 'iframe');

  // Render dynamic Lucide icon
  const renderIcon = (iconName: string, className = 'w-5 h-5') => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[iconName] || Icons.Box;
    return <IconComponent className={className} />;
  };

  const getItemFisheyeScale = (globalIndex: number) => {
    if (hoveredIndex === null) return 'scale-100';
    const dist = Math.abs(hoveredIndex - globalIndex);
    if (dist === 0) return 'scale-115 shadow-lg z-20';
    if (dist === 1) return 'scale-105 z-10';
    return 'scale-100';
  };

  const renderGroup = (groupItems: DockItem[], startIndex: number, groupTitle: string) => (
    <div className="space-y-1.5 py-1.5">
      {isExpandedLabels && (
        <div className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 truncate flex items-center justify-between">
          <span>{groupTitle}</span>
          <span className="font-mono text-[9px] text-slate-400">{groupItems.length}</span>
        </div>
      )}
      {groupItems.map((item, idx) => {
        const globalIdx = startIndex + idx;
        const isActive = activeItemId === item.id;
        const fisheyeClass = getItemFisheyeScale(globalIdx);

        return (
          <div
            key={item.id}
            className="relative group flex items-center"
            onMouseEnter={() => setHoveredIndex(globalIdx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <button
              onClick={() => onSelectItem(item.id)}
              aria-label={item.title}
              className={`relative flex items-center transition-all duration-200 ease-out rounded-2xl select-none ${fisheyeClass} ${
                isExpandedLabels
                  ? 'w-full px-2.5 py-2 justify-start gap-2.5'
                  : 'w-10 h-10 justify-center mx-auto'
              } ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/50'
                  : item.isCustomTool
                  ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                  : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-100/80 dark:hover:bg-zinc-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {/* Icon Container */}
              <div
                className={`flex items-center justify-center shrink-0 transition-transform ${
                  isActive ? 'scale-105' : ''
                }`}
              >
                {renderIcon(item.icon, isExpandedLabels ? 'w-4 h-4' : 'w-5 h-5')}
              </div>

              {/* Expanded Label text */}
              {isExpandedLabels && (
                <div className="flex-1 text-left min-w-0">
                  <div className="text-xs font-semibold truncate leading-tight">
                    {item.shortTitle}
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono text-slate-400 dark:text-zinc-400 block truncate">
                      {item.badge}
                    </span>
                  )}
                  {item.isCustomTool && !item.badge && (
                    <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 block truncate">
                      ★ 自研
                    </span>
                  )}
                </div>
              )}

              {/* Active Glowing Dot Indicator */}
              {isActive && !isExpandedLabels && (
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-white rounded-r-full shadow-sm" />
              )}
            </button>

            {/* Hover Tooltip in Icon-only mode */}
            {!isExpandedLabels && (
              <div className="absolute left-[54px] z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 transform translate-x-1 group-hover:translate-x-0">
                <div className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 dark:bg-zinc-950/90 text-white text-xs font-medium backdrop-blur-md shadow-xl border border-white/10 whitespace-nowrap flex items-center gap-1.5">
                  <span>{item.title}</span>
                  {item.isCustomTool && (
                    <span className="text-[10px] px-1 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      ★ 自研工具
                    </span>
                  )}
                  {item.badge && (
                    <span className="text-[10px] px-1 rounded bg-blue-500/20 text-blue-300 font-mono">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <nav
      aria-label="SideBento Dock Rail"
      className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ease-in-out border-r border-slate-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-2xl shadow-xl flex flex-col justify-between ${
        isExpandedLabels ? 'w-[134px]' : 'w-[54px]'
      }`}
    >
      {/* Top Header / App Logo */}
      <div className="p-2 border-b border-slate-200/60 dark:border-zinc-800/60 flex flex-col items-center justify-center shrink-0 gap-1.5">
        <div
          onClick={onToggleLabels}
          title={isExpandedLabels ? '点击切换为纯图标模式' : '点击切换为图文模式'}
          className="cursor-pointer group flex items-center gap-2 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors w-full justify-center"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
            <span className="text-sm font-black">🍱</span>
          </div>
          {isExpandedLabels && (
            <div className="min-w-0 pr-1 flex-1">
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-100 truncate block">
                SideBento
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium truncate block">
                微工具盒
              </span>
            </div>
          )}
        </div>

        {/* Quick Button: Bookmark & Tool Mount Manager */}
        <button
          onClick={onOpenBookmarkManager}
          aria-label="挂载书签与自研工具"
          className={`w-full py-1.5 rounded-xl border border-amber-400/40 dark:border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors flex items-center justify-center gap-1.5 shadow-sm ${
            isExpandedLabels ? 'px-2.5 justify-start' : 'px-1'
          }`}
          title="管理我的书签与自研工具挂载 (点击直接选择哪些网页显示在此 Dock 栏)"
        >
          <Icons.Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
          {isExpandedLabels && (
            <span className="text-[11px] font-bold truncate">挂载我的书签</span>
          )}
        </button>
      </div>

      {/* Scrollable Items Container (Tools, Mounted Bookmarks, Folders, iFrames) */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-1.5 py-2 space-y-2">
        {/* Group 1: 高频工具 */}
        {renderGroup(tools, 0, '高频工具')}

        {/* Divider 1 & Group: 我的挂载书签 & 自研工具 */}
        {bookmarks.length > 0 && (
          <>
            <div className="border-t border-amber-300/40 dark:border-amber-600/30 my-1 mx-1" />
            {renderGroup(bookmarks, tools.length, '我的挂载书签')}
          </>
        )}

        {/* Divider 2 */}
        <div className="border-t border-slate-200/60 dark:border-zinc-800/60 my-1 mx-1" />

        {/* Group 3: 书签包文件夹 */}
        {renderGroup(folders, tools.length + bookmarks.length, '书签包')}

        {/* Divider 3 */}
        <div className="border-t border-slate-200/60 dark:border-zinc-800/60 my-1 mx-1" />

        {/* Group 4: 套壳网页 */}
        {renderGroup(iframes, tools.length + bookmarks.length + folders.length, '套壳微应用')}
      </div>

      {/* Bottom Switch: Label Toggle (Icon vs Text Mode) */}
      <div className="p-2 border-t border-slate-200/60 dark:border-zinc-800/60 shrink-0 bg-slate-50/50 dark:bg-zinc-900/50">
        <button
          onClick={onToggleLabels}
          aria-label={isExpandedLabels ? '收起文字标签' : '展开文字标签'}
          className="w-full py-2 px-1 rounded-xl text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-200/60 dark:hover:bg-zinc-800/60 transition-colors flex items-center justify-center gap-1.5"
          title={isExpandedLabels ? '折叠为紧凑纯图标' : '展开标签文字'}
        >
          {isExpandedLabels ? (
            <>
              <Icons.PanelLeftClose className="w-4 h-4 shrink-0" />
              <span className="text-[11px] font-semibold truncate">折叠标签</span>
            </>
          ) : (
            <Icons.PanelLeftOpen className="w-4 h-4 shrink-0" />
          )}
        </button>
      </div>
    </nav>
  );
};
