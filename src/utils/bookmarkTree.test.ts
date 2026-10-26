import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRESET_CHROME_BOOKMARKS_TREE,
  flattenBookmarkTree,
  countTreeBookmarks,
  getAllBookmarkIdsUnderNode,
} from './bookmarkTree';

test('PRESET_CHROME_BOOKMARKS_TREE contains hierarchical folders and bookmarks', () => {
  const root = PRESET_CHROME_BOOKMARKS_TREE;
  assert.equal(root.title, 'Google Chrome 书签管理器');
  assert.ok(root.children && root.children.length > 0);

  const flat = flattenBookmarkTree(root);
  assert.ok(flat.length >= 10, 'Expected at least 10 bookmarks in preset');

  // Verify self-dev tools exist
  const selfDevTools = flat.filter((b) => b.isCustomTool);
  assert.ok(selfDevTools.length >= 3, 'Expected at least 3 self dev tools');
  assert.ok(selfDevTools.some((t) => t.title.includes('SQL')));
});

test('countTreeBookmarks computes accurate number of leaf bookmarks', () => {
  const total = countTreeBookmarks(PRESET_CHROME_BOOKMARKS_TREE);
  const flat = flattenBookmarkTree(PRESET_CHROME_BOOKMARKS_TREE);
  assert.equal(total, flat.length);
});

test('getAllBookmarkIdsUnderNode collects all descendant IDs', () => {
  const selfDevFolder = PRESET_CHROME_BOOKMARKS_TREE.children?.[0]?.children?.[0];
  assert.ok(selfDevFolder);
  const ids = getAllBookmarkIdsUnderNode(selfDevFolder);
  assert.ok(ids.length >= 3);
  assert.ok(ids.includes('bm-self-1'));
});
