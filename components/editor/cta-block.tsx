
"use client";

import { useState } from "react";
import { Block } from "@/lib/stores/editor-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CTABlockProps {
  block: Block;
  isEditing: boolean;
  onUpdate: (updates: Partial<Block>) => void;
}

export function CTABlock({ block, isEditing, onUpdate }: CTABlockProps) {
  const [localContent, setLocalContent] = useState(block.content);

  const handleUpdate = (field: string, value: string) => {
    const newContent = { ...localContent, [field]: value };
    setLocalContent(newContent);
    onUpdate({ content: newContent });
  };

  if (isEditing) {
    return (
      <div className="p-6 border-2 border-dashed border-blue-300 bg-blue-50">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={localContent.title || ""}
              onChange={(e) => handleUpdate("title", e.target.value)}
              placeholder="Enter CTA title"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={localContent.description || ""}
              onChange={(e) => handleUpdate("description", e.target.value)}
              placeholder="Enter description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={localContent.buttonText || ""}
                onChange={(e) => handleUpdate("buttonText", e.target.value)}
                placeholder="Get Started"
              />
            </div>
            <div>
              <Label htmlFor="buttonUrl">Button URL</Label>
              <Input
                id="buttonUrl"
                value={localContent.buttonUrl || ""}
                onChange={(e) => handleUpdate("buttonUrl", e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 text-center bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {localContent.title || "Ready to get started?"}
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          {localContent.description || "Join thousands of satisfied customers today."}
        </p>
        <Button size="lg" className="px-8 py-3 text-lg">
          {localContent.buttonText || "Get Started"}
        </Button>
      </div>
    </div>
  );
}
