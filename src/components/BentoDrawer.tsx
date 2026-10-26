import React, { useState, useEffect } from 'react';
import {
  Pin,
  PinOff,
  Search,
  Plus,
  X,
  Sparkles,
  Copy,
  Check,
  Sun,
  Moon,
  Columns,
  Layers,
  Star,
} from 'lucide-react';
import { DockItem, FolderBookmark } from '../types';
import { QuickToolsGrid } from './widgets/QuickToolsGrid';
import { FolderView } from './widgets/FolderView';
import { MicroAppView } from './widgets/MicroAppView';
import { MountedBookmarkView } from './widgets/MountedBookmarkView';

interface Props {
  isOpen: boolean;
  dockWidth: number;
  drawerWidth: number;
  onDrawerWidthChange: (w: number) => void;
  activeItem: DockItem | null;
  onClose: () => void;
  isPinned: boolean;
  onTogglePin: () => void;
  isPushMode: boolean;
  onTogglePushMode: () => void;
  onOpenAddModal: () => void;
  onOpenBookmarkManager: () => void;
  onOpenCropper: (bookmark: FolderBookmark) => void;
  onCopy: (text: string, label: string) => void;
  onNotify: (msg: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const BentoDrawer: React.FC<Props> = ({
  isOpen,
  dockWidth,
  drawerWidth,
  onDrawerWidthChange,
  activeItem,
  onClose,
  isPinned,
  onTogglePin,
  isPushMode,
  onTogglePushMode,
  onOpenAddModal,
  onOpenBookmarkManager,
  onOpenCropper,
  onCopy,
  onNotify,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Clipboard intelligence banner state
  const [showClipboardBanner, setShowClipboardBanner] = useState(true);
  const [clipboardCopied, setClipboardCopied] = useState(false);

  // Drag resizer
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newWidth = e.clientX - dockWidth;
      // Clamp between 380px and 780px
      if (newWidth >= 380 && newWidth <= 820) {
        onDrawerWidthChange(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dockWidth, onDrawerWidthChange]);

  if (!isOpen) return null;

  const handleCopyClipboardPreview = () => {
    onCopy('2026-10-21 16:31:00', '时间戳转换结果');
    setClipboardCopied(true);
    setTimeout(() => setClipboardCopied(false), 1500);
  };

  return (
    <div
      style={{
        left: `${dockWidth + 12}px`,
        width: `${drawerWidth}px`,
      }}
      className="fixed top-3 bottom-3 z-30 flex flex-col rounded-3xl bg-white/85 dark:bg-zinc-900/85 backdrop-blur-2xl shadow-2xl border border-white/50 dark:border-white/10 transition-all duration-300 ease-out select-none overflow-hidden animate-in fade-in slide-in-from-left-4"
    >
      {/* Top OmniBar Header */}
      <div className="p-3.5 border-b border-slate-200/60 dark:border-zinc-800/60 shrink-0 space-y-2.5 bg-slate-50/40 dark:bg-zinc-900/40">
        <div className="flex items-center justify-between gap-2">
          {/* Active Title or Search Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
              {activeItem ? activeItem.title : 'SideBento 工作台'}
            </span>
            {activeItem && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium">
                {activeItem.category === 'tool'
                  ? '高频工具'
                  : activeItem.category === 'bookmark'
                  ? '挂载书签'
                  : activeItem.category === 'folder'
                  ? '书签包'
                  : '套壳网页'}
              </span>
            )}
          </div>

          {/* Quick Toolbar Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Manage Mounted Bookmarks Button */}
            <button
              onClick={onOpenBookmarkManager}
              className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-xl border border-amber-300/60 dark:border-amber-700/60 shadow-sm transition-colors"
              title="管理浏览器书签与自研工具在 Dock 栏的挂载"
            >
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="hidden sm:inline">书签挂载管理</span>
            </button>

            {/* Add Custom Tool button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-xl border border-slate-200/60 dark:border-zinc-700 shadow-sm transition-colors"
              title="添加新书签或套壳网页"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden md:inline">新建</span>
            </button>

            {/* Push / Overlay mode button */}
            <button
              onClick={onTogglePushMode}
              className={`p-1.5 rounded-xl border transition-colors ${
                isPushMode
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200/60 dark:border-zinc-700 hover:bg-slate-100'
              }`}
              title={isPushMode ? '当前：自适应推挤（完全不遮挡网页内容）' : '当前：悬浮覆盖模式'}
            >
              {isPushMode ? <Columns className="w-3.5 h-3.5 text-white" /> : <Layers className="w-3.5 h-3.5" />}
            </button>

            {/* Pin Toggle */}
            <button
              onClick={onTogglePin}
              className={`p-1.5 rounded-xl border transition-colors ${
                isPinned
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                  : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200/60 dark:border-zinc-700 hover:bg-slate-100'
              }`}
              title={isPinned ? '已钉住面板 (点击网页空白处不收起)' : '点击钉住面板'}
            >
              {isPinned ? <Pin className="w-3.5 h-3.5 fill-white" /> : <PinOff className="w-3.5 h-3.5" />}
            </button>

            {/* Dark/Light mode */}
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-xl bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700 hover:bg-slate-100 transition-colors"
              title={isDarkMode ? '切换为亮色模式' : '切换为暗色模式'}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Close Drawer Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white dark:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 border border-slate-200/60 dark:border-zinc-700 hover:bg-slate-100 transition-colors"
              title="收起抽屉"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Smart Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索小组件、快速转换、执行剪贴板动作..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/90 dark:bg-zinc-800/90 border border-slate-200/80 dark:border-zinc-700/80 rounded-xl text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Clipboard Intelligence Banner */}
        {showClipboardBanner && (
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <div className="truncate text-slate-800 dark:text-zinc-200">
                <span className="font-semibold text-blue-600 dark:text-blue-400">剪贴板感知：</span>
                <span className="font-mono ml-1 text-slate-600 dark:text-zinc-300">
                  1792571460 → 2026-10-21 16:31:00
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleCopyClipboardPreview}
                className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors"
              >
                {clipboardCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{clipboardCopied ? '已复制' : '一键复制'}</span>
              </button>
              <button
                onClick={() => setShowClipboardBanner(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                title="忽略"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Drawer Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {/* Render Mounted Bookmark View if category is bookmark or isBookmark */}
        {activeItem && (activeItem.category === 'bookmark' || activeItem.isBookmark) ? (
          <MountedBookmarkView
            dockItem={activeItem}
            onOpenCropper={onOpenCropper}
            onCopy={onCopy}
            onNotify={onNotify}
          />
        ) : activeItem && activeItem.category === 'folder' ? (
          /* Render Folder View if category is folder */
          <FolderView
            dockItem={activeItem}
            onOpenCropper={onOpenCropper}
            onNotify={onNotify}
          />
        ) : activeItem && activeItem.category === 'iframe' ? (
          /* Render MicroApp View if category is iframe */
          <MicroAppView
            dockItem={activeItem}
            onCopy={onCopy}
            onNotify={onNotify}
          />
        ) : (
          /* Default Tools Bento Grid */
          <QuickToolsGrid
            activeToolId={activeItem ? activeItem.id : null}
            activeItem={activeItem || undefined}
            onCopy={onCopy}
            onNotify={onNotify}
          />
        )}
      </div>

      {/* Right Edge Drag Resizer Handle */}
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        className={`absolute right-0 top-0 bottom-0 w-2 hover:w-3 cursor-col-resize flex items-center justify-center transition-all group select-none ${
          isDragging ? 'bg-blue-500/30 w-3' : 'hover:bg-blue-500/20'
        }`}
        title="按住左右拖拽以调整工作台宽度"
      >
        <div className="w-1 h-8 rounded-full bg-slate-300 dark:bg-zinc-600 group-hover:bg-blue-500 transition-colors" />
      </div>
    </div>
  );
};
