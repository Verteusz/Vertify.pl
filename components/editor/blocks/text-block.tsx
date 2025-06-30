
"use client";

import { useState } from "react";
import { Block } from "@/lib/stores/editor-store";
import { BlockWrapper } from "./block-wrapper";
import { Textarea } from "@/components/ui/textarea";

interface TextBlockProps {
  block: Block;
  isPreviewMode: boolean;
  onUpdate: (content: Record<string, any>) => void;
  onDelete: () => void;
}

export function TextBlock({ block, isPreviewMode, onUpdate, onDelete }: TextBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { text = "Enter your text here..." } = block.content;

  const handleUpdate = (value: string) => {
    onUpdate({
      ...block.content,
      text: value,
    });
  };

  if (isPreviewMode) {
    return (
      <div className="prose max-w-none">
        <p className="text-lg leading-relaxed">{text}</p>
      </div>
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
            <label className="block text-sm font-medium mb-1">Text Content</label>
            <Textarea
              value={text}
              onChange={(e) => handleUpdate(e.target.value)}
              placeholder="Enter your text content"
              rows={5}
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
        <div className="prose max-w-none cursor-pointer p-4 border rounded hover:bg-gray-50"
          onClick={() => setIsEditing(true)}
        >
          <p className="text-lg leading-relaxed">{text}</p>
        </div>
      )}
    </BlockWrapper>
  );
}
