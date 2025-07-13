
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Trash2, Settings, GripVertical, Copy } from "lucide-react";
import { getBlockType } from "@/lib/block-types";

interface Block {
  id: string;
  type: string;
  content: any;
  settings?: any;
}

interface BlockRendererProps {
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
  onContentChange: () => void;
  isEditingDisabled?: boolean;
}

export function BlockRenderer({ 
  blocks, 
  onBlocksChange, 
  onContentChange,
  isEditingDisabled = false 
}: BlockRendererProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleBlockUpdate = (blockId: string, newContent: any) => {
    if (isEditingDisabled) return;
    
    const updatedBlocks = blocks.map(block =>
      block.id === blockId ? { ...block, content: { ...block.content, ...newContent } } : block
    );
    onBlocksChange(updatedBlocks);
    onContentChange();
  };

  const handleBlockDelete = (blockId: string) => {
    if (isEditingDisabled) return;
    
    const updatedBlocks = blocks.filter(block => block.id !== blockId);
    onBlocksChange(updatedBlocks);
    onContentChange();
    setSelectedBlockId(null);
  };

  const handleBlockDuplicate = (blockId: string) => {
    if (isEditingDisabled) return;
    
    const blockToDuplicate = blocks.find(block => block.id === blockId);
    if (!blockToDuplicate) return;

    const newBlock = {
      ...blockToDuplicate,
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const blockIndex = blocks.findIndex(block => block.id === blockId);
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(blockIndex + 1, 0, newBlock);
    
    onBlocksChange(updatedBlocks);
    onContentChange();
  };

  const selectedBlock = selectedBlockId ? blocks.find(b => b.id === selectedBlockId) : null;

  if (blocks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground border-2 border-dashed border-muted-foreground/20 rounded-lg m-4">
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-lg mb-2 font-medium">No blocks yet</p>
          <p className="text-sm">Add your first block to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Main Canvas */}
      <div className="flex-1 p-4">
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              className={`group relative transition-all duration-200 ${
                selectedBlockId === block.id 
                  ? 'ring-2 ring-primary ring-offset-2' 
                  : 'hover:ring-1 hover:ring-muted-foreground/20'
              } ${isEditingDisabled ? 'pointer-events-none opacity-50' : ''}`}
              onClick={() => !isEditingDisabled && setSelectedBlockId(block.id)}
            >
              {/* Block Controls */}
              {!isEditingDisabled && (
                <div className={`absolute -top-10 left-0 z-10 flex items-center space-x-1 transition-opacity duration-200 ${
                  selectedBlockId === block.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <div className="bg-white border rounded-md shadow-sm flex items-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2"
                    >
                      <GripVertical className="h-3 w-3" />
                    </Button>
                    <div className="h-4 w-px bg-border" />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSettings(!showSettings);
                      }}
                      className="h-8 px-2"
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBlockDuplicate(block.id);
                      }}
                      className="h-8 px-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBlockDelete(block.id);
                      }}
                      className="h-8 px-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Block Content */}
              <BlockContent
                block={block}
                isSelected={selectedBlockId === block.id}
                onUpdate={(content) => handleBlockUpdate(block.id, content)}
                isEditingDisabled={isEditingDisabled}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && selectedBlock && !isEditingDisabled && (
        <div className="w-80 border-l bg-white">
          <BlockSettings
            block={selectedBlock}
            onUpdate={(content) => handleBlockUpdate(selectedBlock.id, content)}
            onClose={() => setShowSettings(false)}
          />
        </div>
      )}
    </div>
  );
}

interface BlockContentProps {
  block: Block;
  isSelected: boolean;
  onUpdate: (content: any) => void;
  isEditingDisabled: boolean;
}

function BlockContent({ block, isSelected, onUpdate, isEditingDisabled }: BlockContentProps) {
  const blockType = getBlockType(block.type);
  
  switch (block.type) {
    case 'text':
      return <TextBlock block={block} onUpdate={onUpdate} isSelected={isSelected} isEditingDisabled={isEditingDisabled} />;
    case 'heading':
      return <HeadingBlock block={block} onUpdate={onUpdate} isSelected={isSelected} isEditingDisabled={isEditingDisabled} />;
    case 'image':
      return <ImageBlock block={block} onUpdate={onUpdate} isSelected={isSelected} isEditingDisabled={isEditingDisabled} />;
    case 'cta':
      return <CTABlock block={block} onUpdate={onUpdate} isSelected={isSelected} isEditingDisabled={isEditingDisabled} />;
    case 'spacer':
      return <SpacerBlock block={block} onUpdate={onUpdate} isSelected={isSelected} isEditingDisabled={isEditingDisabled} />;
    case 'quote':
      return <QuoteBlock block={block} onUpdate={onUpdate} isSelected={isSelected} isEditingDisabled={isEditingDisabled} />;
    default:
      return (
        <div className="p-4 border border-dashed border-red-300 bg-red-50 rounded">
          <p className="text-red-600">Unknown block type: {block.type}</p>
          <p className="text-sm text-red-500 mt-1">Block type definition not found</p>
        </div>
      );
  }
}

// Block Components with Real-time Editing
function TextBlock({ block, onUpdate, isSelected, isEditingDisabled }: any) {
  const handleTextChange = (value: string) => {
    onUpdate({ text: value });
  };

  const style = {
    fontSize: `${block.content.fontSize || 16}px`,
    fontWeight: block.content.fontWeight || 'normal',
    textAlign: block.content.textAlign || 'left',
    color: block.content.color || '#000000',
  } as React.CSSProperties;

  return (
    <div className="p-4 rounded-lg border bg-white">
      {isSelected && !isEditingDisabled ? (
        <Textarea
          value={block.content.text || ''}
          onChange={(e) => handleTextChange(e.target.value)}
          className="min-h-[100px] border-none shadow-none resize-none focus:ring-0 p-0"
          style={style}
          placeholder="Enter your text..."
        />
      ) : (
        <div style={style} className="min-h-[50px] whitespace-pre-wrap">
          {block.content.text || 'Click to edit text...'}
        </div>
      )}
    </div>
  );
}

function HeadingBlock({ block, onUpdate, isSelected, isEditingDisabled }: any) {
  const handleContentChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const titleStyle = {
    textAlign: block.content.textAlign || 'center',
    color: block.content.titleColor || '#000000',
  } as React.CSSProperties;

  const subtitleStyle = {
    textAlign: block.content.textAlign || 'center',
    color: block.content.subtitleColor || '#666666',
  } as React.CSSProperties;

  const HeadingTag = block.content.level || 'h1';

  return (
    <div className="p-6 rounded-lg border bg-white text-center">
      {isSelected && !isEditingDisabled ? (
        <div className="space-y-3">
          <Input
            value={block.content.title || ''}
            onChange={(e) => handleContentChange('title', e.target.value)}
            className="text-3xl font-bold border-none shadow-none text-center focus:ring-0 p-0"
            style={titleStyle}
            placeholder="Enter title..."
          />
          <Input
            value={block.content.subtitle || ''}
            onChange={(e) => handleContentChange('subtitle', e.target.value)}
            className="text-xl border-none shadow-none text-center focus:ring-0 p-0"
            style={subtitleStyle}
            placeholder="Enter subtitle..."
          />
        </div>
      ) : (
        <div className="space-y-2">
          <HeadingTag className="text-3xl font-bold" style={titleStyle}>
            {block.content.title || 'Click to edit title...'}
          </HeadingTag>
          {block.content.subtitle && (
            <p className="text-xl text-muted-foreground" style={subtitleStyle}>
              {block.content.subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ImageBlock({ block, onUpdate, isSelected, isEditingDisabled }: any) {
  return (
    <div className="p-4 rounded-lg border bg-white">
      {block.content.src ? (
        <div className="text-center">
          <img
            src={block.content.src}
            alt={block.content.alt || 'Image'}
            className="max-w-full h-auto rounded-lg shadow-sm mx-auto"
            style={{
              borderRadius: `${block.content.borderRadius || 8}px`,
              width: block.content.width || '100%'
            }}
          />
          {block.content.caption && (
            <p className="text-sm text-muted-foreground mt-2">
              {block.content.caption}
            </p>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-12 text-center">
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-muted-foreground mb-2">Click to add image</p>
          {isSelected && !isEditingDisabled && (
            <Input
              type="url"
              placeholder="Enter image URL..."
              onChange={(e) => onUpdate({ src: e.target.value })}
              className="mt-2"
            />
          )}
        </div>
      )}
    </div>
  );
}

function CTABlock({ block, onUpdate, isSelected, isEditingDisabled }: any) {
  const style = {
    backgroundColor: block.content.backgroundColor || '#f8f9fa',
    textAlign: block.content.textAlign || 'center',
  } as React.CSSProperties;

  return (
    <div className="p-8 rounded-lg border" style={style}>
      {isSelected && !isEditingDisabled ? (
        <div className="space-y-4">
          <Input
            value={block.content.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="text-2xl font-semibold border-none shadow-none text-center focus:ring-0 p-0"
            placeholder="Enter CTA title..."
          />
          <Textarea
            value={block.content.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="border-none shadow-none text-center focus:ring-0 p-0 resize-none"
            placeholder="Enter description..."
            rows={2}
          />
          <div className="flex gap-2">
            <Input
              value={block.content.buttonText || ''}
              onChange={(e) => onUpdate({ buttonText: e.target.value })}
              placeholder="Button text..."
              className="flex-1"
            />
            <Input
              value={block.content.buttonUrl || ''}
              onChange={(e) => onUpdate({ buttonUrl: e.target.value })}
              placeholder="Button URL..."
              className="flex-1"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">
            {block.content.title || 'Call to Action Title'}
          </h3>
          {block.content.description && (
            <p className="text-muted-foreground">
              {block.content.description}
            </p>
          )}
          {block.content.buttonText && (
            <Button size="lg" className="mt-4">
              {block.content.buttonText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function SpacerBlock({ block, onUpdate, isSelected, isEditingDisabled }: any) {
  const height = parseInt(block.content.height || '40');
  
  return (
    <div 
      className={`rounded border-2 border-dashed transition-all ${
        isSelected ? 'border-primary bg-primary/5' : 'border-transparent hover:border-muted-foreground/20'
      }`}
      style={{ 
        height: `${height}px`,
        backgroundColor: block.content.backgroundColor || 'transparent'
      }}
    >
      {isSelected && (
        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
          Spacer - {height}px
        </div>
      )}
    </div>
  );
}

function QuoteBlock({ block, onUpdate, isSelected, isEditingDisabled }: any) {
  return (
    <div className="p-6 rounded-lg border-l-4 border-primary bg-muted/20">
      {isSelected && !isEditingDisabled ? (
        <div className="space-y-3">
          <Textarea
            value={block.content.quote || ''}
            onChange={(e) => onUpdate({ quote: e.target.value })}
            className="text-lg italic border-none shadow-none focus:ring-0 p-0 resize-none"
            placeholder="Enter quote..."
            rows={3}
          />
          <div className="flex gap-2">
            <Input
              value={block.content.author || ''}
              onChange={(e) => onUpdate({ author: e.target.value })}
              placeholder="Author name..."
              className="flex-1"
            />
            <Input
              value={block.content.position || ''}
              onChange={(e) => onUpdate({ position: e.target.value })}
              placeholder="Position/Company..."
              className="flex-1"
            />
          </div>
        </div>
      ) : (
        <div>
          <blockquote className="text-lg italic mb-4">
            "{block.content.quote || 'Click to add quote...'}"
          </blockquote>
          {(block.content.author || block.content.position) && (
            <cite className="text-sm text-muted-foreground">
              — {block.content.author}
              {block.content.position && `, ${block.content.position}`}
            </cite>
          )}
        </div>
      )}
    </div>
  );
}

// Block Settings Panel
interface BlockSettingsProps {
  block: Block;
  onUpdate: (content: any) => void;
  onClose: () => void;
}

function BlockSettings({ block, onUpdate, onClose }: BlockSettingsProps) {
  const blockType = getBlockType(block.type);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold flex items-center gap-2">
          <Settings className="h-4 w-4" />
          {blockType?.name} Settings
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Text Block Settings */}
        {block.type === 'text' && (
          <>
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Slider
                value={[parseInt(block.content.fontSize) || 16]}
                onValueChange={([value]) => onUpdate({ fontSize: value.toString() })}
                min={12}
                max={24}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                {block.content.fontSize || 16}px
              </div>
            </div>

            <div className="space-y-2">
              <Label>Font Weight</Label>
              <Select
                value={block.content.fontWeight || 'normal'}
                onValueChange={(value) => onUpdate({ fontWeight: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="lighter">Light</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Text Alignment</Label>
              <Select
                value={block.content.textAlign || 'left'}
                onValueChange={(value) => onUpdate({ textAlign: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="justify">Justify</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={block.content.color || '#000000'}
                  onChange={(e) => onUpdate({ color: e.target.value })}
                  className="w-12 h-10"
                />
                <Input
                  value={block.content.color || '#000000'}
                  onChange={(e) => onUpdate({ color: e.target.value })}
                  placeholder="#000000"
                />
              </div>
            </div>
          </>
        )}

        {/* Spacer Block Settings */}
        {block.type === 'spacer' && (
          <div className="space-y-2">
            <Label>Height</Label>
            <Slider
              value={[parseInt(block.content.height) || 40]}
              onValueChange={([value]) => onUpdate({ height: value.toString() })}
              min={10}
              max={200}
              step={10}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">
              {block.content.height || 40}px
            </div>
          </div>
        )}

        {/* Add more settings for other block types */}
      </div>
    </div>
  );
}
