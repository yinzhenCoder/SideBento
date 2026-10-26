/**
 * Chrome Bookmark Tree Structure, Netscape HTML Parser, and Mounting Logic
 */

export interface ChromeBookmarkNode {
  id: string;
  title: string;
  url?: string; // If present, it's a bookmark leaf; if absent, it's a folder
  children?: ChromeBookmarkNode[];
  dateAdded?: number;
  icon?: string;
  isCustomTool?: boolean;
}

export interface FlattenedBookmark {
  id: string;
  title: string;
  shortTitle: string;
  url: string;
  folderPath: string; // e.g. "书签栏 / 自研内部工具"
  folder: string;
  icon: string;
  isCustomTool: boolean;
  isPinnedToDock: boolean;
  description: string;
}

/**
 * Rich simulated Google Chrome Bookmarks Tree
 */
export const SAMPLE_CHROME_BOOKMARK_TREE: ChromeBookmarkNode = {
  id: 'root',
  title: 'Chrome 书签栏',
  children: [
    {
      id: 'f-internal',
      title: '自研与团队工具',
      children: [
        {
          id: 'b-sql',
          title: '我的自研 SQL 语法检查器',
          url: 'http://localhost:8080/sql-validator',
          icon: 'Database',
          isCustomTool: true,
        },
        {
          id: 'b-gateway',
          title: '团队私有微服务网关控制台',
          url: 'http://gateway.corp.internal:9000',
          icon: 'Network',
          isCustomTool: true,
        },
        {
          id: 'b-deploy',
          title: '自动化发版 Webhook 触发台',
          url: 'http://ci.team.local:3001/deploy',
          icon: 'Terminal',
          isCustomTool: true,
        },
      ],
    },
    {
      id: 'f-frontend',
      title: '前端与架构灵感',
      children: [
        {
          id: 'b-tailwind',
          title: 'Tailwind CSS 官方文档',
          url: 'https://tailwindcss.com',
          icon: 'Layers',
        },
        {
          id: 'b-lucide',
          title: 'Lucide Icons 矢量图标库',
          url: 'https://lucide.dev',
          icon: 'Sparkles',
        },
        {
          id: 'b-bundle',
          title: 'Bundlephobia NPM 依赖体积查询',
          url: 'https://bundlephobia.com',
          icon: 'Package',
        },
      ],
    },
    {
      id: 'f-api-debug',
      title: '接口调试与数据分析',
      children: [
        {
          id: 'b-jsondiff',
          title: 'JSONDiff 复杂多层数据比对',
          url: 'https://www.jsondiff.com',
          icon: 'GitCompare',
        },
        {
          id: 'b-caniuse',
          title: 'CanIUse 浏览器特性兼容矩阵',
          url: 'https://caniuse.com',
          icon: 'Globe',
        },
      ],
    },
    {
      id: 'f-daily',
      title: '日常高频站点',
      children: [
        {
          id: 'b-excali',
          title: 'Excalidraw 架构协作手绘板',
          url: 'https://excalidraw.com',
          icon: 'Edit3',
        },
        {
          id: 'b-devdocs',
          title: 'DevDocs 综合离线 API 速查手册',
          url: 'https://devdocs.io',
          icon: 'BookOpen',
        },
      ],
    },
  ],
};

/**
 * Standard Netscape Bookmark HTML sample generator (compatible with Google Chrome Bookmark Manager export)
 */
export function generateSampleChromeBookmarksHtml(): string {
  return `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file. Do not edit! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><H3 ADD_DATE="1700000000" LAST_MODIFIED="1700000000">书签栏</H3>
    <DL><p>
        <DT><H3 ADD_DATE="1700000000">自研与团队工具</H3>
        <DL><p>
            <DT><A HREF="http://localhost:8080/sql-validator" ADD_DATE="1700000000">我的自研 SQL 语法检查器</A>
            <DT><A HREF="http://gateway.corp.internal:9000" ADD_DATE="1700000000">团队私有微服务网关控制台</A>
        </DL><p>
        <DT><H3 ADD_DATE="1700000000">前端与架构灵感</H3>
        <DL><p>
            <DT><A HREF="https://tailwindcss.com" ADD_DATE="1700000000">Tailwind CSS 官方文档</A>
            <DT><A HREF="https://lucide.dev" ADD_DATE="1700000000">Lucide Icons 矢量图标库</A>
        </DL><p>
    </DL><p>
</DL><p>`;
}

/**
 * Parse Google Chrome Exported Bookmarks HTML into ChromeBookmarkNode hierarchy
 */
export function parseChromeBookmarksHtml(htmlText: string): ChromeBookmarkNode {
  const rootNode: ChromeBookmarkNode = {
    id: 'root',
    title: '导入的 Chrome 书签树',
    children: [],
  };

  const stack: { node: ChromeBookmarkNode }[] = [{ node: rootNode }];
  const lines = htmlText.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check for folder header: <DT><H3 ...>FolderName</H3>
    const h3Match = line.match(/<H3[^>]*>(.*?)<\/H3>/i);
    if (h3Match) {
      const folderName = h3Match[1].replace(/<[^>]+>/g, '').trim();
      const folderNode: ChromeBookmarkNode = {
        id: `f-${Math.random().toString(36).substring(2, 9)}`,
        title: folderName || '未命名文件夹',
        children: [],
      };
      const currentParent = stack[stack.length - 1].node;
      if (!currentParent.children) currentParent.children = [];
      currentParent.children.push(folderNode);
      stack.push({ node: folderNode });
      continue;
    }

    // Check for bookmark link: <DT><A HREF="url" ...>Title</A>
    const aMatch = line.match(/<A\s+[^>]*HREF=["']([^"']+)["'][^>]*>(.*?)<\/A>/i);
    if (aMatch) {
      const url = aMatch[1].trim();
      const title = aMatch[2].replace(/<[^>]+>/g, '').trim() || url;
      const isCustomTool = url.includes('localhost') || url.includes('.internal') || url.includes('corp.');
      const currentParent = stack[stack.length - 1].node;
      if (!currentParent.children) currentParent.children = [];
      currentParent.children.push({
        id: `bm-${Math.random().toString(36).substring(2, 9)}`,
        title,
        url,
        isCustomTool,
        icon: isCustomTool ? 'Cpu' : 'Globe',
      });
      continue;
    }

    // Check for DL closing tag (end of folder)
    if (/<\/DL>/i.test(line)) {
      if (stack.length > 1) {
        stack.pop();
      }
    }
  }

  return rootNode;
}

/**
 * Flattens selected nodes from a ChromeBookmarkNode tree into a list of bookmarks with their preserved folder path
 */
export function flattenSelectedBookmarkTree(
  node: ChromeBookmarkNode,
  selectedIds: Set<string>,
  parentPath = '',
  pinnedIds?: Set<string>
): FlattenedBookmark[] {
  const result: FlattenedBookmark[] = [];
  const currentPath = parentPath
    ? `${parentPath} / ${node.title}`
    : node.title === 'Chrome 书签栏' || node.id === 'root'
    ? ''
    : node.title;

  if (node.url && selectedIds.has(node.id)) {
    const isCustom = Boolean(node.isCustomTool || node.url.includes('localhost') || node.url.includes('.internal'));
    result.push({
      id: node.id,
      title: node.title,
      shortTitle: node.title.length > 4 ? node.title.slice(0, 4) : node.title,
      url: node.url,
      folderPath: parentPath || '默认书签目录',
      folder: parentPath.split(' / ').pop() || '未分类书签',
      icon: node.icon || (isCustom ? 'Cpu' : 'Globe'),
      isCustomTool: isCustom,
      isPinnedToDock: pinnedIds ? pinnedIds.has(node.id) : true,
      description: isCustom ? '自研常用微工具' : '导入的网页书签快捷直达',
    });
  }

  if (node.children) {
    for (const child of node.children) {
      result.push(...flattenSelectedBookmarkTree(child, selectedIds, currentPath, pinnedIds));
    }
  }

  return result;
}

/**
 * Collect all bookmark leaf IDs under a node (for select/deselect all)
 */
export function collectAllBookmarkLeafIds(node: ChromeBookmarkNode): string[] {
  const ids: string[] = [];
  if (node.url) {
    ids.push(node.id);
  }
  if (node.children) {
    for (const child of node.children) {
      ids.push(...collectAllBookmarkLeafIds(child));
    }
  }
  return ids;
}
