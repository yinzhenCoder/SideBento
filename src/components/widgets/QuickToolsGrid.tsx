import React, { useState } from 'react';
import { TimestampWidget } from './TimestampWidget';
import { IdCardWidget } from './IdCardWidget';
import { JsonWidget } from './JsonWidget';
import { ImageCompressorWidget } from './ImageCompressorWidget';
import { DockItem } from '../../types';

interface Props {
  activeToolId: string | null;
  onCopy: (text: string, label: string) => void;
  onNotify: (msg: string) => void;
  activeItem?: DockItem;
}

export const QuickToolsGrid: React.FC<Props> = ({ activeToolId, onCopy, onNotify, activeItem }) => {
  const [isJsonFullscreen, setIsJsonFullscreen] = useState(false);

  // If JSON is in drawer fullscreen mode
  if (isJsonFullscreen) {
    return (
      <div className="h-full">
        <JsonWidget
          onCopy={onCopy}
          isFullscreen={true}
          onToggleFullscreen={() => setIsJsonFullscreen(false)}
        />
      </div>
    );
  }

  // If user clicked a specific tool on the dock
  if (activeToolId === 'timestamp') {
    return (
      <div className="space-y-4">
        <TimestampWidget onCopy={onCopy} />
        <div className="text-xs text-slate-400 dark:text-zinc-500 text-center pt-2">
          提示：点击上方 OmniBar 搜索或选择其他分类可浏览更多微工具
        </div>
      </div>
    );
  }

  if (activeToolId === 'idcard') {
    return (
      <div className="space-y-4">
        <IdCardWidget onCopy={onCopy} />
      </div>
    );
  }

  if (activeToolId === 'json') {
    return (
      <div className="space-y-4">
        <JsonWidget
          onCopy={onCopy}
          isFullscreen={false}
          onToggleFullscreen={() => setIsJsonFullscreen(true)}
        />
      </div>
    );
  }

  if (activeToolId === 'compress') {
    return (
      <div className="space-y-4">
        <ImageCompressorWidget onNotify={onNotify} />
      </div>
    );
  }

  // Default Overview / All Bento Cards View
  return (
    <div className="space-y-4">
      {/* Bento Grid Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
            全部高频微工具卡片
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            iOS 小组件风格 Bento Grid 排布，所有核心数据即时可交互
          </p>
        </div>
      </div>

      {/* Grid Cards (1x1 and 1x2 styles) */}
      <div className="space-y-4">
        {/* Widget 1: Timestamp */}
        <TimestampWidget onCopy={onCopy} />

        {/* Widget 2: ID Card Generator */}
        <IdCardWidget onCopy={onCopy} />

        {/* Widget 3: JSON Validator */}
        <JsonWidget
          onCopy={onCopy}
          isFullscreen={false}
          onToggleFullscreen={() => setIsJsonFullscreen(true)}
        />

        {/* Widget 4: Image Compressor */}
        <ImageCompressorWidget onNotify={onNotify} />
      </div>
    </div>
  );
};
