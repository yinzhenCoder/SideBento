import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_BROWSER_BOOKMARKS,
  toggleBookmarkPin,
  addCustomBookmark,
  filterBookmarks,
} from './bookmarkManager';

test('toggleBookmarkPin flips isPinnedToDock state', () => {
  const list = INITIAL_BROWSER_BOOKMARKS;
  const targetId = list[0].id;
  const originalPinned = list[0].isPinnedToDock;

  const toggled = toggleBookmarkPin(list, targetId);
  const updatedItem = toggled.find((b) => b.id === targetId);
  assert.equal(updatedItem?.isPinnedToDock, !originalPinned);
});

test('addCustomBookmark creates new custom self-developed tool', () => {
  const list = INITIAL_BROWSER_BOOKMARKS;
  const createdList = addCustomBookmark(list, {
    title: '我的自动化脚本',
    shortTitle: '自动脚本',
    url: 'http://localhost:4000',
    icon: 'Terminal',
    folder: '自研内部工具',
    isCustomTool: true,
    isPinnedToDock: true,
    openMode: 'drawer',
  });

  assert.equal(createdList.length, list.length + 1);
  assert.equal(createdList[0].title, '我的自动化脚本');
  assert.equal(createdList[0].isCustomTool, true);
  assert.equal(createdList[0].isPinnedToDock, true);
});

test('filterBookmarks filters by query and folder', () => {
  const list = INITIAL_BROWSER_BOOKMARKS;
  const filtered = filterBookmarks(list, 'SQL');
  assert.equal(filtered.length >= 1, true);
  assert.equal(filtered[0].title.includes('SQL'), true);

  const folderFiltered = filterBookmarks(list, '', '自研内部工具');
  assert.equal(folderFiltered.every((b) => b.folder === '自研内部工具'), true);
});
