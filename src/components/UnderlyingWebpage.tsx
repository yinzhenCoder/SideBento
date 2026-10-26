import React, { useState } from 'react';
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
            <input
              type="text"
              readOnly
              value="Type / to search repository..."
              className="bg-[#0d1117] border border-[#30363d] text-[#8b949e] px-3 py-1.5 rounded-lg text-xs w-56"
            />
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

        {/* Git Branch & Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-[#21262d] border border-[#30363d] text-xs font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>main</span>
            </div>
            <span className="text-xs text-[#8b949e]">
              Latest commit <span className="font-mono text-white">42a78f</span> by alex-dev: Add ISO 7064 checksum verification
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyClone}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg text-xs font-semibold transition-colors"
            >
              {copiedClone ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedClone ? 'Cloned URL Copied' : 'Code'}</span>
            </button>
          </div>
        </div>

        {/* File Tree Table */}
        <div className="rounded-xl border border-[#30363d] overflow-hidden bg-[#161b22]">
          <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] text-xs text-[#8b949e] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">alex-dev</span>
              <span>released v1.4.0 with Google Bookmark tree selective import & mount</span>
            </div>
            <span className="font-mono text-[11px]">32 commits</span>
          </div>

          <div className="divide-y divide-[#30363d] text-xs font-mono">
            {[
              {
                name: 'src/components/widgets',
                type: 'dir',
                msg: 'Implement Timestamp, IDCard, JSON & ImageCompressor Bento cards',
                time: '12 mins ago',
              },
              {
                name: 'src/components/BookmarkTreeView.tsx',
                type: 'file',
                msg: 'Add recursive tree view with tri-state selection and direct Dock mount',
                time: 'Just now',
              },
              {
                name: 'src/utils',
                type: 'dir',
                msg: 'Add ISO-7064 mod 11-2 and GB11643 pure logic unit tests',
                time: '28 mins ago',
              },
              {
                name: 'manifest.json',
                type: 'file',
                msg: 'Declare SideBento background service worker and action popup',
                time: '2 hours ago',
              },
              {
                name: 'README.md',
                type: 'file',
                msg: 'Update documentation for zero-squeeze overlay layout',
                time: '4 hours ago',
              },
              {
                name: 'package.json',
                type: 'file',
                msg: 'Bump dependencies to latest React 19 and Tailwind v4',
                time: '1 day ago',
              },
            ].map((f) => (
              <div
                key={f.name}
                className="px-4 py-2.5 flex items-center justify-between hover:bg-[#21262d]/50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {f.type === 'dir' ? (
                    <Folder className="w-4 h-4 text-[#58a6ff]" />
                  ) : (
                    <FileText className="w-4 h-4 text-[#8b949e]" />
                  )}
                  <span className="text-[#e6edf3] group-hover:text-[#58a6ff] transition-colors">
                    {f.name}
                  </span>
                </div>
                <span className="text-[#8b949e] text-[11px] truncate max-w-sm hidden md:inline">
                  {f.msg}
                </span>
                <span className="text-[#8b949e] text-[11px] shrink-0">{f.time}</span>
              </div>
            ))}
          </div>
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
