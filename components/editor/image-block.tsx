
"use client";

import { useState } from "react";
import Image from "next/image";
import { Block } from "@/lib/stores/editor-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

interface ImageBlockProps {
  block: Block;
  isEditing: boolean;
  onUpdate: (updates: Partial<Block>) => void;
}

export function ImageBlock({ block, isEditing, onUpdate }: ImageBlockProps) {
  const [localContent, setLocalContent] = useState(block.content);

  const handleUpdate = (field: string, value: string) => {
    const newContent = { ...localContent, [field]: value };
    setLocalContent(newContent);
    onUpdate({ content: newContent });
  };

  if (isEditing) {
    return (
      <div className="p-6 border-2 border-dashed border-green-300 bg-green-50">
        <div className="space-y-4">
          <div>
            <Label htmlFor="src">Image URL</Label>
            <Input
              id="src"
              value={localContent.src || ""}
              onChange={(e) => handleUpdate("src", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <Label htmlFor="alt">Alt Text</Label>
            <Input
              id="alt"
              value={localContent.alt || ""}
              onChange={(e) => handleUpdate("alt", e.target.value)}
              placeholder="Describe the image"
            />
          </div>
          <div>
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={localContent.caption || ""}
              onChange={(e) => handleUpdate("caption", e.target.value)}
              placeholder="Image caption (optional)"
              rows={2}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!localContent.src) {
    return (
      <div className="py-12 px-4 text-center border-2 border-dashed border-gray-300">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">Add an image URL to display an image</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image
            src={localContent.src}
            alt={localContent.alt || "Image"}
            fill
            className="object-cover"
          />
        </div>
        {localContent.caption && (
          <p className="mt-4 text-center text-gray-600 italic">
            {localContent.caption}
          </p>
        )}
      </div>
    </div>
  );
}
