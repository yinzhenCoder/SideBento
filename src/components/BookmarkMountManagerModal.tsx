import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Star,
  Plus,
  Check,
  Globe,
  Database,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  BookmarkCheck,
  Folder,
  Upload,
  FileCode,
  Download,
  FolderTree,
  Pin,
  CheckCircle2,
} from 'lucide-react';
import { BrowserBookmarkItem, filterBookmarks } from '../utils/bookmarkManager';
import {
  BookmarkTreeNode,
  PRESET_CHROME_BOOKMARKS_TREE,
  parseChromeBookmarksHtml,
  flattenBookmarkTree,
  getAllBookmarkIdsUnderNode,
} from '../utils/bookmarkTree';
import { BookmarkTreeView } from './BookmarkTreeView';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BrowserBookmarkItem[];
  onTogglePin: (id: string) => void;
  onAddBookmark: (
    newBookmark: Omit<BrowserBookmarkItem, 'id' | 'isPinnedToDock'> & { isPinnedToDock?: boolean }
  ) => void;
  onOpenInDrawer: (id: string) => void;
}

export const BookmarkMountManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  bookmarks,
  onTogglePin,
  onAddBookmark,
  onOpenInDrawer,
}) => {
  if (!isOpen) return null;

  // Active Tab
  const [activeTab, setActiveTab] = useState<'manager' | 'chrome_import' | 'add_new'>('chrome_import');

  // Search & Filter in Manager Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'pinned' | 'custom'>('all');

  // Tree Import State
  const [treeData, setTreeData] = useState<BookmarkTreeNode>(PRESET_CHROME_BOOKMARKS_TREE);
  const [preserveFolderHierarchy, setPreserveFolderHierarchy] = useState(true);
  const [selectedTreeIds, setSelectedTreeIds] = useState<Set<string>>(() => {
    // By default, select all self-dev tools + top high freq tools
    const initial = new Set<string>();
    initial.add('bm-self-1');
    initial.add('bm-self-2');
    initial.add('bm-self-4');
    initial.add('bm-fe-1');
    initial.add('bm-fe-2');
    initial.add('bm-des-1');
    return initial;
  });

  // Manual Add Form State
  const [newTitle, setNewTitle] = useState('');
  const [newShortTitle, setNewShortTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newFolder, setNewFolder] = useState('自研内部工具');
  const [newDesc, setNewDesc] = useState('');
  const [isSelfDev, setIsSelfDev] = useState(true);
  const [isMountNow, setIsMountNow] = useState(true);

  // Status feedback inside modal
  const [importStatusMsg, setImportStatusMsg] = useState<string | null>(null);

  // Mounted IDs set for rapid lookup
  const mountedIds = useMemo(() => {
    return new Set(bookmarks.filter((b) => b.isPinnedToDock).map((b) => b.id));
  }, [bookmarks]);

  // Collect unique folders for tab
  const folderList = ['all', ...Array.from(new Set(bookmarks.map((b) => b.folder)))];

  // Filter bookmarks in manager tab
  const filtered = useMemo(() => {
    let result = filterBookmarks(bookmarks, searchQuery, selectedFolder);
    if (filterType === 'pinned') {
      result = result.filter((b) => b.isPinnedToDock);
    } else if (filterType === 'custom') {
      result = result.filter((b) => b.isCustomTool);
    }
    return result;
  }, [bookmarks, searchQuery, selectedFolder, filterType]);

  const pinnedCount = bookmarks.filter((b) => b.isPinnedToDock).length;

  // Tree selection handlers
  const handleToggleTreeSelect = (id: string, isFolder: boolean, node: BookmarkTreeNode) => {
    setSelectedTreeIds((prev) => {
      const next = new Set(prev);
      if (isFolder) {
        const childIds = getAllBookmarkIdsUnderNode(node);
        const allSelected = childIds.every((cid) => next.has(cid));
        if (allSelected) {
          childIds.forEach((cid) => next.delete(cid));
        } else {
          childIds.forEach((cid) => next.add(cid));
        }
      } else {
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
      }
      return next;
    });
  };

  const handleSelectAllTree = () => {
    const allLeafs = flattenBookmarkTree(treeData);
    setSelectedTreeIds(new Set(allLeafs.map((l) => l.id)));
  };

  const handleClearAllTree = () => {
    setSelectedTreeIds(new Set());
  };

  const handleSelectOnlyCustomTree = () => {
    const allLeafs = flattenBookmarkTree(treeData);
    const custom = allLeafs.filter((l) => l.isCustomTool);
    setSelectedTreeIds(new Set(custom.map((c) => c.id)));
  };

  // Direct toggle mount from tree node
  const handleToggleMountFromTree = (node: BookmarkTreeNode) => {
    if (!node.url) return;
    const existing = bookmarks.find((b) => b.id === node.id || b.url === node.url);
    if (existing) {
      onTogglePin(existing.id);
    } else {
      // Add and pin directly
      onAddBookmark({
        title: node.title,
        shortTitle: node.shortTitle || node.title.slice(0, 4),
        url: node.url,
        folder: preserveFolderHierarchy && node.folderPath && node.folderPath.length > 0
          ? node.folderPath[node.folderPath.length - 1]
          : 'Google导入书签',
        description: node.description || (node.isCustomTool ? '自研微工具' : '网页书签直达'),
        icon: node.icon || (node.isCustomTool ? 'Cpu' : 'Globe'),
        isCustomTool: Boolean(node.isCustomTool),
        openMode: 'drawer',
        isPinnedToDock: true,
      });
      setImportStatusMsg(`已挂载「${node.title}」至左侧 Dock 栏`);
      setTimeout(() => setImportStatusMsg(null), 2500);
    }
  };

  // Batch import selected tree bookmarks
  const handleBatchImport = (shouldMountDirectly: boolean) => {
    const allLeafs = flattenBookmarkTree(treeData);
    const selectedLeafs = allLeafs.filter((l) => selectedTreeIds.has(l.id));

    if (selectedLeafs.length === 0) {
      setImportStatusMsg('请先勾选需要导入的书签');
      setTimeout(() => setImportStatusMsg(null), 2000);
      return;
    }

    let addedCount = 0;
    selectedLeafs.forEach((leaf) => {
      if (!leaf.url) return;
      const folderName =
        preserveFolderHierarchy && leaf.folderPath && leaf.folderPath.length > 0
          ? leaf.folderPath[leaf.folderPath.length - 1]
          : 'Google导入书签';

      onAddBookmark({
        title: leaf.title,
        shortTitle: leaf.shortTitle || leaf.title.slice(0, 4),
        url: leaf.url,
        folder: folderName,
        description: leaf.description || (leaf.isCustomTool ? '自研微工具' : '网页书签直达'),
        icon: leaf.icon || (leaf.isCustomTool ? 'Cpu' : 'Globe'),
        isCustomTool: Boolean(leaf.isCustomTool),
        openMode: 'drawer',
        isPinnedToDock: shouldMountDirectly,
      });
      addedCount++;
    });

    setImportStatusMsg(
      `成功导入 ${addedCount} 个书签${
        shouldMountDirectly ? '并直接挂载到 Dock 侧边栏' : ''
      }${preserveFolderHierarchy ? ' (已保留原目录结构)' : ''}！`
    );
    setTimeout(() => setImportStatusMsg(null), 3000);
    // Switch to manager view to see results
    setTimeout(() => setActiveTab('manager'), 1000);
  };

  // Upload Chrome bookmarks HTML file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        const parsedTree = parseChromeBookmarksHtml(content);
        setTreeData(parsedTree);
        const allLeafs = flattenBookmarkTree(parsedTree);
        setSelectedTreeIds(new Set(allLeafs.map((l) => l.id)));
        setImportStatusMsg(`成功解析 Chrome 书签文件，共发现 ${allLeafs.length} 个书签！`);
        setTimeout(() => setImportStatusMsg(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  // Reset to default preset
  const handleLoadPresetTree = () => {
    setTreeData(PRESET_CHROME_BOOKMARKS_TREE);
    const allLeafs = flattenBookmarkTree(PRESET_CHROME_BOOKMARKS_TREE);
    setSelectedTreeIds(new Set(allLeafs.slice(0, 6).map((l) => l.id)));
    setImportStatusMsg('已加载 Chrome 原生书签树标准预设数据');
    setTimeout(() => setImportStatusMsg(null), 2500);
  };

  // Handle manual bookmark creation
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    onAddBookmark({
      title: newTitle.trim(),
      shortTitle: newShortTitle.trim() || newTitle.slice(0, 4),
      url: newUrl.trim(),
      folder: newFolder,
      description: newDesc.trim() || (isSelfDev ? '自研常用微工具' : '网页书签快捷直达'),
      icon: isSelfDev ? 'Cpu' : 'Globe',
      isCustomTool: isSelfDev,
      openMode: 'drawer',
      isPinnedToDock: isMountNow,
    });

    // Reset form
    setNewTitle('');
    setNewShortTitle('');
    setNewUrl('');
    setNewDesc('');
    setImportStatusMsg(`已添加「${newTitle}」${isMountNow ? '并挂载到 Dock' : ''}`);
    setTimeout(() => setImportStatusMsg(null), 2500);
    setActiveTab('manager');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/80 dark:bg-zinc-800/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                  书签与自研工具挂载中心
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200/50 dark:border-blue-800/50">
                  Dock 已挂载 {pinnedCount} 个图标
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                支持导入 Google Chrome 书签树、保留原目录结构、自由选择书签或自研微工具常驻左侧 Dock 栏
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

        {/* Top Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between gap-4 shrink-0">
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setActiveTab('chrome_import')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'chrome_import'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Google 书签树导入</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                树状选择
              </span>
            </button>

            <button
              onClick={() => setActiveTab('manager')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'manager'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400'
              }`}
            >
              <Pin className="w-4 h-4 rotate-45" />
              <span>已挂载 Dock 管理</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                {bookmarks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('add_new')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'add_new'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>录入自研工具 / 新网页</span>
            </button>
          </div>

          {/* Quick Notice Banner */}
          {importStatusMsg && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{importStatusMsg}</span>
            </div>
          )}
        </div>

        {/* Tab 1: Google Chrome Bookmarks Tree Import */}
        {activeTab === 'chrome_import' && (
          <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
            {/* Import Methods Header Bar */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 dark:from-zinc-800/60 dark:via-zinc-800/40 dark:to-zinc-800/60 border border-blue-200/60 dark:border-zinc-700/60 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Google Chrome 书签管理器树状解析器</span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  支持直接载入浏览器书签树，保留原文件夹目录结构，并自由多选或单个直接挂载到 Dock
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Upload HTML button */}
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>上传 Chrome 书签 HTML</span>
                  <input
                    type="file"
                    accept=".html,.htm"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Load Preset button */}
                <button
                  type="button"
                  onClick={handleLoadPresetTree}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>加载 Chrome 预设书签树</span>
                </button>
              </div>
            </div>

            {/* Tree Import Options */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preserveFolderHierarchy}
                  onChange={(e) => setPreserveFolderHierarchy(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="font-semibold text-blue-700 dark:text-blue-400">
                  保留现有目录结构
                </span>
                <span className="text-slate-400 dark:text-zinc-500 text-[11px]">
                  (将原书签文件夹转换为 SideBento 对应分类书签包)
                </span>
              </label>

              <div className="text-xs text-slate-500 dark:text-zinc-400">
                已勾选 <span className="font-bold text-blue-600 dark:text-blue-400">{selectedTreeIds.size}</span> 项书签
              </div>
            </div>

            {/* The Recursive Tree View Component */}
            <BookmarkTreeView
              treeRoot={treeData}
              selectedIds={selectedTreeIds}
              onToggleSelect={handleToggleTreeSelect}
              onSelectAll={handleSelectAllTree}
              onClearAll={handleClearAllTree}
              onSelectOnlyCustom={handleSelectOnlyCustomTree}
              mountedIds={mountedIds}
              onToggleMount={handleToggleMountFromTree}
            />

            {/* Tree Bottom Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-zinc-800">
              <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                💡 点击树中任一书签右侧的「挂载到 Dock」，可跳过导入流程直接挂载为侧边栏图标。
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBatchImport(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition-colors"
                >
                  仅导入所选书签 ({selectedTreeIds.size})
                </button>

                <button
                  type="button"
                  onClick={() => handleBatchImport(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all"
                >
                  <Pin className="w-3.5 h-3.5 rotate-45" />
                  <span>导入并直接挂载到 Dock ({selectedTreeIds.size})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Dock Mounted Bookmarks & Custom Tools Manager */}
        {activeTab === 'manager' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Filter & Search Bar */}
            <div className="p-4 border-b border-slate-200/80 dark:border-zinc-800/80 space-y-3 bg-white dark:bg-zinc-900 shrink-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索已挂载或已导入的自研工具、书签名称与 URL..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      filterType === 'all'
                        ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    全部 ({bookmarks.length})
                  </button>
                  <button
                    onClick={() => setFilterType('pinned')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 ${
                      filterType === 'pinned'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    <Pin className="w-3 h-3 rotate-45" />
                    <span>已挂载 Dock ({pinnedCount})</span>
                  </button>
                  <button
                    onClick={() => setFilterType('custom')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      filterType === 'custom'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    自研工具 ({bookmarks.filter((b) => b.isCustomTool).length})
                  </button>
                </div>
              </div>

              {/* Folder Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                <span className="text-[11px] text-slate-400 dark:text-zinc-500 shrink-0 font-medium">
                  目录分类:
                </span>
                {folderList.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFolder(f)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedFolder === f
                        ? 'bg-slate-800 text-white dark:bg-zinc-200 dark:text-zinc-900 shadow-xs'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {f === 'all' ? '全部目录' : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookmark List */}
            <div className="p-4 space-y-2.5 overflow-y-auto custom-scrollbar flex-1">
              {filtered.map((bm) => (
                <div
                  key={bm.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    bm.isPinnedToDock
                      ? 'bg-blue-500/5 dark:bg-blue-950/20 border-blue-400/40 dark:border-blue-600/40 shadow-xs'
                      : 'bg-white/80 dark:bg-zinc-800/60 border-slate-200/70 dark:border-zinc-700/60 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        bm.isCustomTool
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {bm.isCustomTool ? <Cpu className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
                          {bm.title}
                        </span>
                        {bm.isCustomTool && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold shrink-0">
                            ★ 自研工具
                          </span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-zinc-700 text-slate-500 dark:text-zinc-400 shrink-0">
                          {bm.folder}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                        {bm.description}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 truncate block">
                        {bm.url}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Direct Preview & Dock Mount Switch */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onOpenInDrawer(bm.id);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>使用</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onTogglePin(bm.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        bm.isPinnedToDock
                          ? 'bg-blue-600 text-white shadow-xs ring-1 ring-blue-500'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200'
                      }`}
                    >
                      {bm.isPinnedToDock ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>已挂载 Dock</span>
                        </>
                      ) : (
                        <>
                          <Pin className="w-3.5 h-3.5 rotate-45" />
                          <span>挂载到 Dock</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="py-12 text-center text-xs text-slate-400 dark:text-zinc-500 space-y-2">
                  <p>没有找到符合条件的书签或工具。</p>
                  <button
                    onClick={() => setActiveTab('chrome_import')}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    前往「Google 书签树导入」一键载入浏览器书签 →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Manual Add / Self-dev tool */}
        {activeTab === 'add_new' && (
          <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
            <form
              onSubmit={handleCreateSubmit}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-zinc-700/80">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100">
                    录入常用自研微工具或网页书签
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    录入后可直接作为左侧 Dock 独立图标常驻，不用每次重新寻找或重复造轮子
                  </p>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 cursor-pointer font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-200/50">
                  <input
                    type="checkbox"
                    checked={isSelfDev}
                    onChange={(e) => setIsSelfDev(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>标记为「我自己开发的常用工具」</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-zinc-300 block mb-1">
                    工具/网页完整名称 *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="如: 私有 API 文档网关"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-zinc-300 block mb-1">
                    Dock 简写标签 (2-4字)
                  </label>
                  <input
                    type="text"
                    value={newShortTitle}
                    onChange={(e) => setNewShortTitle(e.target.value)}
                    placeholder="如: API网关"
                    maxLength={6}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-[11px] font-medium text-slate-600 dark:text-zinc-300 block mb-1">
                    访问地址 (URL) *
                  </label>
                  <input
                    type="url"
                    required
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="http://localhost:8080 或 https://tools.myteam.net"
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-zinc-300 block mb-1">
                    归属分类目录
                  </label>
                  <select
                    value={newFolder}
                    onChange={(e) => setNewFolder(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl"
                  >
                    <option value="自研内部工具">自研内部工具</option>
                    <option value="第三方高频工具">第三方高频工具</option>
                    <option value="日常高频站点">日常高频站点</option>
                    <option value="我的开发调试">我的开发调试</option>
                    <option value="Google导入书签">Google导入书签</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 dark:text-zinc-300 block mb-1">
                  简要功能描述
                </label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="如: 团队内部使用的快速接口联调与 Mock 平台"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMountNow}
                    onChange={(e) => setIsMountNow(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    保存后立即挂载为左侧 Dock 图标
                  </span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('manager')}
                    className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md shadow-blue-500/20"
                  >
                    保存书签
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-800/50 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>挂载到 Dock 的书签与自研工具将实时显示在左侧竖栏，支持秒级点开沙箱工作台。</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl font-medium transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
