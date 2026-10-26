/**
 * Google Chrome Bookmarks Tree Model, Parser & Presets
 */

export interface BookmarkTreeNode {
  id: string;
  title: string;
  shortTitle?: string;
  url?: string; // If undefined, this is a folder
  icon?: string;
  isCustomTool?: boolean;
  isPinnedToDock?: boolean;
  children?: BookmarkTreeNode[];
  dateAdded?: string;
  description?: string;
  folderPath?: string[]; // Breadcrumb hierarchy
}

/**
 * Parses Netscape bookmark HTML format (exported by Google Chrome Bookmark Manager)
 */
export function parseChromeBookmarksHtml(html: string): BookmarkTreeNode {
  const root: BookmarkTreeNode = {
    id: 'chrome-root',
    title: 'Google Chrome 书签管理器',
    children: [],
  };

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    function parseDl(dlElement: Element, path: string[]): BookmarkTreeNode[] {
      const items: BookmarkTreeNode[] = [];
      const children = Array.from(dlElement.children);

      for (let i = 0; i < children.length; i++) {
        const el = children[i];
        if (el.tagName.toUpperCase() === 'DT') {
          // Check if DT has an H3 (Folder) or an A (Bookmark link)
          const h3 = el.querySelector(':scope > h3');
          const a = el.querySelector(':scope > a');
          const subDl = el.querySelector(':scope > dl');

          if (h3) {
            const folderTitle = h3.textContent?.trim() || '未命名文件夹';
            const currentPath = [...path, folderTitle];
            const folderNode: BookmarkTreeNode = {
              id: `folder-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              title: folderTitle,
              folderPath: currentPath,
              children: subDl ? parseDl(subDl, currentPath) : [],
            };
            items.push(folderNode);
          } else if (a) {
            const title = a.textContent?.trim() || '未命名网页';
            const url = a.getAttribute('href') || '';
            const icon = a.getAttribute('icon') || undefined;
            const isLocalOrInternal =
              url.includes('localhost') ||
              url.includes('127.0.0.1') ||
              url.includes('.corp') ||
              url.includes('.internal') ||
              title.includes('自研') ||
              title.includes('内部') ||
              title.includes('私有');

            items.push({
              id: `bm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              title,
              shortTitle: title.slice(0, 4),
              url,
              icon: isLocalOrInternal ? 'Cpu' : 'Globe',
              isCustomTool: isLocalOrInternal,
              isPinnedToDock: false,
              folderPath: path,
              description: isLocalOrInternal ? '自研内部系统或工具' : '外部收藏网页',
            });
          }
        }
      }
      return items;
    }

    const firstDl = doc.querySelector('dl');
    if (firstDl) {
      root.children = parseDl(firstDl, ['书签栏']);
    }
  } catch (err) {
    console.error('Failed to parse Chrome bookmarks HTML:', err);
  }

  return root;
}

/**
 * Rich realistic Google Chrome Bookmarks Tree Preset
 */
export const PRESET_CHROME_BOOKMARKS_TREE: BookmarkTreeNode = {
  id: 'chrome-root-preset',
  title: 'Google Chrome 书签管理器',
  children: [
    {
      id: 'f-bookmarks-bar',
      title: '书签栏 (Bookmarks Bar)',
      folderPath: ['书签栏'],
      children: [
        {
          id: 'f-self-dev',
          title: '🛠️ 我的自研与内部微工具 (私有系统)',
          folderPath: ['书签栏', '我的自研与内部微工具'],
          children: [
            {
              id: 'bm-self-1',
              title: '自研 SQL 语法检查与索引建议器',
              shortTitle: 'SQL检查',
              url: 'http://localhost:8080/sql-validator',
              icon: 'Database',
              isCustomTool: true,
              isPinnedToDock: true,
              description: '自研 AST 解析器，实时检查 SQL 慢查询并给出复合索引建立建议',
              folderPath: ['书签栏', '我的自研与内部微工具'],
            },
            {
              id: 'bm-self-2',
              title: '团队私有微服务网关控制台',
              shortTitle: '私有网关',
              url: 'http://gateway.corp.internal:9000',
              icon: 'Network',
              isCustomTool: true,
              isPinnedToDock: false,
              description: '公司内部跨机房服务发现、鉴权 Token 验签与限流熔断',
              folderPath: ['书签栏', '我的自研与内部微工具'],
            },
            {
              id: 'bm-self-3',
              title: '自研自动化部署 Webhook 触发台',
              shortTitle: '发布流水',
              url: 'http://ci.team.local:3001/deploy',
              icon: 'GitBranch',
              isCustomTool: true,
              isPinnedToDock: false,
              description: '一键派发流水线到预发/测试环境，支持热回滚与镜像状态监控',
              folderPath: ['书签栏', '我的自研与内部微工具'],
            },
            {
              id: 'bm-self-4',
              title: '本地 Mock 接口伪数据发生器',
              shortTitle: 'Mock数据',
              url: 'http://localhost:4000/mock-faker',
              icon: 'Terminal',
              isCustomTool: true,
              isPinnedToDock: true,
              description: '基于 Faker.js 快速模拟前端接口 JSON 结构并支持延迟模拟',
              folderPath: ['书签栏', '我的自研与内部微工具'],
            },
          ],
        },
        {
          id: 'f-fe-tools',
          title: '⚡ 常用高频前端与排错工具',
          folderPath: ['书签栏', '常用高频前端与排错工具'],
          children: [
            {
              id: 'bm-fe-1',
              title: 'JSONDiff 复杂多层接口数据比对',
              shortTitle: 'JSON比对',
              url: 'https://www.jsondiff.com',
              icon: 'GitCompare',
              isCustomTool: false,
              isPinnedToDock: true,
              description: '比对联调接口与生产环境返回的复杂结构差异',
              folderPath: ['书签栏', '常用高频前端与排错工具'],
            },
            {
              id: 'bm-fe-2',
              title: 'CanIUse 浏览器特性兼容矩阵',
              shortTitle: 'CanIUse',
              url: 'https://caniuse.com',
              icon: 'Globe',
              isCustomTool: false,
              isPinnedToDock: false,
              description: '查询 CSS Grid, Subgrid, View Transitions 全球浏览器支持度',
              folderPath: ['书签栏', '常用高频前端与排错工具'],
            },
            {
              id: 'bm-fe-3',
              title: 'Bundlephobia NPM 依赖包体积检测',
              shortTitle: '包体积',
              url: 'https://bundlephobia.com',
              icon: 'Package',
              isCustomTool: false,
              isPinnedToDock: false,
              description: '引入前评估 npm 依赖的 Gzip 体积、树摇支持与打包耗时',
              folderPath: ['书签栏', '常用高频前端与排错工具'],
            },
            {
              id: 'bm-fe-4',
              title: 'Transform Tools 代码与类型一键转换',
              shortTitle: '类型转换',
              url: 'https://transform.tools',
              icon: 'Code2',
              isCustomTool: false,
              isPinnedToDock: false,
              description: 'JSON 转 TypeScript 类型、SVG 转 JSX、CSS 转 Tailwind',
              folderPath: ['书签栏', '常用高频前端与排错工具'],
            },
          ],
        },
        {
          id: 'f-design',
          title: '🎨 架构设计与产品草图',
          folderPath: ['书签栏', '架构设计与产品草图'],
          children: [
            {
              id: 'bm-des-1',
              title: 'Excalidraw 协同架构手绘板',
              shortTitle: '架构草图',
              url: 'https://excalidraw.com',
              icon: 'Edit3',
              isCustomTool: false,
              isPinnedToDock: true,
              description: '快速画系统架构图、泳道图与技术方案草稿',
              folderPath: ['书签栏', '架构设计与产品草图'],
            },
            {
              id: 'bm-des-2',
              title: 'Mobbin 移动与网页端 UI 灵感库',
              shortTitle: 'Mobbin',
              url: 'https://mobbin.com',
              icon: 'Sparkles',
              isCustomTool: false,
              isPinnedToDock: false,
              description: '参考国外优秀 App 与 SaaS 产品的前沿交互设计规范',
              folderPath: ['书签栏', '架构设计与产品草图'],
            },
          ],
        },
        {
          id: 'f-docs',
          title: '📚 官方文档与技术速查',
          folderPath: ['书签栏', '官方文档与技术速查'],
          children: [
            {
              id: 'bm-doc-1',
              title: 'DevDocs 全栈离线 API 速查手册',
              shortTitle: 'API速查',
              url: 'https://devdocs.io',
              icon: 'BookOpen',
              isCustomTool: false,
              isPinnedToDock: false,
              description: '汇集 React, TypeScript, Rust, Go, Python 核心文档',
              folderPath: ['书签栏', '官方文档与技术速查'],
            },
            {
              id: 'bm-doc-2',
              title: 'Tailwind CSS 官方最新文档',
              shortTitle: 'Tailwind',
              url: 'https://tailwindcss.com',
              icon: 'Palette',
              isCustomTool: false,
              isPinnedToDock: false,
              description: 'Utility-first CSS 类名速查与现代布局指南',
              folderPath: ['书签栏', '官方文档与技术速查'],
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Flattens a tree into a list of leaf bookmarks
 */
export function flattenBookmarkTree(node: BookmarkTreeNode): BookmarkTreeNode[] {
  const result: BookmarkTreeNode[] = [];
  function traverse(n: BookmarkTreeNode) {
    if (n.url) {
      result.push(n);
    }
    if (n.children) {
      n.children.forEach(traverse);
    }
  }
  traverse(node);
  return result;
}

/**
 * Counts total bookmarks inside a tree node
 */
export function countTreeBookmarks(node: BookmarkTreeNode): number {
  if (node.url) return 1;
  if (!node.children) return 0;
  return node.children.reduce((acc, child) => acc + countTreeBookmarks(child), 0);
}

/**
 * Gathers all bookmark IDs under a node
 */
export function getAllBookmarkIdsUnderNode(node: BookmarkTreeNode): string[] {
  const ids: string[] = [];
  function traverse(n: BookmarkTreeNode) {
    if (n.url) {
      ids.push(n.id);
    }
    if (n.children) {
      n.children.forEach(traverse);
    }
  }
  traverse(node);
  return ids;
}
