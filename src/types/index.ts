export type DockCategory = 'tool' | 'folder' | 'iframe' | 'bookmark';

export interface FolderBookmark {
  id: string;
  name: string;
  url: string;
  desc: string;
  icon: string;
  category: string;
  selector?: string;
  isCropped?: boolean;
}

export interface DockItem {
  id: string;
  title: string;
  shortTitle: string;
  icon: string;
  category: DockCategory;
  description: string;
  badge?: string;
  color: string; // Tailwind color accent
  folderItems?: FolderBookmark[];
  iframeUrl?: string;
  isBookmark?: boolean;
  bookmarkUrl?: string;
  isCustomTool?: boolean;
  openMode?: 'drawer' | 'new_tab' | 'popup';
}

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}
