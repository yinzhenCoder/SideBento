import React, { useState, useMemo } from 'react';
import {
  Folder,
  FolderOpen,
  Globe,
  Cpu,
  ChevronRight,
  ChevronDown,
  CheckSquare,
  Square,
  MinusSquare,
  Pin,
  Check,
  Search,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  BookmarkTreeNode,
  getAllBookmarkIdsUnderNode,
  countTreeBookmarks,
} from '../utils/bookmarkTree';

interface Props {
  treeRoot: BookmarkTreeNode;
  selectedIds: Set<string>;
  onToggleSelect: (id: string, isFolder: boolean, node: BookmarkTreeNode) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onSelectOnlyCustom: () => void;
  mountedIds: Set<string>;
  onToggleMount: (node: BookmarkTreeNode) => void;
}

export const BookmarkTreeView: React.FC<Props> = ({
  treeRoot,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onClearAll,
  onSelectOnlyCustom,
  mountedIds,
  onToggleMount,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => {
    // Default expand first 2 levels
    const initial = new Set<string>();
    initial.add(treeRoot.id);
    if (treeRoot.children) {
      treeRoot.children.forEach((c) => {
        initial.add(c.id);
        if (c.children) {
          c.children.forEach((sub) => initial.add(sub.id));
        }
      });
    }
    return initial;
  });

  const [searchFilter, setSearchFilter] = useState('');

  const toggleExpand = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    const all = new Set<string>();
    function traverse(node: BookmarkTreeNode) {
      if (node.children && node.children.length > 0) {
        all.add(node.id);
        node.children.forEach(traverse);
      }
    }
    traverse(treeRoot);
    setExpandedFolders(all);
  };

  const handleCollapseAll = () => {
    setExpandedFolders(new Set());
  };

  // Helper to render tree node recursively
  const renderTreeNode = (node: BookmarkTreeNode, level = 0) => {
    const isFolder = Boolean(node.children && node.children.length > 0);
    const isExpanded = expandedFolders.has(node.id);

    // Filter check
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const nodeMatches =
        node.title.toLowerCase().includes(q) ||
        (node.url && node.url.toLowerCase().includes(q));
      const hasMatchingDescendant =
        isFolder &&
        getAllBookmarkIdsUnderNode(node).some((id) => {
          // simple check
          return true;
        });
      if (!nodeMatches && !hasMatchingDescendant) {
        return null;
      }
    }

    if (isFolder) {
      const childBookmarkIds = getAllBookmarkIdsUnderNode(node);
      const totalLeafs = childBookmarkIds.length;
      const selectedLeafs = childBookmarkIds.filter((id) => selectedIds.has(id)).length;
      const isAllSelected = totalLeafs > 0 && selectedLeafs === totalLeafs;
      const isPartialSelected = selectedLeafs > 0 && selectedLeafs < totalLeafs;

      return (
        <div key={node.id} className="select-none">
          {/* Folder Row */}
          <div
            className={`flex items-center justify-between py-1.5 px-2 rounded-xl text-xs transition-colors group ${
              isPartialSelected || isAllSelected
                ? 'bg-blue-50/70 dark:bg-blue-950/30 text-blue-950 dark:text-blue-200'
                : 'hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300'
            }`}
            style={{ paddingLeft: `${Math.max(level * 18 + 8, 8)}px` }}
          >
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              {/* Expand Toggle */}
              <button
                type="button"
                onClick={() => toggleExpand(node.id)}
                className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-zinc-300"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Folder Checkbox */}
              <button
                type="button"
                onClick={() => onToggleSelect(node.id, true, node)}
                className="p-0.5 rounded text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity"
                title={isAllSelected ? '取消全选该目录' : '全选该目录所有书签'}
              >
                {isAllSelected ? (
                  <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                ) : isPartialSelected ? (
                  <MinusSquare className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-300 dark:text-zinc-600" />
                )}
              </button>

              {/* Folder Icon & Title */}
              <div
                onClick={() => toggleExpand(node.id)}
                className="flex items-center gap-2 cursor-pointer min-w-0"
              >
                {isExpanded ? (
                  <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
                ) : (
                  <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <span className="font-semibold truncate text-slate-900 dark:text-zinc-100">
                  {node.title}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/80 dark:bg-zinc-700/80 text-slate-600 dark:text-zinc-300 font-mono shrink-0">
                  {selectedLeafs}/{totalLeafs}
                </span>
              </div>
            </div>

            {/* Folder Batch Mount Button */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shrink-0 ml-2">
              <button
                type="button"
                onClick={() => onToggleSelect(node.id, true, node)}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline px-1 py-0.5"
              >
                {isAllSelected ? '取消该组' : '全选该组'}
              </button>
            </div>
          </div>

          {/* Render Children if expanded */}
          {isExpanded && node.children && (
            <div className="border-l border-slate-200/80 dark:border-zinc-800 ml-4 pl-0.5 space-y-0.5 my-0.5">
              {node.children.map((child) => renderTreeNode(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    // Leaf Bookmark Node
    const isSelected = selectedIds.has(node.id);
    const isMounted = mountedIds.has(node.id) || Boolean(node.isPinnedToDock);

    return (
      <div
        key={node.id}
        className={`flex items-center justify-between py-1.5 px-2 rounded-xl text-xs transition-colors group ${
          isSelected
            ? 'bg-blue-500/10 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 font-medium'
            : 'hover:bg-slate-100 dark:hover:bg-zinc-800/50 text-slate-700 dark:text-zinc-300'
        }`}
        style={{ paddingLeft: `${Math.max(level * 18 + 8, 8)}px` }}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Item Checkbox */}
          <button
            type="button"
            onClick={() => onToggleSelect(node.id, false, node)}
            className="p-0.5 rounded text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity"
            title={isSelected ? '取消选中' : '选中导入'}
          >
            {isSelected ? (
              <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-300 dark:text-zinc-600" />
            )}
          </button>

          {/* Node Icon */}
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
              node.isCustomTool
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
            }`}
          >
            {node.isCustomTool ? <Cpu className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
          </div>

          {/* Title & Meta */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-medium text-slate-900 dark:text-zinc-100 truncate">
                {node.title}
              </span>
              {node.isCustomTool && (
                <span className="text-[9px] px-1 py-0.2 rounded font-mono font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 shrink-0">
                  自研
                </span>
              )}
            </div>
            {node.url && (
              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 truncate block">
                {node.url}
              </span>
            )}
          </div>
        </div>

        {/* Direct Mount to Dock Toggle Button */}
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <button
            type="button"
            onClick={() => onToggleMount(node)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all shadow-xs ${
              isMounted
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-300'
            }`}
            title={isMounted ? '已挂载到左侧 Dock 栏，点击可卸载' : '直接将该书签挂载为左侧 Dock 图标'}
          >
            {isMounted ? (
              <>
                <Check className="w-3 h-3" />
                <span>已挂载 Dock</span>
              </>
            ) : (
              <>
                <Pin className="w-3 h-3 rotate-45" />
                <span>挂载到 Dock</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const totalLeafCount = useMemo(() => countTreeBookmarks(treeRoot), [treeRoot]);

  return (
    <div className="space-y-2.5">
      {/* Tree Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-100/70 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="在书签树中快速过滤..."
            className="w-full pl-8 pr-3 py-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <button
            type="button"
            onClick={onSelectAll}
            className="px-2 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 text-slate-700 dark:text-zinc-200"
          >
            全选 ({totalLeafCount})
          </button>
          <button
            type="button"
            onClick={onSelectOnlyCustom}
            className="px-2 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 text-emerald-600 dark:text-emerald-400 font-medium"
          >
            仅选自研工具
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="px-2 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 text-slate-500 dark:text-zinc-400"
          >
            清空
          </button>
          <span className="text-slate-300 dark:text-zinc-700">|</span>
          <button
            type="button"
            onClick={handleExpandAll}
            className="px-2 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300"
          >
            展开全部
          </button>
          <button
            type="button"
            onClick={handleCollapseAll}
            className="px-2 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300"
          >
            折叠全部
          </button>
        </div>
      </div>

      {/* Tree Content Canvas */}
      <div className="p-3 bg-white/60 dark:bg-zinc-900/40 rounded-2xl border border-slate-200/80 dark:border-zinc-800 max-h-[380px] overflow-y-auto custom-scrollbar">
        {renderTreeNode(treeRoot)}
      </div>
    </div>
  );
};
