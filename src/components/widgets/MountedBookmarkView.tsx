import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Scissors,
  Globe,
  Database,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  Bookmark,
  Share2,
} from 'lucide-react';
import { DockItem, FolderBookmark } from '../../types';

interface Props {
  dockItem: DockItem;
  onOpenCropper: (bookmark: FolderBookmark) => void;
  onCopy: (text: string, label: string) => void;
  onNotify: (msg: string) => void;
}

export const MountedBookmarkView: React.FC<Props> = ({
  dockItem,
  onOpenCropper,
  onCopy,
  onNotify,
}) => {
  const [copied, setCopied] = useState(false);
  const [quickNote, setQuickNote] = useState('');
  const [isSimulatingReload, setIsSimulatingReload] = useState(false);

  // For SQL tool simulation
  const [sqlQuery, setSqlQuery] = useState(
    'SELECT u.id, u.username, o.amount FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = 1 LIMIT 50;'
  );
  const [sqlResult, setSqlResult] = useState<string | null>(null);

  const url = dockItem.bookmarkUrl || dockItem.iframeUrl || 'https://internal.tools.dev';

  const handleCopyUrl = () => {
    onCopy(url, '网页链接');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleReload = () => {
    setIsSimulatingReload(true);
    setTimeout(() => {
      setIsSimulatingReload(false);
      onNotify('已刷新该工具沙箱视口');
    }, 400);
  };

  const handleRunSqlExplain = () => {
    setSqlResult('✅ 语法校验通过 · 索引命中: idx_users_status · 预估扫描行数: 50 · 执行耗时: 1.2ms');
    onNotify('自研 SQL 分析完成');
  };

  const bookmarkForCrop: FolderBookmark = {
    id: dockItem.id,
    name: dockItem.title,
    url,
    desc: dockItem.description,
    icon: dockItem.icon,
    category: dockItem.isCustomTool ? '自研工具' : '网页书签',
    selector: '#main-content',
  };

  return (
    <div className="space-y-4">
      {/* Header Info Card */}
      <div className="p-4 rounded-2xl bg-white/75 dark:bg-zinc-800/70 border border-slate-200/60 dark:border-zinc-700/60 shadow-sm backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              {dockItem.isCustomTool ? <Cpu className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                  {dockItem.title}
                </h3>
                {dockItem.isCustomTool && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 font-semibold">
                    ★ 我的自研工具
                  </span>
                )}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 font-mono">
                  已挂载到 Dock
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{dockItem.description}</p>
            </div>
          </div>

          <button
            onClick={() => onOpenCropper(bookmarkForCrop)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/60 dark:border-amber-800/60 transition-colors shrink-0"
            title="裁剪此网页的特定 DOM 区域为无干扰微组件"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>DOM 裁剪</span>
          </button>
        </div>

        {/* URL Bar & Actions */}
        <div className="mt-3.5 flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-700/60 text-xs">
          <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 shrink-0" />
          <span className="font-mono text-slate-700 dark:text-zinc-300 truncate flex-1">{url}</span>

          <button
            onClick={handleCopyUrl}
            className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 flex items-center gap-1 transition-colors shrink-0"
            title="复制地址"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span className="text-[11px]">{copied ? '已复制' : '复制'}</span>
          </button>

          <button
            onClick={handleReload}
            className="p-1 rounded-lg hover:bg-white dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 transition-colors shrink-0"
            title="刷新沙箱"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingReload ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          <button
            onClick={() => onNotify(`在浏览器新标签页打开: ${url}`)}
            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1 transition-colors shrink-0 text-[11px]"
          >
            <ExternalLink className="w-3 h-3" />
            <span>在新标签页打开</span>
          </button>
        </div>
      </div>

      {/* Embedded Live Tool Sandbox */}
      <div className="p-4 rounded-2xl bg-white/75 dark:bg-zinc-800/70 border border-slate-200/60 dark:border-zinc-700/60 shadow-sm backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/50 dark:border-zinc-700/50">
          <span className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-blue-500" />
            {dockItem.isCustomTool ? '自研工具沙箱交互' : '网页微缩沙箱交互'}
          </span>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
            ● 连通正常 (200 OK)
          </span>
        </div>

        {/* Dynamic Sandbox Body */}
        {dockItem.title.includes('SQL') ? (
          <div className="space-y-2.5">
            <label className="text-[11px] font-medium text-slate-600 dark:text-zinc-400 block">
              输入 SQL 语句进行实时语法检验与执行计划分析:
            </label>
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              rows={3}
              className="w-full p-2.5 text-xs font-mono bg-slate-900 text-emerald-400 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 border border-slate-800"
            />
            <div className="flex items-center justify-between">
              <button
                onClick={handleRunSqlExplain}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium shadow-sm transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>执行 EXPLAIN 分析</span>
              </button>
              <button
                onClick={() => setSqlQuery('SELECT * FROM orders WHERE status = "PAID";')}
                className="text-[11px] text-slate-500 hover:text-blue-500"
              >
                载入测试语句
              </button>
            </div>
            {sqlResult && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-mono text-emerald-700 dark:text-emerald-300">
                {sqlResult}
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/60 dark:border-zinc-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                已就绪：{dockItem.title}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                无需打开新标签页翻找书签，随时在屏幕左侧呼出使用，支持一键把高频区域裁剪为专属卡片。
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => onNotify(`已加载快速预览: ${url}`)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-xl shadow-sm transition-colors"
              >
                在侧边抽屉直接浏览
              </button>
              <button
                onClick={() => onOpenCropper(bookmarkForCrop)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-medium rounded-xl transition-colors"
              >
                ⚙️ 裁剪此页核心节点
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Notes / Developer Scratchpad */}
      <div className="p-3.5 rounded-2xl bg-white/75 dark:bg-zinc-800/70 border border-slate-200/60 dark:border-zinc-700/60 shadow-sm backdrop-blur-md space-y-2">
        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center justify-between">
          <span>专属快捷备忘便签 (随此书签保存)</span>
          <span className="text-[10px] text-slate-400">临时 Token、环境变量或参数</span>
        </label>
        <input
          type="text"
          value={quickNote}
          onChange={(e) => setQuickNote(e.target.value)}
          placeholder="例如: Authorization: Bearer eyJhbGci... 或 默认测试账号: dev_test"
          className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
        />
        {quickNote && (
          <div className="flex justify-end">
            <button
              onClick={() => {
                onCopy(quickNote, '备忘参数');
                onNotify('已复制备忘参数');
              }}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Copy className="w-3 h-3" /> 复制便签内容
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
