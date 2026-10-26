import React, { useState } from 'react';
import { X, Plus, Globe, Layers, Sparkles } from 'lucide-react';
import { DockCategory } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: {
    title: string;
    shortTitle: string;
    url?: string;
    category: DockCategory;
    description: string;
  }) => void;
}

export const AddBookmarkModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  const [category, setCategory] = useState<DockCategory>('tool');
  const [title, setTitle] = useState('');
  const [shortTitle, setShortTitle] = useState('');
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title,
      shortTitle: shortTitle || title.slice(0, 4),
      url: url.trim(),
      category,
      description: desc.trim() || '用户自定义微组件',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                添加书签 / 套壳微工具
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                将高频网页转化为 SideBento 悬浮卡片
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Category Tabs */}
          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-zinc-400 block mb-1.5">
              组件归属类型
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setCategory('tool')}
                className={`py-1.5 rounded-lg transition-colors ${
                  category === 'tool'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                高频工具
              </button>
              <button
                type="button"
                onClick={() => setCategory('folder')}
                className={`py-1.5 rounded-lg transition-colors ${
                  category === 'folder'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                书签包
              </button>
              <button
                type="button"
                onClick={() => setCategory('iframe')}
                className={`py-1.5 rounded-lg transition-colors ${
                  category === 'iframe'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                套壳网页
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
              名称 (完整标题)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="如: V2EX 热门头条"
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
              简短标签 (图标模式胶囊文字，2-4字)
            </label>
            <input
              type="text"
              value={shortTitle}
              onChange={(e) => setShortTitle(e.target.value)}
              placeholder="如: V2EX"
              maxLength={6}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
              网页链接 (URL)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://v2ex.com"
              className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
              简要描述
            </label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="如: 程序员社区技术干货交流"
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-sm transition-colors"
            >
              确定添加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
