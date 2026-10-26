import React, { useState } from 'react';
import { X, BookmarkPlus, Check, Globe, FolderPlus } from 'lucide-react';
import { BrowserBookmarkItem } from '../utils/bookmarkManager';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentPageTitle?: string;
  currentPageUrl?: string;
  existingFolders: string[];
  onSaveBookmark: (bookmark: Omit<BrowserBookmarkItem, 'id' | 'isPinnedToDock'> & { isPinnedToDock?: boolean }) => void;
}

export const QuickBookmarkModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentPageTitle = 'octocat / sidebento-glass-engine (GitHub Workspace)',
  currentPageUrl = 'https://github.com/octocat/sidebento-glass-engine',
  existingFolders,
  onSaveBookmark,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(currentPageTitle);
  const [shortTitle, setShortTitle] = useState('GitHub');
  const [url, setUrl] = useState(currentPageUrl);
  const [folder, setFolder] = useState(existingFolders[0] || '我的自研工具');
  const [customFolder, setCustomFolder] = useState('');
  const [isCreatingNewFolder, setIsCreatingNewFolder] = useState(false);
  const [isPinnedToDock, setIsPinnedToDock] = useState(true);
  const [isSelfDev, setIsSelfDev] = useState(false);
  const [description, setDescription] = useState('当前正在浏览的开源项目仓库');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const finalFolder = isCreatingNewFolder && customFolder.trim() ? customFolder.trim() : folder;

    onSaveBookmark({
      title: title.trim(),
      shortTitle: (shortTitle || title.slice(0, 4)).trim(),
      url: url.trim(),
      folder: finalFolder,
      description: description.trim() || '快速收藏的网页',
      icon: isSelfDev ? 'Cpu' : 'Globe',
      isCustomTool: isSelfDev,
      openMode: 'drawer',
      isPinnedToDock,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/60 dark:bg-zinc-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <BookmarkPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                收藏当前网页到 SideBento
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                直接收藏正在浏览的页面，无需切标签，可一键挂载到 Dock 栏
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
              网页标题
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                Dock 方块简短标签 (2-4字)
              </label>
              <input
                type="text"
                value={shortTitle}
                maxLength={6}
                onChange={(e) => setShortTitle(e.target.value)}
                placeholder="如: GitHub"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                收藏目录
              </label>
              {!isCreatingNewFolder ? (
                <div className="flex gap-1.5">
                  <select
                    value={folder}
                    onChange={(e) => setFolder(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100"
                  >
                    {existingFolders.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsCreatingNewFolder(true)}
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 text-slate-600 dark:text-zinc-300 text-xs"
                    title="新建目录"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={customFolder}
                    onChange={(e) => setCustomFolder(e.target.value)}
                    placeholder="输入新目录名称..."
                    className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCreatingNewFolder(false)}
                    className="px-2 py-1 text-xs text-slate-500"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
              网页地址 (URL)
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
              简要备注或用途
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="如: 项目核心代码仓库与 PR 审查"
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Mount Options */}
          <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/60 space-y-2">
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-zinc-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isPinnedToDock}
                onChange={(e) => setIsPinnedToDock(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>同时直接作为图标挂载到左侧 Dock 栏（立即可见、一键呼出）</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={isSelfDev}
                onChange={(e) => setIsSelfDev(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>标记为「我自研开发的内部工具」（显示绿色 ★ 自研标识）</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>直接收藏</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
