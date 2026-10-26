/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { DOCK_ITEMS } from './mock/dockData';
import { DockItem, FolderBookmark, ToastMessage, DockCategory } from './types';
import { VerticalDockRail } from './components/VerticalDockRail';
import { BentoDrawer } from './components/BentoDrawer';
import { UnderlyingWebpage } from './components/UnderlyingWebpage';
import { DomCropperModal } from './components/DomCropperModal';
import { AddBookmarkModal } from './components/AddBookmarkModal';
import { BookmarkMountManagerModal } from './components/BookmarkMountManagerModal';
import { ToastContainer } from './components/Toast';
import {
  INITIAL_BROWSER_BOOKMARKS,
  BrowserBookmarkItem,
  toggleBookmarkPin,
  addCustomBookmark,
} from './utils/bookmarkManager';

export default function App() {
  const [baseItems, setBaseItems] = useState<DockItem[]>(DOCK_ITEMS);
  const [browserBookmarks, setBrowserBookmarks] = useState<BrowserBookmarkItem[]>(
    INITIAL_BROWSER_BOOKMARKS
  );

  const [activeItemId, setActiveItemId] = useState<string | null>('timestamp');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isExpandedLabels, setIsExpandedLabels] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Layout mode: isPushMode = true guarantees underlying webpage content is NEVER covered!
  const [isPushMode, setIsPushMode] = useState(true);
  const [drawerWidth, setDrawerWidth] = useState(540);

  // Modals state
  const [croppingBookmark, setCroppingBookmark] = useState<FolderBookmark | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBookmarkManagerOpen, setIsBookmarkManagerOpen] = useState(false);

  // Toast feedback state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    addToast(`已复制 ${label}: ${text.slice(0, 20)}${text.length > 20 ? '...' : ''}`, 'success');
  };

  // Convert pinned browser bookmarks and self-developed tools into Dock items
  const mountedDockItems: DockItem[] = useMemo(() => {
    return browserBookmarks
      .filter((b) => b.isPinnedToDock)
      .map((b) => ({
        id: `mounted-${b.id}`,
        title: b.title,
        shortTitle: b.shortTitle,
        icon: b.icon,
        category: 'bookmark',
        description: b.description || '浏览器已挂载微工具',
        badge: b.isCustomTool ? '自研' : '书签',
        color: b.isCustomTool ? 'emerald' : 'blue',
        bookmarkUrl: b.url,
        isBookmark: true,
        isCustomTool: b.isCustomTool,
        openMode: b.openMode,
      }));
  }, [browserBookmarks]);

  // Combined dock items: Base tools + User's Mounted Bookmarks + Folders + iFrames
  const allItems: DockItem[] = useMemo(() => {
    const tools = baseItems.filter((i) => i.category === 'tool');
    const folders = baseItems.filter((i) => i.category === 'folder');
    const iframes = baseItems.filter((i) => i.category === 'iframe');
    return [...tools, ...mountedDockItems, ...folders, ...iframes];
  }, [baseItems, mountedDockItems]);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Toggle bookmark pin to dock
  const handleToggleBookmarkPin = (bookmarkId: string) => {
    setBrowserBookmarks((prev) => {
      const updated = toggleBookmarkPin(prev, bookmarkId);
      const item = updated.find((b) => b.id === bookmarkId);
      if (item?.isPinnedToDock) {
        addToast(`已将「${item.title}」挂载到左侧 Dock 栏`, 'success');
      } else if (item) {
        addToast(`已从左侧 Dock 栏移除「${item.title}」`, 'info');
      }
      return updated;
    });
  };

  // Add new bookmark / self-developed tool from manager
  const handleAddBookmarkFromManager = (
    newBookmark: Omit<BrowserBookmarkItem, 'id' | 'isPinnedToDock'> & { isPinnedToDock?: boolean }
  ) => {
    setBrowserBookmarks((prev) => {
      const updated = addCustomBookmark(prev, newBookmark);
      return updated;
    });
    addToast(`已成功录入「${newBookmark.title}」并挂载到 Dock`, 'success');
  };

  // Open specific bookmark directly in drawer
  const handleOpenBookmarkInDrawer = (bookmarkId: string) => {
    // Ensure it's pinned
    setBrowserBookmarks((prev) =>
      prev.map((b) => (b.id === bookmarkId ? { ...b, isPinnedToDock: true } : b))
    );
    setActiveItemId(`mounted-${bookmarkId}`);
    setIsDrawerOpen(true);
  };

  // Click on dock item
  const handleSelectDockItem = (id: string) => {
    if (activeItemId === id && isDrawerOpen) {
      // Toggle off if clicking the active one
      setIsDrawerOpen(false);
    } else {
      setActiveItemId(id);
      setIsDrawerOpen(true);
    }
  };

  // Click on background webpage
  const handleBackgroundClick = () => {
    if (isDrawerOpen && !isPinned && !isPushMode) {
      setIsDrawerOpen(false);
    }
  };

  // Save cropped DOM selector
  const handleSaveCroppedSelector = (bookmarkId: string, selector: string) => {
    setBaseItems((prev) =>
      prev.map((item) => {
        if (!item.folderItems) return item;
        return {
          ...item,
          folderItems: item.folderItems.map((bm) =>
            bm.id === bookmarkId ? { ...bm, selector, isCropped: true } : bm
          ),
        };
      })
    );
    addToast(`已将 DOM 节点 [${selector}] 注入到微缩书签卡`, 'success');
  };

  // Add new item from general modal
  const handleAddNewItem = (newItem: {
    title: string;
    shortTitle: string;
    url?: string;
    category: DockCategory;
    description: string;
  }) => {
    if (newItem.category === 'bookmark' || newItem.url) {
      // Register in browserBookmarks
      handleAddBookmarkFromManager({
        title: newItem.title,
        shortTitle: newItem.shortTitle,
        url: newItem.url || 'https://example.com',
        icon: 'Cpu',
        folder: '我的自研工具',
        isCustomTool: true,
        description: newItem.description,
        openMode: 'drawer',
        isPinnedToDock: true,
      });
      setActiveItemId(`mounted-custom-${newItem.title}`);
      setIsDrawerOpen(true);
      return;
    }

    const id = `custom-${Date.now()}`;
    const created: DockItem = {
      id,
      title: newItem.title,
      shortTitle: newItem.shortTitle,
      icon: newItem.category === 'folder' ? 'Folder' : newItem.category === 'iframe' ? 'Globe' : 'Sparkles',
      category: newItem.category,
      description: newItem.description,
      color: 'blue',
      iframeUrl: newItem.url,
      folderItems:
        newItem.category === 'folder'
          ? [
              {
                id: `bm-${Date.now()}`,
                name: newItem.title,
                url: newItem.url || 'https://example.com',
                desc: newItem.description,
                icon: 'Globe',
                category: '自定义',
              },
            ]
          : undefined,
    };

    setBaseItems((prev) => [created, ...prev]);
    setActiveItemId(id);
    setIsDrawerOpen(true);
    addToast(`已添加「${newItem.title}」到 SideBento`, 'success');
  };

  const activeItem = allItems.find((i) => i.id === activeItemId) || null;
  const dockWidth = isExpandedLabels ? 134 : 54;

  // Compute exact leftOffset so dock rail and drawer NEVER cover underlying webpage content
  const pageLeftOffset = isPushMode && isDrawerOpen
    ? dockWidth + drawerWidth + 24
    : dockWidth;

  // Bookmark current simulated webpage into SideBento
  const handleBookmarkCurrentPage = () => {
    handleAddBookmarkFromManager({
      title: 'sidebento-glass-engine (GitHub 源码仓库)',
      shortTitle: 'GitHub仓库',
      url: 'https://github.com/octocat/sidebento-glass-engine',
      icon: 'Github',
      folder: '日常高频站点',
      description: 'SideBento 核心开源架构工程与组件代码',
      openMode: 'drawer',
      isCustomTool: false,
      isPinnedToDock: true,
    });
  };

  const togglePushMode = () => {
    const nextMode = !isPushMode;
    setIsPushMode(nextMode);
    addToast(
      nextMode
        ? '已开启自适应推挤模式（网页自动右移避让，绝对不遮挡任何内容）'
        : '已切换为悬浮覆盖模式（半屏毛玻璃悬浮在网页上方）',
      'info'
    );
  };

  return (
    <div className={`relative min-h-screen ${isDarkMode ? 'dark' : ''} overflow-x-hidden`}>
      {/* 1. Underlying Webpage (Adaptively offset so it is NEVER covered) */}
      <UnderlyingWebpage
        onPageClick={handleBackgroundClick}
        leftOffset={pageLeftOffset}
        isPushMode={isPushMode}
        onTogglePushMode={togglePushMode}
        onBookmarkCurrentPage={handleBookmarkCurrentPage}
      />

      {/* 2. Left Vertical Dock Rail with Mounted Bookmarks */}
      <VerticalDockRail
        items={allItems}
        activeItemId={isDrawerOpen ? activeItemId : null}
        onSelectItem={handleSelectDockItem}
        isExpandedLabels={isExpandedLabels}
        onToggleLabels={() => setIsExpandedLabels(!isExpandedLabels)}
        onOpenBookmarkManager={() => setIsBookmarkManagerOpen(true)}
      />

      {/* 3. Slide-over Bento Workspace (Frosted Glass Floating/Pushed Drawer) */}
      <BentoDrawer
        isOpen={isDrawerOpen}
        dockWidth={dockWidth}
        drawerWidth={drawerWidth}
        onDrawerWidthChange={setDrawerWidth}
        activeItem={activeItem}
        onClose={() => setIsDrawerOpen(false)}
        isPinned={isPinned}
        onTogglePin={() => {
          setIsPinned(!isPinned);
          addToast(isPinned ? '已取消钉住，点击网页空白将自动收起' : '已钉住面板，点击网页不收起', 'info');
        }}
        isPushMode={isPushMode}
        onTogglePushMode={togglePushMode}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenBookmarkManager={() => setIsBookmarkManagerOpen(true)}
        onOpenCropper={(bm) => setCroppingBookmark(bm)}
        onCopy={handleCopy}
        onNotify={(msg) => addToast(msg, 'info')}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* 4. Bookmark & Self-developed Tool Mounting Manager Modal */}
      <BookmarkMountManagerModal
        isOpen={isBookmarkManagerOpen}
        onClose={() => setIsBookmarkManagerOpen(false)}
        bookmarks={browserBookmarks}
        onTogglePin={handleToggleBookmarkPin}
        onAddBookmark={handleAddBookmarkFromManager}
        onOpenInDrawer={handleOpenBookmarkInDrawer}
      />

      {/* 5. DOM Cropper Modal */}
      <DomCropperModal
        bookmark={croppingBookmark}
        onClose={() => setCroppingBookmark(null)}
        onSave={handleSaveCroppedSelector}
      />

      {/* 6. Add Bookmark / Web Tool Modal */}
      <AddBookmarkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddNewItem}
      />

      {/* 7. Feedback Toasts */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
