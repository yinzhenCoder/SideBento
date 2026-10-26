import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseChromeBookmarksHtml,
  generateSampleChromeBookmarksHtml,
  collectAllBookmarkLeafIds,
  flattenSelectedBookmarkTree,
  SAMPLE_CHROME_BOOKMARK_TREE,
} from './chromeBookmarksParser';

test('parseChromeBookmarksHtml parses Netscape bookmarks format into tree', () => {
  const html = generateSampleChromeBookmarksHtml();
  const tree = parseChromeBookmarksHtml(html);
  assert.equal(tree.children?.length! > 0, true);

  const allLeaves = collectAllBookmarkLeafIds(tree);
  assert.equal(allLeaves.length >= 4, true);
});

test('flattenSelectedBookmarkTree retains folder hierarchy', () => {
  const tree = SAMPLE_CHROME_BOOKMARK_TREE;
  const leafIds = collectAllBookmarkLeafIds(tree);
  const selectedSet = new Set(leafIds);

  const flattened = flattenSelectedBookmarkTree(tree, selectedSet);
  assert.equal(flattened.length, leafIds.length);

  const sqlTool = flattened.find((b) => b.url.includes('sql-validator'));
  assert.notEqual(sqlTool, undefined);
  assert.equal(sqlTool?.folderPath.includes('自研与团队工具'), true);
  assert.equal(sqlTool?.isCustomTool, true);
});
