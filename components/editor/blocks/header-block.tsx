
"use client";

import { useState } from "react";
import { Block } from "@/lib/stores/editor-store";
import { BlockWrapper } from "./block-wrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface HeaderBlockProps {
  block: Block;
  isPreviewMode: boolean;
  onUpdate: (content: Record<string, any>) => void;
  onDelete: () => void;
}

export function HeaderBlock({ block, isPreviewMode, onUpdate, onDelete }: HeaderBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { title = "Header Title", subtitle = "Header Subtitle" } = block.content;

  const handleUpdate = (field: string, value: string) => {
    onUpdate({
      ...block.content,
      [field]: value,
    });
  };

  if (isPreviewMode) {
    return (
      <header className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-xl opacity-90">{subtitle}</p>
      </header>
    );
  }

  return (
    <BlockWrapper
      block={block}
      onEdit={() => setIsEditing(true)}
      onDelete={onDelete}
    >
      {isEditing ? (
        <div className="space-y-4 p-4 border rounded">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={title}
              onChange={(e) => handleUpdate("title", e.target.value)}
              placeholder="Enter header title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <Textarea
              value={subtitle}
              onChange={(e) => handleUpdate("subtitle", e.target.value)}
              placeholder="Enter header subtitle"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <header className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-xl opacity-90">{subtitle}</p>
        </header>
      )}
    </BlockWrapper>
  );
}
