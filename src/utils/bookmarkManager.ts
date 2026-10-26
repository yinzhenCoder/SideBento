/**
 * Bookmark Mounting & Custom Tool Management Logic
 */

export interface BrowserBookmarkItem {
  id: string;
  title: string;
  shortTitle: string;
  url: string;
  icon: string;
  folder: string;
  isCustomTool?: boolean; // Flag for self-developed internal tools
  isPinnedToDock: boolean; // Whether displayed on the left Dock rail
  description?: string;
  openMode: 'drawer' | 'new_tab' | 'popup';
}

export const INITIAL_BROWSER_BOOKMARKS: BrowserBookmarkItem[] = [
  // 自研与内部工具 (Self-developed / Internal tools)
  {
    id: 'my-tool-1',
    title: '我的自研 SQL 语法检查器',
    shortTitle: 'SQL检查',
    url: 'http://localhost:8080/sql-validator',
    icon: 'Database',
    folder: '自研内部工具',
    isCustomTool: true,
    isPinnedToDock: true,
    description: '自己写的小型 SQL 解析与 EXPLAIN 优化建议工具',
    openMode: 'drawer',
  },
  {
    id: 'my-tool-2',
    title: '团队私有微服务网关控制台',
    shortTitle: '私有网关',
    url: 'http://gateway.corp.internal:9000',
    icon: 'Network',
    folder: '自研内部工具',
    isCustomTool: true,
    isPinnedToDock: false,
    description: '公司内部微服务路由分发与 Token 白名单管理',
    openMode: 'drawer',
  },
  {
    id: 'my-tool-3',
    title: '自研自动化部署 Webhook 触发台',
    shortTitle: '发布流水',
    url: 'http://ci.team.local:3001/deploy',
    icon: 'GitBranch',
    folder: '自研内部工具',
    isCustomTool: true,
    isPinnedToDock: false,
    description: '一键向测试服派发最新分支构建镜像',
    openMode: 'drawer',
  },

  // 常用外部网站与在线工具书签 (External website bookmarks)
  {
    id: 'bm-ext-1',
    title: 'JSONDiff 复杂多层数据比对',
    shortTitle: 'JSON比对',
    url: 'https://www.jsondiff.com',
    icon: 'GitCompare',
    folder: '第三方高频工具',
    isPinnedToDock: true,
    description: '比对两个后端接口返回的复杂 JSON 差异',
    openMode: 'drawer',
  },
  {
    id: 'bm-ext-2',
    title: 'CanIUse 浏览器兼容性查询',
    shortTitle: 'CanIUse',
    url: 'https://caniuse.com',
    icon: 'Globe',
    folder: '第三方高频工具',
    isPinnedToDock: false,
    description: 'CSS Grid, Container Queries 与 JS 新特性兼容矩阵',
    openMode: 'drawer',
  },
  {
    id: 'bm-ext-3',
    title: 'Bundlephobia NPM 依赖体积',
    shortTitle: '包体积',
    url: 'https://bundlephobia.com',
    icon: 'Package',
    folder: '第三方高频工具',
    isPinnedToDock: false,
    description: '查询第三方 NPM 包 Gzip 压缩后实际体积与打包耗时',
    openMode: 'drawer',
  },
  {
    id: 'bm-ext-4',
    title: 'Excalidraw 协同架构手绘板',
    shortTitle: '架构草图',
    url: 'https://excalidraw.com',
    icon: 'Edit3',
    folder: '日常高频站点',
    isPinnedToDock: true,
    description: '快速画系统架构图、泳道图与技术方案草稿',
    openMode: 'new_tab',
  },
  {
    id: 'bm-ext-5',
    title: 'DevDocs 综合离线 API 速查手册',
    shortTitle: 'API速查',
    url: 'https://devdocs.io',
    icon: 'BookOpen',
    folder: '日常高频站点',
    isPinnedToDock: false,
    description: '囊括 React, TypeScript, Rust, Go, CSS 全栈文档',
    openMode: 'drawer',
  },
];

/**
 * Toggles a bookmark's pinned status
 */
export function toggleBookmarkPin(
  bookmarks: BrowserBookmarkItem[],
  bookmarkId: string
): BrowserBookmarkItem[] {
  return bookmarks.map((b) =>
    b.id === bookmarkId ? { ...b, isPinnedToDock: !b.isPinnedToDock } : b
  );
}

/**
 * Creates and adds a new user-developed tool or bookmark
 */
export function addCustomBookmark(
  bookmarks: BrowserBookmarkItem[],
  newBookmark: Omit<BrowserBookmarkItem, 'id' | 'isPinnedToDock'> & { isPinnedToDock?: boolean }
): BrowserBookmarkItem[] {
  const item: BrowserBookmarkItem = {
    id: `custom-bm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: newBookmark.title.trim(),
    shortTitle: (newBookmark.shortTitle || newBookmark.title.slice(0, 4)).trim(),
    url: newBookmark.url.trim(),
    icon: newBookmark.icon || (newBookmark.isCustomTool ? 'Cpu' : 'Globe'),
    folder: newBookmark.folder || (newBookmark.isCustomTool ? '自研内部工具' : '我的收藏'),
    isCustomTool: Boolean(newBookmark.isCustomTool),
    isPinnedToDock: newBookmark.isPinnedToDock ?? true,
    description: newBookmark.description?.trim() || '用户自定义书签微工具',
    openMode: newBookmark.openMode || 'drawer',
  };
  return [item, ...bookmarks];
}

/**
 * Filters bookmarks by keyword
 */
export function filterBookmarks(
  bookmarks: BrowserBookmarkItem[],
  query: string,
  selectedFolder?: string
): BrowserBookmarkItem[] {
  const q = query.trim().toLowerCase();
  return bookmarks.filter((b) => {
    const matchFolder = !selectedFolder || selectedFolder === 'all' || b.folder === selectedFolder;
    if (!matchFolder) return false;
    if (!q) return true;
    return (
      b.title.toLowerCase().includes(q) ||
      b.shortTitle.toLowerCase().includes(q) ||
      b.url.toLowerCase().includes(q) ||
      (b.description && b.description.toLowerCase().includes(q))
    );
  });
}
