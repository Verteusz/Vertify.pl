
"use client";

import { Edit, Trash2, GripVertical, Copy } from "lucide-react";
import { Block } from "@/lib/stores/editor-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BlockWrapperProps {
  block: Block;
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  isSelected: boolean;
}

export function BlockWrapper({ 
  block, 
  children, 
  onEdit, 
  onDelete, 
  onDuplicate,
  isSelected 
}: BlockWrapperProps) {
  return (
    <div 
      className={cn(
        "group relative transition-all duration-200",
        isSelected && "ring-2 ring-blue-500 ring-offset-2"
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (!isSelected) onEdit();
      }}
    >
      {/* Block controls */}
      <div className="absolute -left-16 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <div className="flex flex-col gap-1 bg-white border rounded-md shadow-lg p-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 cursor-grab"
            draggable
          >
            <GripVertical className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Block content */}
      <div className="relative cursor-pointer">
        {children}
      </div>

      {/* Block type indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium z-10">
          {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block
        </div>
      )}
    </div>
  );
}
