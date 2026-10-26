import React, { useState, useEffect, useRef } from 'react';
import {
  Github,
  Star,
  GitFork,
  Eye,
  GitPullRequest,
  CircleDot,
  FileCode,
  Folder,
  FileText,
  Search,
  Bell,
  CheckCircle,
  Copy,
  ExternalLink,
  BookOpen,
  Columns,
  Layers,
  BookmarkPlus,
  ShieldCheck,
  X,
} from 'lucide-react';

interface Props {
  onPageClick: () => void;
  leftOffset: number;
  isPushMode: boolean;
  onTogglePushMode: () => void;
  onBookmarkCurrentPage?: () => void;
}

export const UnderlyingWebpage: React.FC<Props> = ({
  onPageClick,
  leftOffset,
  isPushMode,
  onTogglePushMode,
  onBookmarkCurrentPage,
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'issues' | 'pr'>('code');
  const [starred, setStarred] = useState(false);
  const [starCount, setStarCount] = useState(12842);
  const [forkCount, setForkCount] = useState(1418);
  const [copiedClone, setCopiedClone] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const topSearchInputRef = useRef<HTMLInputElement>(null);
  const fileFilterInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: '/' focuses the search bar, 'Escape' clears
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInputActive = activeTag === 'input' || activeTag === 'textarea';

      if (e.key === '/' && !isInputActive) {
        e.preventDefault();
        topSearchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        if (searchQuery) {
          setSearchQuery('');
        }
        if (isInputActive) {
          (document.activeElement as HTMLElement)?.blur();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  const REPO_FILES = [
    {
      name: 'src/components/widgets',
      type: 'dir',
      msg: 'Implement Timestamp, IDCard, JSON & ImageCompressor Bento cards',
      time: '12 mins ago',
      category: 'components',
    },
    {
      name: 'src/components/BookmarkTreeView.tsx',
      type: 'file',
      msg: 'Add recursive tree view with tri-state selection and direct Dock mount',
      time: 'Just now',
      category: 'components',
    },
    {
      name: 'src/components/DockRail.tsx',
      type: 'file',
      msg: 'Floating dock bar with customizable pin icons and quick drawer toggle',
      time: '35 mins ago',
      category: 'components',
    },
    {
      name: 'src/components/SideDrawer.tsx',
      type: 'file',
      msg: 'Glassmorphic sliding bento panel with search, categories, and widgets',
      time: '1 hour ago',
      category: 'components',
    },
    {
      name: 'src/utils/idValidator.ts',
      type: 'file',
      msg: 'Add ISO-7064 mod 11-2 and GB11643 pure logic unit tests',
      time: '28 mins ago',
      category: 'utils',
    },
    {
      name: 'src/store/bookmarkStore.ts',
      type: 'file',
      msg: 'Sync mounted bookmarks and chrome bookmarks tree with local persistence',
      time: '45 mins ago',
      category: 'store',
    },
    {
      name: 'manifest.json',
      type: 'file',
      msg: 'Declare SideBento background service worker and action popup',
      time: '2 hours ago',
      category: 'config',
    },
    {
      name: 'README.md',
      type: 'file',
      msg: 'Update documentation for zero-squeeze overlay layout',
      time: '4 hours ago',
      category: 'docs',
    },
    {
      name: 'package.json',
      type: 'file',
      msg: 'Bump dependencies to latest React 19 and Tailwind v4',
      time: '1 day ago',
      category: 'config',
    },
    {
      name: 'vite.config.ts',
      type: 'file',
      msg: 'Configure Vite build engine, fast refresh, and server proxy',
      time: '2 days ago',
      category: 'config',
    },
  ];

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const filteredFiles = REPO_FILES.filter((f) => {
    if (!trimmedQuery) return true;
    return (
      f.name.toLowerCase().includes(trimmedQuery) ||
      f.msg.toLowerCase().includes(trimmedQuery) ||
      f.category.toLowerCase().includes(trimmedQuery)
    );
  });

  const handleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (starred) {
      setStarCount(starCount - 1);
      setStarred(false);
    } else {
      setStarCount(starCount + 1);
      setStarred(true);
    }
  };

  const handleCopyClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText('git clone https://github.com/octocat/sidebento-glass-engine.git');
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div
      onClick={onPageClick}
      style={{
        marginLeft: `${leftOffset}px`,
        width: `calc(100% - ${leftOffset}px)`,
      }}
      className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans antialiased select-auto transition-all duration-300 ease-out overflow-x-hidden"
    >
      {/* Simulation Notice Banner */}
      <div className="bg-gradient-to-r from-blue-900/70 via-indigo-900/50 to-slate-900 border-b border-blue-500/30 px-8 py-2.5 text-xs text-blue-200 flex flex-wrap items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse shrink-0" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wide">
              底座模拟网页 (GitHub Enterprise Workspace)
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              <span>避让保护生效中 · 100% 杜绝覆盖</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Bookmark Current Page Button */}
          {onBookmarkCurrentPage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmarkCurrentPage();
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 shadow-xs transition-colors"
              title="一键将此页面收藏到 SideBento 并挂载为 Dock 图标"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>收藏本页到 SideBento</span>
            </button>
          )}

          {/* Push vs Overlay Mode Switch */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePushMode();
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              isPushMode
                ? 'bg-blue-600 text-white border-blue-400/60 shadow-sm'
                : 'bg-blue-950/60 hover:bg-blue-900/80 text-blue-200 border-blue-500/30'
            }`}
            title="点击切换自适应推挤（零遮挡）与悬浮覆盖模式"
          >
            {isPushMode ? <Columns className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
            <span>排版模式: {isPushMode ? '自适应推挤（绝对不遮挡）' : '悬浮覆盖'}</span>
          </button>
        </div>
      </div>

      {/* GitHub Top Nav Bar with Generous Left/Right Padding */}
      <header className="h-16 border-b border-[#30363d] bg-[#161b22] px-8 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Github className="w-8 h-8" />
            <span className="hover:text-blue-400 transition-colors cursor-pointer">octocat</span>
            <span className="text-[#8b949e]">/</span>
            <span className="hover:text-blue-400 transition-colors cursor-pointer text-white">
              sidebento-glass-engine
            </span>
            <span className="text-[10px] text-[#8b949e] border border-[#30363d] px-2 py-0.5 rounded-full font-normal">
              Public
            </span>
          </div>
        </div>

        {/* GitHub Right Actions */}
        <div className="flex items-center gap-2.5 text-xs">
          <div className="relative hidden md:block">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-3 text-[#8b949e] pointer-events-none" />
              <input
                ref={topSearchInputRef}
                type="text"
                placeholder="Type / to search repo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0d1117] border border-[#30363d] focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff] text-white pl-8 pr-7 py-1.5 rounded-lg text-xs w-60 placeholder:text-[#8b949e] transition-all"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-[#8b949e] hover:text-white"
                  title="Clear search (Esc)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="absolute right-2 px-1 py-0.2 text-[10px] text-[#8b949e] bg-[#21262d] border border-[#30363d] rounded font-mono">
                  /
                </kbd>
              )}
            </div>
          </div>

          <button
            onClick={handleStar}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              starred
                ? 'bg-[#21262d] text-yellow-400 border-[#30363d]'
                : 'bg-[#21262d] hover:bg-[#30363d] text-white border-[#30363d]'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            <span>{starred ? 'Starred' : 'Star'}</span>
            <span className="ml-1 px-1.5 py-0.2 bg-[#30363d] rounded-full text-[10px] text-[#8b949e]">
              {starCount.toLocaleString()}
            </span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setForkCount(forkCount + 1);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] font-medium"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Fork</span>
            <span className="ml-1 px-1.5 py-0.2 bg-[#30363d] rounded-full text-[10px] text-[#8b949e]">
              {forkCount.toLocaleString()}
            </span>
          </button>
        </div>
      </header>

      {/* GitHub Repo Tabs (With Safe px-8 sm:px-12 Padding - 100% Clear & Never Obscured) */}
      <div className="border-b border-[#30363d] bg-[#161b22] px-8 sm:px-12">
        <div className="flex gap-8 text-sm font-medium">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('code');
            }}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'code'
                ? 'border-[#f78166] text-white font-semibold'
                : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <FileCode className="w-4 h-4 shrink-0 text-[#f78166]" />
            <span className="tracking-wide">Code</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('issues');
            }}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'issues'
                ? 'border-[#f78166] text-white font-semibold'
                : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <CircleDot className="w-4 h-4 shrink-0" />
            <span>Issues</span>
            <span className="px-1.5 py-0.2 bg-[#30363d] text-[11px] rounded-full text-[#c9d1d9]">
              18
            </span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('pr');
            }}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'pr'
                ? 'border-[#f78166] text-white font-semibold'
                : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <GitPullRequest className="w-4 h-4 shrink-0" />
            <span>Pull Requests</span>
            <span className="px-1.5 py-0.2 bg-[#30363d] text-[11px] rounded-full text-[#c9d1d9]">
              3
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-6 text-[#8b949e]">
            <span className="cursor-pointer hover:text-[#c9d1d9]">Actions</span>
            <span className="cursor-pointer hover:text-[#c9d1d9]">Projects</span>
            <span className="cursor-pointer hover:text-[#c9d1d9]">Wiki</span>
            <span className="cursor-pointer hover:text-[#c9d1d9]">Security</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-8 sm:px-12 py-8 space-y-6">
        {/* Repo Header & Badges */}
        <div className="space-y-3">
          <p className="text-base text-[#e6edf3] font-normal leading-relaxed">
            Ultra-lightweight Chromium extension framework providing macOS Sequoia glassmorphism
            slide-over micro-tool Bento workspaces without layout shifts or content occlusion.
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            {['chrome-extension', 'glassmorphism', 'bento-grid', 'react-19', 'macos-sequoia', 'developer-tools'].map(
              (tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-[#121d2f] text-[#58a6ff] hover:bg-[#1f3555] cursor-pointer transition-colors border border-[#1f3555]"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>

        {/* Git Branch & Action Toolbar with In-Page Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Branch Selector */}
            <div className="px-3 py-1.5 rounded-lg bg-[#21262d] border border-[#30363d] text-xs font-semibold text-white flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>main</span>
            </div>

            {/* In-repo File Search Bar */}
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-3 text-[#8b949e] pointer-events-none" />
                <input
                  ref={fileFilterInputRef}
                  type="text"
                  placeholder="Filter files or commits... (press /)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#30363d] focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff] text-white pl-8 pr-16 py-1.5 rounded-lg text-xs placeholder:text-[#8b949e] transition-all"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-0.5 text-[#8b949e] hover:text-white rounded"
                      title="Clear search filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                  <span className="text-[10px] text-[#8b949e] px-1.5 py-0.2 bg-[#21262d] border border-[#30363d] rounded font-mono">
                    {filteredFiles.length}/{REPO_FILES.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Filter Tags */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px]">
              {[
                { label: 'All', val: '' },
                { label: 'Components', val: 'components' },
                { label: 'Utils', val: 'utils' },
                { label: 'Config', val: 'config' },
              ].map((filter) => {
                const isActive = searchQuery.toLowerCase() === filter.val.toLowerCase();
                return (
                  <button
                    key={filter.label}
                    onClick={() => setSearchQuery(filter.val)}
                    className={`px-2 py-1 rounded-md border transition-colors ${
                      isActive
                        ? 'bg-[#1f6feb]/20 text-[#58a6ff] border-[#388bfd]'
                        : 'bg-[#21262d] text-[#8b949e] border-[#30363d] hover:text-[#c9d1d9] hover:bg-[#30363d]'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs text-[#8b949e] hidden xl:inline">
              Latest commit <span className="font-mono text-white">42a78f</span>
            </span>
            <button
              onClick={handleCopyClone}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
            >
              {copiedClone ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedClone ? 'Cloned URL Copied' : 'Code'}</span>
            </button>
          </div>
        </div>

        {/* File Tree Table */}
        <div className="rounded-xl border border-[#30363d] overflow-hidden bg-[#161b22]">
          <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] text-xs text-[#8b949e] flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">alex-dev</span>
              <span>released v1.4.0 with Google Bookmark tree selective import & mount</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              {searchQuery && (
                <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  Filtered: {filteredFiles.length} of {REPO_FILES.length} items
                </span>
              )}
              <span className="text-[#8b949e]">32 commits</span>
            </div>
          </div>

          {filteredFiles.length > 0 ? (
            <div className="divide-y divide-[#30363d] text-xs font-mono">
              {filteredFiles.map((f) => {
                const q = searchQuery.trim().toLowerCase();
                const renderHighlighted = (text: string) => {
                  if (!q) return text;
                  const idx = text.toLowerCase().indexOf(q);
                  if (idx === -1) return text;
                  return (
                    <>
                      {text.substring(0, idx)}
                      <mark className="bg-yellow-400/30 text-yellow-200 px-0.5 rounded font-bold">
                        {text.substring(idx, idx + q.length)}
                      </mark>
                      {text.substring(idx + q.length)}
                    </>
                  );
                };

                return (
                  <div
                    key={f.name}
                    className="px-4 py-2.5 flex items-center justify-between hover:bg-[#21262d]/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {f.type === 'dir' ? (
                        <Folder className="w-4 h-4 text-[#58a6ff] shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-[#8b949e] shrink-0" />
                      )}
                      <span className="text-[#e6edf3] group-hover:text-[#58a6ff] transition-colors truncate">
                        {renderHighlighted(f.name)}
                      </span>
                    </div>
                    <span className="text-[#8b949e] text-[11px] truncate max-w-sm hidden md:inline px-4">
                      {renderHighlighted(f.msg)}
                    </span>
                    <span className="text-[#8b949e] text-[11px] shrink-0">{f.time}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#21262d] flex items-center justify-center text-[#8b949e] mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                No files matching &ldquo;{searchQuery}&rdquo;
              </h3>
              <p className="text-xs text-[#8b949e] max-w-sm mb-4">
                We couldn&apos;t find any files or commit messages matching your search query. Try searching for a different keyword or file extension.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] transition-colors"
              >
                Clear search filter
              </button>
            </div>
          )}
        </div>

        {/* Readme Preview Section */}
        <div className="rounded-xl border border-[#30363d] overflow-hidden bg-[#0d1117]">
          <div className="px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] flex items-center gap-2 text-xs font-semibold text-white">
            <BookOpen className="w-4 h-4 text-[#8b949e]" />
            <span>README.md</span>
          </div>

          <div className="p-8 prose prose-invert max-w-none text-sm space-y-4">
            <h1 className="text-2xl font-bold text-white border-b border-[#30363d] pb-2">
              SideBento — macOS/iOS Bento Micro-Tool Sidebar
            </h1>
            <p className="text-[#8b949e]">
              A high-performance Chrome extension that anchors ultra-responsive micro-tools, custom
              developer utilities, and selectively mounted Chrome bookmarks in an iOS Bento Workspace
              directly alongside your active browser tabs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d]">
                <h4 className="font-semibold text-white mb-1">
                  1. 🛡️ 智能避让与零挤压技术 (Smart Push)
                </h4>
                <p className="text-xs text-[#8b949e]">
                  页面实时计算并向右偏移，保证任何按钮、导航文字（如 Code, Issues）100% 毫无遮挡。
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d]">
                <h4 className="font-semibold text-white mb-1">
                  2. 🌳 Google 书签树选择导入与挂载
                </h4>
                <p className="text-xs text-[#8b949e]">
                  支持导入浏览器书签树、保留原目录结构、勾选需要挂载的书签一键常驻左侧 Dock 栏。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
